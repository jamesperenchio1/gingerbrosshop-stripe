# Stress-test findings — 2026-04-27

Run before flipping to live mode. Captures everything I prodded, what I fixed inline, what's logged for later, and the data we should clear before launch.

## Embedded Stripe Checkout — what changed

The cart drawer's **"Pay online"** button no longer redirects to `checkout.stripe.com`. It now navigates to **`/checkout/pay`**, which renders Stripe's hosted form **inline on our domain** via `<EmbeddedCheckoutProvider>` from `@stripe/react-stripe-js`.

How it works:

1. The page POSTs to `/api/checkout` with `embedded: true`.
2. The route creates a Checkout Session with `ui_mode: "embedded_page"` and `return_url: /success?session_id={CHECKOUT_SESSION_ID}` (no `success_url`/`cancel_url` for embedded sessions).
3. We return the `clientSecret`.
4. The page mounts `<EmbeddedCheckout>` with that secret and the publishable key. Stripe drops a same-page iframe with the entire form: card / PromptPay / Apple Pay / Google Pay, address, promo codes, shipping options. None of that lives in our codebase — Stripe owns it, including PCI scope and SCA / 3DS handling.
5. On payment, the iframe navigates the parent to `return_url`. Our webhook fires the same `checkout.session.completed` event we already process — **so the existing email + KV + inventory pipeline is unchanged.**

**Verified live:**
- Order session created with `ui_mode: embedded` (Stripe renamed `embedded` → `embedded_page` — discovered + fixed).
- Iframe loads at `js.stripe.com/v3/embedded-checkout-inner-...` (565 × 1279 px on desktop).
- Renders test-mode banner + product photo + price + address form + payment fields, branded with Stripe's default theme.
- Webhook → Resend pipeline still delivers customer + owner emails.

A snapshot of the cart is taken when the page mounts so the order summary on the right doesn't flicker after Stripe completes (the cart gets cleared on success).

## Stress-test passes

### API edge cases — all return clean errors

| Scenario | Endpoint | Result |
|---|---|---|
| Empty cart | `POST /api/checkout` | `400 Invalid request` |
| Bad price ID | `POST /api/checkout` | `500 No such price` (Stripe error surfaced verbatim) |
| Negative qty | `POST /api/checkout` | `400 Invalid request` (zod) |
| 99999 qty | `POST /api/checkout` | `400 Invalid request` (zod max=50) |
| Missing items field | `POST /api/checkout` | `400 Invalid request` |
| COD without email | `POST /api/checkout method=cod` | `400 Email is required for COD orders` |
| Subscription embedded | `POST /api/checkout embedded:true` | `200 + clientSecret` ✓ |
| Bundle line item | `POST /api/checkout` | `200 + orderId + clientSecret` ✓ |
| Invalid review payload | `POST /api/reviews productId=unknown` | `400 Invalid review payload` |
| 6-star review | `POST /api/reviews rating=6` | `400 Invalid review payload` |
| Track without params | `GET /api/track` | `400 orderId and email are required` |
| Unknown product PDP | `GET /shop/foo` | `404` |
| Admin without secret | `GET /api/admin/orders` | `401 unauthorized` |

No surprise 500s. No leaked stack traces.

### Visual / responsive

**Issues found and fixed inline:**

1. **Comparison panel broke on mobile.** The desktop spec sheet uses `grid-template-columns: 180px repeat(3, 1fr)` (4 cols). My `gb-grid-4` rule collapses to `repeat(2, 1fr)` on mobile, which mangled the table — labels in column 1 didn't line up with the 3 product columns anymore.
   **Fix:** added `gb-show-desktop` / `gb-show-mobile` helper classes. Desktop keeps the spec sheet; mobile renders 3 stacked cards per product, each with photo + label + name on top, all 5 specs as a clean key/value list, price + Shop CTA at the bottom.

2. **Bundle line items in the cart were visually identical.** Different mixes were rendering with the same icon and same "Custom 6-Pack" subtitle. **Fix:** added `formatBundlePicks(picks)` that produces `"2× Beer · 3× Ale · 1× Shot"` and used it in cart drawer, checkout summary, and the Stripe Checkout line-item description.

3. **Custom 6-pack line items used to merge into one row** even when they were different mixes. **Fix:** every bundle now gets a unique `uid` so different mixes are separate cart rows.

4. **/success page** was a checkmark-and-not-much-else. **Fix:** rebuilt to show real order summary fetched live from the Stripe session, shipping address card, "What happens next" 3-step list, proper bottom padding before the dark footer.

5. **Hero "Brewed in Bangkok / 14-day ferment / glass bottles"** claim was misleading — only the beer + ale ferment, not the shot. **Fix:** trust row reframed to `0g added sugar / 48h bottle-to-doorstep / Glass not plastic`. Marquee + pull-quote rewritten.

6. **Provenance "Ginger from Chiang Rai"** pull-out was an unsourced claim. **Fix:** removed entirely.

7. **PDP "30-day hassle-free returns"** doesn't make sense for perishable. **Fix:** swapped for a freshness-guarantee section everywhere.

8. **PDP "How we brew it"** had generic copy. **Fix:** real ginger-bug-method recipe per product (beer/ale share a ferment, shot is cold-pressed only).

9. **Decision-strip "Mixing a cocktail / Drinking with dinner / Need a wake-up"** was quirky. **Fix:** killed entirely. Replaced with a clean Apple-style spec-sheet comparison panel.

10. **Empty review state** showed "Be the first to review" in shop cards even after reviews were posted. **Fix:** server-fetch summaries on home + PDP, refresh after submit via `router.refresh()`.

### Performance / SEO spot-checks

- **/admin/orders** is `noindex`, gated by `ADMIN_SECRET`.
- **/checkout/pay** is `noindex`.
- **icon.svg** served as the favicon (replaces default).
- **Dynamic** routes: home, PDP, checkout, success, tracking. **Static** routes: story, process, faq, recipes, etc.

### What I did NOT verify in browser

- A real test-card transaction completing through the iframe (cross-origin can't be driven from outside Stripe). Verified instead via:
  - Embedded session creation works (`ui_mode: embedded`).
  - Webhook handler runs on a `stripe trigger checkout.session.completed` event.
  - Resend delivers both customer + owner emails.

  The chain is the same as the redirect flow that's been verified live. The only change is the rendering surface — Stripe's iframe vs. their hosted page.

## Open items / followups

These are deferred — not blockers for launch:

- **Mobile UA detection for Apple Pay / Google Pay.** Stripe Embedded Checkout shows these automatically on supported devices, but Thailand's Apple Pay penetration is still <10%. Not worth optimizing yet.
- **PromptPay live capability.** Test mode is fine; Stripe needs to approve PromptPay for the live account (review takes a few business days). Already in [TODO.md].
- **Stripe Branding Center.** Logo + accent color upload happens in the dashboard, not via API. Currently the iframe shows Stripe's default styling — not bad, but logo/color customization would tighten cohesion. 5-minute Stripe dashboard task.
- **Image lazy-load.** Bottle photos and JPG gallery shots load eagerly. Not a perf issue at this catalog size, but worth converting to `next/image` for a launch follow-up.
- **CSP / iframe origin policies.** Stripe requires `js.stripe.com` and `*.stripe.com` to be allowed in any CSP. We don't ship a CSP yet — Vercel default applies. Add one before live.

## Test data to clear before launch

When you're ready to switch from test mode to live mode, **all test data should go**. Here's the single-command list to run:

```bash
# 1. Clear KV orders
until=$(date +%s); for k in $(curl -s "$KV_REST_API_URL/keys/gb:order:*" -H "Authorization: Bearer $KV_REST_API_TOKEN" | jq -r '.result[]'); do
  curl -s -X POST "$KV_REST_API_URL/del/$k" -H "Authorization: Bearer $KV_REST_API_TOKEN"
done

# 2. Clear KV reviews
for k in gb:reviews:beer gb:reviews:ale gb:reviews:shot; do
  curl -s -X POST "$KV_REST_API_URL/del/$k" -H "Authorization: Bearer $KV_REST_API_TOKEN"
done

# 3. Reset stock counts to seed values
for f in beer:480 ale:360 shot:600; do
  KEY=${f%:*}; VAL=${f#*:}
  curl -s -X POST "$KV_REST_API_URL/set/gb:stock:$KEY/$VAL" -H "Authorization: Bearer $KV_REST_API_TOKEN"
done
```

(Or just provision a fresh KV instance in live mode — same effect, simpler.)

**Stripe** also needs:
- Recreate products + prices + WELCOME10 coupon in **live mode** (test data doesn't cross over).
- Recreate the webhook endpoint in live mode → new `STRIPE_WEBHOOK_SECRET`.
- Update `lib/products.ts` with the live-mode price IDs.

Already documented in [TODO.md].

## Live URLs

- **Storefront**: https://gingerbrosshop-stripe.vercel.app
- **Embedded checkout**: https://gingerbrosshop-stripe.vercel.app/checkout/pay
- **Owner dashboard**: https://gingerbrosshop-stripe.vercel.app/admin/orders
- **Stripe (test)**: https://dashboard.stripe.com/test/payments
- **GitHub**: https://github.com/jamesperenchio1/gingerbrosshop-stripe
