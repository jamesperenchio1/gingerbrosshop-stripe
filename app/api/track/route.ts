import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StoredOrder = {
  orderId: string;
  status?: string;
  email?: string;
  sessionId?: string;
  method?: string;
  items?: { flavor?: string; title?: string; variant?: string; qty?: number }[];
  isSubscription?: boolean;
};

const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = (url.searchParams.get("orderId") ?? "").trim().toUpperCase();
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();

  if (!orderId || !email) {
    return NextResponse.json({ error: "orderId and email are required" }, { status: 400 });
  }
  if (!HAS_KV) {
    return NextResponse.json({ error: "Order lookup is unavailable in this environment" }, { status: 503 });
  }

  const stored = await kv.get<StoredOrder>(`gb:order:${orderId}`);
  if (!stored) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!stored.email || stored.email.toLowerCase() !== email) {
    return NextResponse.json({ error: "Email doesn't match the order" }, { status: 404 });
  }
  return NextResponse.json({ orderId, status: stored.status ?? "received" });
}
