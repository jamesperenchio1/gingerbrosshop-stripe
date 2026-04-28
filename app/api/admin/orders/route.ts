import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StoredAddress = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

type StoredOrder = {
  orderId: string;
  status?: string;
  email?: string;
  sessionId?: string;
  method?: "stripe" | "cod";
  isSubscription?: boolean;
  items?: { flavor?: string; title?: string; variant?: string; qty?: number }[];
  shippingAddress?: StoredAddress | null;
  shippingName?: string | null;
  shippingPhone?: string | null;
};

const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!HAS_KV) return NextResponse.json({ error: "KV not provisioned" }, { status: 500 });

  // Scan all order keys
  let cursor: string | number = 0;
  const keys: string[] = [];
  // upper bound: a few thousand orders is fine; cap iterations defensively
  for (let i = 0; i < 200; i++) {
    const res: [string | number, string[]] = await kv.scan(cursor, { match: "gb:order:*", count: 200 });
    cursor = res[0];
    keys.push(...res[1]);
    if (cursor === 0 || cursor === "0") break;
  }

  if (keys.length === 0) return NextResponse.json({ orders: [] });

  const values = await Promise.all(keys.map(k => kv.get<StoredOrder>(k)));
  const orders = values.filter((o): o is StoredOrder => !!o);

  // Newest first by orderId timestamp prefix (GB-YYYYMMDD-XXXXXX), fallback to lexical
  orders.sort((a, b) => (b.orderId ?? "").localeCompare(a.orderId ?? ""));

  return NextResponse.json({ orders });
}
