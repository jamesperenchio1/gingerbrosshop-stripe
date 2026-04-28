import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, siteUrl } from "@/lib/stripe";
import { kv } from "@vercel/kv";
import { z } from "zod";
import { formatBundlePicks, getProduct } from "@/lib/products";
import type { FlavorId } from "@/lib/products";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sign } from "@/lib/sign";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PHONE_RE = /^[0-9+\-\s()]{8,20}$/;
const MAX_TOTAL_QTY = 60;

const Item = z.object({
  id: z.string(),
  flavor: z.enum(["beer", "shot", "ale", "unpast"]),
  title: z.string().max(120),
  variant: z.string().max(40),
  priceId: z.string().optional(),
  bundlePicks: z.array(z.enum(["beer", "shot", "ale"])).optional(),
  price: z.number(),
  qty: z.number().int().min(1).max(50),
  sub: z.boolean().optional(),
});

const Body = z.object({
  items: z.array(Item).min(1).max(20),
  customer: z.object({
    email: z.string().email().or(z.literal("")).optional(),
    first: z.string().max(60).optional(),
    last: z.string().max(60).optional(),
    phone: z.string().regex(PHONE_RE, "Invalid phone").optional().or(z.literal("")),
  }).optional().default({}),
  shipping: z.object({
    method: z.enum(["std", "next"]).default("std"),
  }).optional().default({ method: "std" }),
  method: z.literal("stripe").default("stripe"),
  embedded: z.boolean().optional(),
}).superRefine((data, ctx) => {
  const totalQty = data.items.reduce((a, i) => a + i.qty, 0);
  if (totalQty > MAX_TOTAL_QTY) {
    ctx.addIssue({ code: "custom", message: `Cart exceeds ${MAX_TOTAL_QTY} items total`, path: ["items"] });
  }
});

/** Recompute bundle unit price server-side from the picks. Trust nothing the client sent. */
function bundleUnitPrice(picks: FlavorId[]): number {
  const sum = picks.reduce((a, f) => a + getProduct(f).single, 0);
  return Math.round(sum * 0.9);
}

function newOrderId(): string {
  const stamp = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GB-${stamp}-${rand}`;
}

export async function POST(req: Request) {
  const rl = await rateLimit({ bucket: "checkout", ip: clientIp(req), limit: 10, windowSec: 60 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests, slow down" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message ?? "Invalid request" : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Server-side price computation. We trust priceId for catalog lookups and recompute bundle price from picks.
  let items: typeof body.items;
  try {
    items = body.items.map(i => {
      if (i.id === "bundle") {
        const picks = (i.bundlePicks ?? []) as FlavorId[];
        if (picks.length !== 6) throw new Error("Bundle must contain exactly 6 picks");
        return { ...i, price: bundleUnitPrice(picks) };
      }
      return i;
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid bundle" }, { status: 400 });
  }

  const orderId = newOrderId();
  const isSubscription = items.some(i => i.sub);
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);

  const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

  // ---- Stripe Checkout path ----
  type CreateParams = NonNullable<Parameters<typeof stripe.checkout.sessions.create>[0]>;
  type LineItem = NonNullable<CreateParams["line_items"]>[number];
  const lineItems: LineItem[] = items.map(i => {
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
    allow_promotion_codes: true,
    metadata: { orderId, source: "gingerbrosshop", isSubscription: isSubscription ? "1" : "0" },
    payment_method_types: isSubscription ? ["card"] : ["card", "promptpay"],
  };

  if (body.embedded) {
    // Embedded Checkout — Stripe-hosted form rendered inline on our site.
    sessionParams.ui_mode = "embedded_page";
    sessionParams.return_url = `${siteUrl()}/success?session_id={CHECKOUT_SESSION_ID}`;
  } else {
    // Hosted (redirect) Checkout — fallback path.
    sessionParams.success_url = `${siteUrl()}/success?session_id={CHECKOUT_SESSION_ID}`;
    sessionParams.cancel_url = `${siteUrl()}/`;
  }
  if (body.customer.email) {
    sessionParams.customer_email = body.customer.email;
  }

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
      items: items.map(i => ({ priceId: i.priceId, flavor: i.flavor, title: i.title, variant: i.variant, qty: i.qty })),
    });
  }

  // Signed cookie scopes /success access to the buyer in this browser. Short-lived.
  try {
    const c = await cookies();
    c.set("gb_order", sign(orderId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });
  } catch {
    // cookies() can throw outside a request scope (RSC stream edge); non-fatal.
  }

  if (body.embedded) {
    return NextResponse.json({ orderId, clientSecret: session.client_secret, sessionId: session.id });
  }
  return NextResponse.json({ orderId, url: session.url });
}
