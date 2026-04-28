import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/order-shipping?orderId=GB-...&secret=...
// Returns shipping name/phone/address for the given order. Pulled from KV first;
// falls back to fetching the Stripe Checkout Session for legacy orders that
// pre-date the webhook persisting these fields. Caches back into KV on success.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");
  const secret = url.searchParams.get("secret");

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });
  if (!process.env.KV_REST_API_URL) return NextResponse.json({ error: "KV not provisioned" }, { status: 500 });

  const existing = (await kv.get(`gb:order:${orderId}`)) as Record<string, unknown> | null;
  if (!existing) return NextResponse.json({ error: "order not found" }, { status: 404 });

  // Already cached.
  if (existing.shippingAddress) {
    return NextResponse.json({
      shippingAddress: existing.shippingAddress,
      shippingName: existing.shippingName ?? null,
      shippingPhone: existing.shippingPhone ?? null,
      source: "kv",
    });
  }

  const sessionId = existing.sessionId as string | undefined;
  if (!sessionId) {
    return NextResponse.json({ error: "no session id; can't backfill" }, { status: 404 });
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "stripe error" }, { status: 502 });
  }

  const collected = session.collected_information?.shipping_details ?? null;
  const customer = session.customer_details ?? null;
  const shippingAddress = collected?.address ?? customer?.address ?? null;
  const shippingName = collected?.name ?? customer?.name ?? null;
  const shippingPhone = customer?.phone ?? null;

  if (shippingAddress) {
    await kv.set(`gb:order:${orderId}`, { ...existing, shippingAddress, shippingName, shippingPhone });
  }

  return NextResponse.json({ shippingAddress, shippingName, shippingPhone, source: "stripe" });
}
