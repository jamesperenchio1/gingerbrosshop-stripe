import { NextResponse } from "next/server";
import { stripe, siteUrl } from "@/lib/stripe";
import { z } from "zod";

export const runtime = "nodejs";

const Body = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  let parsed: z.infer<typeof Body>;
  try { parsed = Body.parse(await req.json()); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const list = await stripe.customers.list({ email: parsed.email, limit: 1 });
  const customer = list.data[0];
  if (!customer) return NextResponse.json({ error: "No customer found for that email" }, { status: 404 });

  const portal = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${siteUrl()}/`,
  });
  return NextResponse.json({ url: portal.url });
}
