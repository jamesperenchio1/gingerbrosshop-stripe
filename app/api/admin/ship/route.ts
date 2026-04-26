import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

// GET /api/admin/ship?orderId=GB-...&secret=...&status=shipped
export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");
  const secret = url.searchParams.get("secret");
  const status = (url.searchParams.get("status") ?? "shipped") as "received" | "brewing" | "packed" | "shipped" | "delivered";

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });
  if (!process.env.KV_REST_API_URL) return NextResponse.json({ error: "KV not provisioned" }, { status: 500 });

  const existing = (await kv.get(`gb:order:${orderId}`)) as Record<string, unknown> | null;
  if (!existing) return NextResponse.json({ error: "order not found" }, { status: 404 });
  await kv.set(`gb:order:${orderId}`, { ...existing, status });
  return NextResponse.json({ orderId, status });
}
