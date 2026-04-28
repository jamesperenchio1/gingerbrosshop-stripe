import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { stripe, siteUrl } from "@/lib/stripe";
import { verify } from "@/lib/sign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

function expired(message: string) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Link expired</title>
    <style>body{margin:0;background:#FDF6EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2C1810;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
    .card{background:#fff;border-radius:18px;padding:32px;max-width:480px;text-align:center;box-shadow:0 4px 16px rgba(44,24,16,0.05)}
    h1{font-family:Georgia,serif;font-size:28px;margin:0 0 12px}
    p{color:rgba(44,24,16,0.7);font-size:15px;line-height:1.55;margin:0 0 20px}
    a{display:inline-block;padding:12px 22px;background:#C8893C;color:#fff;border-radius:9999px;font-weight:700;text-decoration:none;font-size:14px}</style>
    </head><body><div class="card">
    <h1>Link expired or already used</h1>
    <p>${message}</p>
    <a href="/account">Get a new link</a>
    </div></body></html>`;
  return new NextResponse(html, { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token: rawToken } = await ctx.params;
  const token = decodeURIComponent(rawToken);

  if (!verify(token)) {
    return expired("This link is invalid. Request a new one and try again.");
  }

  if (!HAS_KV) {
    return expired("Portal links require server storage that isn't configured here.");
  }

  // Atomic single-use: GETDEL returns the value and deletes it.
  const email = (await kv.getdel(`gb:portal-token:${token}`)) as string | null;
  if (!email) {
    return expired("Portal links expire after 15 minutes and work only once.");
  }

  const list = await stripe.customers.list({ email, limit: 1 });
  const customer = list.data[0];
  if (!customer) {
    return expired("We couldn't find a customer for that email anymore.");
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${siteUrl()}/`,
  });

  return NextResponse.redirect(portal.url, { status: 302 });
}
