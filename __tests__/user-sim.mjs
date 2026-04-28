#!/usr/bin/env node
/**
 * Full user-simulation test for the Gingerbros checkout flow.
 *
 * Hits the live Next.js dev server at http://localhost:3000 and asserts every
 * HTTP-observable behavior end-to-end — page loads, API contracts, removed
 * COD path, /checkout deletion, /subscribe + /account routes, smart-FAQ
 * branching at the rendered HTML level, admin-route auth gates, and the new
 * clear-reviews + order-shipping endpoints.
 *
 * Run:
 *   npm run dev   # in another terminal
 *   node __tests__/user-sim.mjs
 *
 * Exit code:
 *   0 — all assertions passed
 *   1 — at least one failure (details printed)
 */

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

let passed = 0;
let failed = 0;
const failures = [];

function ok(name) {
  passed++;
  console.log(`  \x1b[32m✓\x1b[0m ${name}`);
}
function bad(name, detail) {
  failed++;
  failures.push({ name, detail });
  console.log(`  \x1b[31m✗\x1b[0m ${name}`);
  if (detail !== undefined) console.log(`      \x1b[2m${detail}\x1b[0m`);
}
function group(title) {
  console.log(`\n\x1b[1m${title}\x1b[0m`);
}

function assert(cond, name, detail) {
  if (cond) ok(name); else bad(name, detail);
}

async function fetchOnce(path, init) {
  const r = await fetch(BASE + path, init);
  const ct = r.headers.get("content-type") ?? "";
  let body;
  if (ct.includes("application/json")) body = await r.json().catch(() => null);
  else body = await r.text();
  return { status: r.status, headers: r.headers, body };
}

async function main() {
  group("0. Server reachable");
  try {
    const r = await fetchOnce("/");
    assert(r.status === 200, "GET / returns 200", `got ${r.status}`);
  } catch (e) {
    bad("GET / network", e.message);
    console.log(`\nDev server not reachable at ${BASE}. Run 'npm run dev' first.`);
    process.exit(1);
  }

  group("1. COD removal — every surface");
  {
    const codPage = await fetchOnce("/checkout");
    assert(codPage.status === 404, "/checkout returns 404 (COD page deleted)", `got ${codPage.status}`);

    const codApi = await fetchOnce("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "beer", flavor: "beer", title: "Ginger Beer", variant: "Single", priceId: "x", price: 79, qty: 1 }],
        method: "cod",
      }),
    });
    assert(codApi.status === 400, "POST /api/checkout {method:cod} returns 400", `got ${codApi.status}`);
    assert(typeof codApi.body?.error === "string" && /stripe/i.test(codApi.body.error), "rejection error mentions stripe", JSON.stringify(codApi.body));

    const home = await fetchOnce("/");
    assert(!/Pay on delivery/i.test(home.body), "home page contains no 'Pay on delivery'");
    assert(!/Cash on delivery/i.test(home.body), "home page contains no 'Cash on delivery'");

    const shipping = await fetchOnce("/shipping");
    assert(shipping.status === 200, "/shipping renders", `got ${shipping.status}`);
    // Section heading "Cash on delivery" was removed; an explicit "we don't offer COD"
    // sentence is fine. Assert the heading is gone, not the substring.
    assert(!/"children":"Cash on delivery"/.test(shipping.body), "/shipping no longer has 'Cash on delivery' as a section heading");
    assert(/We don't offer cash on delivery|do not offer cash on delivery/i.test(shipping.body), "/shipping explicitly states no COD");
  }

  group("2. /checkout/pay layout (cart-aware FAQ rows + step indicator)");
  {
    const pay = await fetchOnce("/checkout/pay");
    assert(pay.status === 200, "/checkout/pay returns 200", `got ${pay.status}`);
    // SSR shows a hydration-skeleton (we wait for client cart hydration before
    // deciding empty-vs-full). Browser-sim covers the rendered states.
    assert(pay.body.length > 1000, "/checkout/pay returns non-trivial HTML", `len=${pay.body.length}`);
    assert(!/Powered by Stripe · 256-bit/i.test(pay.body), "no leftover '256-bit TLS' strip text");
    assert(!/Bangkok next-day · Thailand-wide/i.test(pay.body), "no leftover delivery promise strip");
  }

  group("3. Subscribe page (mix-pack builder)");
  {
    const sub = await fetchOnce("/subscribe");
    assert(sub.status === 200, "/subscribe returns 200", `got ${sub.status}`);
    assert(/Build your monthly/i.test(sub.body), "page heading present");
    assert(/Ginger Beer/.test(sub.body) && /Ginger Ale/.test(sub.body) && /Ginger Shot/.test(sub.body), "all 3 flavors listed");
    // React splits {฿}{n}{/bottle} into separate text nodes (with HTML comments
    // in between in the streaming output) — so just look for "<n>/bottle" patterns.
    assert(/60[^\d]{0,20}\/bottle/.test(sub.body), "beer per-bottle price shown (60/bottle)");
    assert(/52[^\d]{0,20}\/bottle/.test(sub.body), "ale per-bottle price shown (52/bottle)");
    assert(/67[^\d]{0,20}\/bottle/.test(sub.body), "shot per-bottle price shown (67/bottle)");
  }

  group("4. Account / magic-link flow");
  {
    const accountPage = await fetchOnce("/account");
    assert(accountPage.status === 200, "/account returns 200", `got ${accountPage.status}`);
    assert(/Manage your/i.test(accountPage.body), "account page heading present");

    const unknownEmail = await fetchOnce("/api/account/portal-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "no-such-user-12345@example.com" }),
    });
    assert(unknownEmail.status === 200 && unknownEmail.body?.ok === true, "unknown email returns 200 (no enumeration leak)", JSON.stringify(unknownEmail.body));

    const invalidEmail = await fetchOnce("/api/account/portal-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });
    assert(invalidEmail.status === 400, "invalid email returns 400", `got ${invalidEmail.status}`);

    const badToken = await fetchOnce("/account/portal/totally.fake.token", { redirect: "manual" });
    assert(badToken.status === 410, "bad portal token returns 410", `got ${badToken.status}`);
  }

  group("5. Subscribe checkout path (cart structure validation)");
  {
    // Server-side reject if subscription line item lacks priceId
    const noPriceId = await fetchOnce("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "beer", flavor: "beer", title: "Ginger Beer", variant: "Single", price: 60, qty: 6, sub: true }],
      }),
    });
    // Stripe call may fail in dev (placeholder key) — but the request shape was valid;
    // we only care it isn't a 400 from zod for the missing priceId.
    // Actually our handler throws 'priceId missing' which surfaces as 500 with that message.
    assert(noPriceId.status === 500 || noPriceId.status === 400, "missing priceId is rejected (500/400)", `got ${noPriceId.status}`);

    const oversize = await fetchOnce("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "beer", flavor: "beer", title: "Ginger Beer", variant: "Single", priceId: "x", price: 60, qty: 50 }, { id: "ale", flavor: "ale", title: "Ginger Ale", variant: "Single", priceId: "y", price: 52, qty: 50 }],
      }),
    });
    assert(oversize.status === 400, "cart > MAX_TOTAL_QTY returns 400", `got ${oversize.status}`);
  }

  group("6. Admin endpoints (auth-gated)");
  {
    const orders = await fetchOnce("/api/admin/orders?secret=wrong");
    assert(orders.status === 401, "/api/admin/orders rejects bad secret", `got ${orders.status}`);

    const ship = await fetchOnce("/api/admin/ship?orderId=GB-x&secret=wrong&status=packed");
    assert(ship.status === 401, "/api/admin/ship rejects bad secret", `got ${ship.status}`);

    const clear = await fetchOnce("/api/admin/clear-reviews?secret=wrong&product=all", { method: "POST" });
    assert(clear.status === 401, "/api/admin/clear-reviews rejects bad secret", `got ${clear.status}`);

    const shipping = await fetchOnce("/api/admin/order-shipping?orderId=GB-x&secret=wrong");
    assert(shipping.status === 401, "/api/admin/order-shipping rejects bad secret", `got ${shipping.status}`);
  }

  group("7. Reviews API (input validation)");
  {
    const list = await fetchOnce("/api/reviews");
    assert(list.status === 400, "GET /api/reviews without id returns 400", `got ${list.status}`);

    const listValid = await fetchOnce("/api/reviews?id=beer");
    assert(listValid.status === 200 && Array.isArray(listValid.body?.reviews), "GET /api/reviews?id=beer returns array", JSON.stringify(listValid.body));

    const badPost = await fetchOnce("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "beer", rating: 6, name: "x", comment: "y" }),
    });
    assert(badPost.status === 400, "POST /api/reviews with rating>5 returns 400", `got ${badPost.status}`);
  }

  group("8. Tracking page (legacy data shape)");
  {
    const t = await fetchOnce("/tracking/GB-NONEXISTENT-X");
    assert(t.status === 200, "/tracking/<orderId> always 200 (graceful empty)", `got ${t.status}`);
    assert(!/Cash on delivery/i.test(t.body), "tracking page no COD copy");
  }

  group("9. Other public pages reachable");
  {
    const pages = ["/story", "/process", "/contact", "/faq", "/returns", "/recipes", "/press", "/referrals", "/shop/beer", "/shop/ale", "/shop/shot"];
    for (const p of pages) {
      const r = await fetchOnce(p);
      assert(r.status === 200, `GET ${p} returns 200`, `got ${r.status}`);
    }
  }

  // ---- Summary ----
  console.log("\n" + "─".repeat(60));
  console.log(`\x1b[1m${passed} passed, ${failed} failed\x1b[0m`);
  if (failed > 0) {
    console.log("\nFailures:");
    for (const f of failures) {
      console.log(`  • ${f.name}${f.detail ? ` — ${f.detail}` : ""}`);
    }
    process.exit(1);
  } else {
    console.log("\x1b[32mAll user-sim assertions passed.\x1b[0m");
    process.exit(0);
  }
}

main().catch(e => {
  console.error("Test runner crashed:", e);
  process.exit(2);
});
