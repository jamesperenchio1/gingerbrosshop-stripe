import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, siteUrl } from "@/lib/stripe";
import { kv } from "@vercel/kv";
import { z } from "zod";
import { sendOrderEmails } from "@/lib/resend";
import { formatBundlePicks } from "@/lib/products";
import type { FlavorId } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Item = z.object({
  id: z.string(),
  flavor: z.enum(["beer", "shot", "ale", "unpast"]),
  title: z.string(),
  variant: z.string(),
  priceId: z.string().optional(),
  bundlePicks: z.array(z.string()).optional(),
  price: z.number(),
  qty: z.number().int().min(1).max(50),
  sub: z.boolean().optional(),
});

const Body = z.object({
  items: z.array(Item).min(1),
  customer: z.object({
    email: z.string().email(),
    first: z.string().optional(),
    last: z.string().optional(),
    phone: z.string().optional(),
  }),
  shipping: z.object({
    addr1: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
    method: z.enum(["std", "next"]).default("std"),
  }),
  method: z.enum(["stripe", "cod"]).default("stripe"),
});

function newOrderId(): string {
  const stamp = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GB-${stamp}-${rand}`;
}

export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const orderId = newOrderId();
  const isSubscription = body.items.some(i => i.sub);
  const subtotal = body.items.reduce((a, i) => a + i.price * i.qty, 0);
  const shippingCost = body.method === "cod"
    ? (subtotal >= 500 ? 0 : 60)
    : (body.shipping.method === "next" ? 120 : (subtotal >= 500 ? 0 : 60));

  const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

  // ---- COD path: skip Stripe Checkout, just record + email ----
  if (body.method === "cod") {
    const total = subtotal + shippingCost;
    const trackUrl = `${siteUrl()}/tracking/${orderId}`;
    if (HAS_KV) {
      await kv.set(`gb:order:${orderId}`, {
        orderId,
        status: "received",
        email: body.customer.email,
        method: "cod",
        items: body.items.map(i => ({ priceId: i.priceId, flavor: i.flavor, title: i.title, variant: i.variant, qty: i.qty })),
      });
    }
    try {
      await sendOrderEmails({
        orderId,
        email: body.customer.email,
        total, shipping: shippingCost, subtotal,
        items: body.items.map(i => ({ title: i.title, variant: i.variant, qty: i.qty, price: i.price })),
        trackUrl,
        isCOD: true,
      });
    } catch (e) {
      console.error("[cod email]", e);
    }
    return NextResponse.json({ orderId, url: trackUrl });
  }

  // ---- Stripe Checkout path ----
  type CreateParams = NonNullable<Parameters<typeof stripe.checkout.sessions.create>[0]>;
  type LineItem = NonNullable<CreateParams["line_items"]>[number];
  const lineItems: LineItem[] = body.items.map(i => {
    if (i.id === "bundle") {
      const breakdown = formatBundlePicks(i.bundlePicks as FlavorId[] | undefined);
      return {
        quantity: i.qty,
        price_data: {
          currency: "thb",
          unit_amount: i.price * 100,
          product_data: {
            name: `Mix-your-own 6-Pack — ${breakdown}`,
            description: `Custom 6-pack: ${breakdown}`,
          },
        },
      };
    }
    if (!i.priceId) throw new Error("priceId missing for non-bundle item");
    return { quantity: i.qty, price: i.priceId };
  });

  const sessionParams: CreateParams = {
    mode: isSubscription ? "subscription" : "payment",
    line_items: lineItems,
    customer_email: body.customer.email,
    allow_promotion_codes: true,
    success_url: `${siteUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/checkout`,
    metadata: { orderId, source: "gingerbrosshop", isSubscription: isSubscription ? "1" : "0" },
    payment_method_types: isSubscription ? ["card"] : ["card", "promptpay"],
  };

  // Always let Stripe collect the shipping address — it's the source of truth.
  sessionParams.shipping_address_collection = { allowed_countries: ["TH"] };
  sessionParams.phone_number_collection = { enabled: true };

  if (!isSubscription) {
    sessionParams.shipping_options = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: subtotal >= 500 ? "Standard · Kerry Express (Free)" : "Standard · Kerry Express",
          fixed_amount: { amount: subtotal >= 500 ? 0 : 6000, currency: "thb" },
          delivery_estimate: { minimum: { unit: "business_day", value: 3 }, maximum: { unit: "business_day", value: 5 } },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "Bangkok next-day",
          fixed_amount: { amount: 12000, currency: "thb" },
          delivery_estimate: { minimum: { unit: "business_day", value: 1 }, maximum: { unit: "business_day", value: 1 } },
        },
      },
    ];
  } else {
    sessionParams.subscription_data = { metadata: { orderId } };
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create(sessionParams);
  } catch (e) {
    console.error("[stripe] checkout.sessions.create failed:", e);
    const msg = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  if (HAS_KV) {
    await kv.set(`gb:order:${orderId}`, {
      orderId,
      status: "received",
      email: body.customer.email,
      sessionId: session.id,
      method: "stripe",
      items: body.items.map(i => ({ priceId: i.priceId, flavor: i.flavor, title: i.title, variant: i.variant, qty: i.qty })),
    });
  }

  return NextResponse.json({ orderId, url: session.url });
}
