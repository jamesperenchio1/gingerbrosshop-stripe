import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, siteUrl } from "@/lib/stripe";
import { kv } from "@vercel/kv";
import { decrementStock } from "@/lib/inventory";
import { sendOrderEmails } from "@/lib/resend";
import { PRICE_TO_PRODUCT, getProduct, type FlavorId } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("[webhook] signature failed:", e);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  // Idempotency: Stripe retries webhooks aggressively. The same event.id can
  // arrive multiple times — without this guard we'd double-decrement inventory
  // and double-send emails.
  if (HAS_KV) {
    const fresh = await kv.set(`gb:webhook:${event.id}`, "1", { nx: true, ex: 60 * 60 * 24 });
    if (fresh === null) {
      return NextResponse.json({ ok: true, dedup: true });
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCompleted(session);
  } else if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    // Optional: keep KV in sync
    const sub = event.data.object as Stripe.Subscription;
    if (HAS_KV) {
      const orderId = sub.metadata?.orderId as string | undefined;
      if (orderId) {
        const existing = (await kv.get(`gb:order:${orderId}`)) as Record<string, unknown> | null;
        await kv.set(`gb:order:${orderId}`, { ...(existing ?? {}), subscriptionId: sub.id, status: existing?.status ?? "received" });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

async function handleCompleted(session: Stripe.Checkout.Session) {
  const orderId = (session.metadata?.orderId as string) ?? session.id.slice(-10).toUpperCase();
  const isSubscription = session.mode === "subscription";
  const email = session.customer_details?.email ?? session.customer_email ?? "";

  // Pull line items with their prices
  const li = await stripe.checkout.sessions.listLineItems(session.id, { expand: ["data.price.product"], limit: 50 });

  const items: { title: string; variant: string; qty: number; price: number; flavor: string; priceId?: string }[] = [];
  for (const item of li.data) {
    const priceId = item.price?.id ?? "";
    const meta = PRICE_TO_PRODUCT[priceId];
    const qty = item.quantity ?? 1;
    if (meta) {
      const p = getProduct(meta.id);
      items.push({ title: p.title, variant: meta.variant, qty, price: Math.round((item.amount_total ?? 0) / 100 / qty), flavor: p.flavor, priceId });
    } else {
      items.push({ title: item.description ?? "Item", variant: "Bundle", qty, price: Math.round((item.amount_total ?? 0) / 100 / qty), flavor: "beer", priceId });
    }
  }

  // Decrement inventory
  for (const item of items) {
    if (!item.priceId) continue;
    const meta = PRICE_TO_PRODUCT[item.priceId];
    if (!meta) continue;
    const units = meta.variant === "Single" ? 1 : 6;
    try {
      await decrementStock(meta.id as FlavorId, units * item.qty);
    } catch (e) { console.error("[stock]", e); }
  }

  const subtotal = (session.amount_subtotal ?? items.reduce((a, i) => a + i.price * i.qty, 0) * 100) / 100;
  const shippingCost = ((session.shipping_cost?.amount_total ?? 0) / 100);
  const total = (session.amount_total ?? 0) / 100;

  let portalUrl: string | undefined;
  if (isSubscription && session.customer && typeof session.customer === "string") {
    try {
      const portal = await stripe.billingPortal.sessions.create({
        customer: session.customer,
        return_url: `${siteUrl()}/`,
      });
      portalUrl = portal.url;
    } catch (e) { console.error("[portal]", e); }
  }

  const trackUrl = `${siteUrl()}/tracking/${orderId}`;

  if (HAS_KV) {
    const existing = (await kv.get(`gb:order:${orderId}`)) as Record<string, unknown> | null;
    await kv.set(`gb:order:${orderId}`, {
      ...(existing ?? {}),
      orderId,
      status: "brewing",
      email,
      sessionId: session.id,
      method: "stripe",
      items: items.map(i => ({ priceId: i.priceId, flavor: i.flavor, title: i.title, variant: i.variant, qty: i.qty })),
      isSubscription,
      portalUrl,
    });
  }

  try {
    await sendOrderEmails({
      orderId,
      email,
      total, shipping: shippingCost, subtotal,
      items: items.map(i => ({ title: i.title, variant: i.variant, qty: i.qty, price: i.price })),
      trackUrl,
      portalUrl,
      isSubscription,
    });
  } catch (e) {
    console.error("[email]", e);
  }
}
