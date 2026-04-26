# Gingerbros — Storefront

Bangkok-based ginger drink shop running on Next.js 16 (App Router) + TypeScript, Stripe Checkout, Resend transactional email, and Vercel KV for inventory and orders.

## Stack

- **Next.js 16** App Router, TypeScript, Turbopack
- **Stripe Checkout** (hosted) — card, PromptPay, Apple Pay, Google Pay, subscriptions
- **Resend** — order confirmation + owner notifications (verified domain `gingerbrosshop.com`)
- **Vercel KV** — inventory counts and order records
- **Vercel** — hosting (`sin1` region)

## Local development

```bash
npm install
cp .env.example .env.local   # fill in
npm run dev
```

Open http://localhost:3000.

For the Stripe webhook locally:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
# copy the printed `whsec_...` into STRIPE_WEBHOOK_SECRET in .env.local
```

## Architecture

```
app/
  page.tsx                Home (Hero + Shop + TasteGuide + Bundle + Story + Subscription)
  shop/[id]/page.tsx      PDP per product
  checkout/page.tsx       3-step checkout — redirects to Stripe (or COD path)
  tracking/page.tsx       Static demo
  tracking/[orderId]/     Per-order timeline (KV + Stripe)
  success/page.tsx        Stripe redirect target
  api/checkout/route.ts   Creates Stripe Checkout Session (or COD record)
  api/stripe-webhook/...  Verifies signature, sends emails, decrements stock
  api/portal/route.ts     Customer portal session (subscriber self-serve)
  api/admin/ship/...      Manual "mark shipped" route, gated by ADMIN_SECRET

components/                Ported from the Claude Design handoff
lib/
  products.ts              Source of truth: product → Stripe price IDs
  stripe.ts                Server Stripe client
  resend.ts                Email send + HTML templates (customer + owner)
  cart.tsx                 React context + localStorage persistence
  inventory.ts             KV-backed stock counts; falls back to seeds without KV
```

### Cart / checkout flow

1. Cart is held in `CartProvider` and persisted to `localStorage`.
2. Checkout (`/checkout`) is a 3-step form (contact → shipping → payment).
3. On submit, `POST /api/checkout` creates a Stripe Checkout Session and the user is redirected to it. (COD short-circuits to a thank-you page.)
4. Stripe sends `checkout.session.completed` to `/api/stripe-webhook`.
5. The webhook decrements stock, writes an order record to KV, sends a Resend email to the customer + the owner. Subscriptions get a Stripe Customer Portal link.

### Bundle (mix-your-own 6-pack)

Computed client-side as 90% of the sum of singles, sent to Stripe as a `price_data` line item (Stripe still controls the actual amount charged).

### Inventory

- KV key per flavor: `gb:stock:beer`, `gb:stock:shot`, etc.
- Seed values live in `lib/inventory.ts`.
- `decrementStock` is called from the webhook on each successful checkout.
- Without KV, the lib falls back to seed counts so the UI still renders in dev.

## Launch checklist

See [TODO.md](./TODO.md) — kept up-to-date as we go. Stripe is currently in **test mode**; the live-mode swap is the first item.

## Environment variables

| Var | Purpose |
|---|---|
| `STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` | Stripe API keys (test or live) |
| `STRIPE_WEBHOOK_SECRET` | Set after creating the webhook in the Stripe dashboard |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM` | Verified sender, e.g. `Gingerbros <orders@gingerbrosshop.com>` |
| `OWNER_EMAIL` | Where new-order notifications go (`gingerbros.brew@gmail.com`) |
| `NEXT_PUBLIC_SITE_URL` | Public origin (used in success URLs and email links) |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Auto-set by the Vercel KV integration |
| `ADMIN_SECRET` | Random string used to gate `/api/admin/ship` |

