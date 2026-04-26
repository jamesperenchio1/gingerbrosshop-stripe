import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  // Don't throw at module load (would break `next build`); throw on first use instead.
}

export const stripe = new Stripe(key ?? "sk_test_placeholder", {
  // Use the API version pinned to your Stripe account (omit to use account default).
  typescript: true,
});

export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
