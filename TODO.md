# Gingerbros launch checklist

Living list — update as work progresses. Order roughly reflects priority.

## Required before flipping Stripe to live mode

- [ ] Replace test Stripe keys with live keys (`STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`).
- [ ] Recreate the products + prices + WELCOME10 coupon in **live mode** (the same script can be re-run with the live secret key) and update the IDs in `lib/products.ts`.
- [ ] Recreate the webhook endpoint in **live mode** in the Stripe dashboard, paste the new `whsec_...` into Vercel env as `STRIPE_WEBHOOK_SECRET`, redeploy.
- [ ] Apply for **PromptPay live capability** in the Stripe dashboard (review can take a few business days).
- [ ] Create the legal pages:
  - [ ] `/privacy` — Privacy Policy (Thai PDPA + standard).
  - [ ] `/terms` — Terms of Service.
  - [ ] `/refunds` — Refund / returns policy.
- [ ] Confirm Thai VAT registration status; if registered, switch to "VAT 7% inclusive" wording (or enable Stripe Tax).
- [ ] Verify HTTPS works on `gingerbrosshop.com` (DNS records added at registrar; Vercel domain status "Valid Configuration").
- [ ] Run `mail-tester.com` against the production `RESEND_FROM` address and fix any SPF / DKIM / DMARC warnings.

## Strongly recommended before paid traffic

- [ ] Real product photography (replace the CSS-drawn bottles in `components/shared.tsx`).
- [ ] Replace placeholder OG image / favicon with brand assets in `public/`.
- [ ] Vercel Analytics + GA4 + Meta Pixel.
- [ ] Schema.org `Product` structured data on PDPs (rich results in Google).
- [ ] `sitemap.ts`, `robots.ts`, OpenGraph + Twitter card meta on every page.
- [ ] Cookie consent banner (Thai PDPA, plus GDPR if any EU traffic).
- [ ] Magic-link auth via Resend so returning customers see order history without re-entering email.
- [ ] Move bottle photos behind Cloudinary or Vercel Image (lazy-load + responsive).

## Storefront features deferred from v1

- [ ] Real Kerry Express tracking integration (currently a stub timeline + manual "shipped" flip via `/api/admin/ship`).
- [ ] Real reviews / ratings (currently static counts) — Stamped, Loox, or Trustpilot embed.
- [ ] Customer-facing cancel-subscription page (currently via portal link in email).
- [ ] Abandoned cart emails (Resend + Vercel Cron).
- [ ] Back-in-stock email signup for `Unpasteurized` and other low-stock SKUs.
- [ ] Gift cards (Stripe supports as a product).
- [ ] Loyalty / referral credits (mockup mentions ฿100 credits — needs a credits ledger).
- [ ] Wholesale / B2B inquiry form.
- [ ] Recipes / blog content for SEO.
- [ ] Thai / English language toggle (`next-intl`).
- [ ] LINE Official Account integration (huge in Thailand for customer support).
- [ ] SMS order updates (Twilio or LINE Notify).
- [ ] Age gate if any product crosses the alcohol threshold (live unpasteurized ferment can — get the abv tested).
- [ ] Server-side cart sync across devices (currently `localStorage`-only).
- [ ] PWA / install prompt.
- [ ] A/B test the hero variants the design tool already includes (`craft` / `maker` / `love`) via Vercel Edge Config.
- [ ] "X people viewing this" / live social proof widget.
- [ ] Wholesale pricing tier with `customer_metadata.tier` driving discounts in Stripe.
- [ ] Refund / return self-service workflow.
- [ ] Re-route the homepage announcement bar / nav link "Recipes" once those pages exist.
- [ ] Replace the static order tracking demo at `/tracking` with a "look up by email" form.

## Operational

- [ ] Set up Sentry or Vercel Error Tracking for the API routes.
- [ ] Add Vercel Cron to ping `/api/health` and Stripe API daily as a smoke test.
- [ ] Document the manual "mark shipped" flow:
      `GET /api/admin/ship?orderId=GB-...&secret=$ADMIN_SECRET&status=shipped`.
- [ ] Decide whether to migrate orders from KV to a real DB (Supabase/Postgres) before scale.
