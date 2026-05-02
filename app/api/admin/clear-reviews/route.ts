import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FLAVORS = ["beer"] as const;

// POST /api/admin/clear-reviews?secret=...&product=beer
// product=all clears every flavor.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const product = url.searchParams.get("product") ?? "all";

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.KV_REST_API_URL) {
    return NextResponse.json({ error: "KV not provisioned" }, { status: 500 });
  }

  const targets = product === "all"
    ? FLAVORS
    : FLAVORS.filter(f => f === product);
  if (targets.length === 0) {
    return NextResponse.json({ error: "invalid product" }, { status: 400 });
  }

  const results: Record<string, number> = {};
  for (const id of targets) {
    const key = `gb:reviews:${id}`;
    const before = await kv.llen(key);
    await kv.del(key);
    results[id] = before ?? 0;
  }
  return NextResponse.json({ cleared: results });
}
