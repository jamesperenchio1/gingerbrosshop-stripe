import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { kv } from "@vercel/kv";
import { stripe, siteUrl } from "@/lib/stripe";
import { sign } from "@/lib/sign";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendPortalMagicLink } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const TOKEN_TTL_SEC = 60 * 15; // 15 min

const Body = z.object({ email: z.string().email().max(200) });

export async function POST(req: Request) {
  const ip = clientIp(req);
  const ipRl = await rateLimit({ bucket: "portal-link-ip", ip, limit: 5, windowSec: 60 * 60 });
  if (!ipRl.ok) {
    return NextResponse.json({ error: "Too many requests, try again later" }, { status: 429 });
  }

  let parsed: z.infer<typeof Body>;
  try { parsed = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Enter a valid email" }, { status: 400 }); }

  const email = parsed.email.trim().toLowerCase();

  // Per-email rate limit on top of per-IP — guards against using one IP to spray many addresses.
  const emailRl = await rateLimit({ bucket: "portal-link-email", ip: email, limit: 3, windowSec: 60 * 60 });
  if (!emailRl.ok) {
    return NextResponse.json({ ok: true });
  }

  // Always look up the customer; only mint a link if they have at least one subscription.
  // Always return 200 to avoid leaking which emails exist as customers.
  try {
    const list = await stripe.customers.list({ email, limit: 1 });
    const customer = list.data[0];
    if (customer) {
      const subs = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 1 });
      if (subs.data.length > 0) {
        const token = sign(crypto.randomBytes(24).toString("hex"));
        if (HAS_KV) {
          await kv.set(`gb:portal-token:${token}`, email, { ex: TOKEN_TTL_SEC });
        }
        const url = `${siteUrl()}/account/portal/${encodeURIComponent(token)}`;
        await sendPortalMagicLink({ email, url }).catch(e => console.error("[portal-link email]", e));
      }
    }
  } catch (e) {
    console.error("[portal-link]", e);
  }

  return NextResponse.json({ ok: true });
}
