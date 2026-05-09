#!/usr/bin/env node
/**
 * Browser-driven simulation: opens a real Chromium via Playwright, drives the
 * site as a user would, and asserts everything that's only visible in the
 * client-rendered DOM (cart drawer, smart-FAQ branching, sticky card structure,
 * step indicator visibility).
 *
 * Pairs with __tests__/user-sim.mjs (HTTP-only).
 *
 * Usage:
 *   npm run dev   # in another terminal
 *   node __tests__/browser-sim.mjs
 *
 * Exit 0 = all green; exit 1 = at least one failure.
 */

import { chromium } from "playwright";

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
function group(title) { console.log(`\n\x1b[1m${title}\x1b[0m`); }
function assert(cond, name, detail) { cond ? ok(name) : bad(name, detail); }

async function setCart(page, cart) {
  await page.evaluate((c) => localStorage.setItem("gb-cart-v1", JSON.stringify(c)), cart);
}
async function clearCart(page) {
  await page.evaluate(() => localStorage.removeItem("gb-cart-v1"));
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  group("A. Home + nav");
  await page.goto(BASE + "/");
  await page.waitForLoadState("networkidle");
  const navTexts = await page.locator("nav a").allInnerTexts();
  assert(navTexts.includes("Subscribe"), "nav has Subscribe link");
  assert(navTexts.includes("Track order"), "nav has Track order link");
  assert(!navTexts.some(t => /pay on delivery/i.test(t)), "nav has no 'Pay on delivery'");
  const homeHrefs = await page.$$eval("a[href]", els => els.map(e => e.getAttribute("href")));
  assert(homeHrefs.includes("/subscribe"), "home has link to /subscribe");
  assert(!homeHrefs.includes("/checkout"), "home has no link to deleted /checkout (COD)");

  group("B. Cart drawer — one CTA, no COD");
  await setCart(page, [{ uid: "beer|6-Pack|one", id: "beer", flavor: "beer", title: "Ginger Beer", variant: "6-Pack", priceId: "price_1TQWl04xTvnGlHCDDlql93Ha", price: 399, qty: 1 }]);
  await page.goto(BASE + "/");
  await page.waitForLoadState("networkidle");
  await page.locator("button:has-text('Cart')").first().click();
  await page.waitForSelector("aside button");
  const drawerButtons = await page.locator("aside button").allInnerTexts();
  const checkoutCount = drawerButtons.filter(t => /^Checkout/i.test(t.trim())).length;
  assert(checkoutCount === 1, "drawer shows exactly one Checkout button", `got ${checkoutCount}: ${JSON.stringify(drawerButtons)}`);
  assert(!drawerButtons.some(t => /pay on delivery/i.test(t)), "drawer has no 'Pay on delivery'");
  assert(!drawerButtons.some(t => /^Secure$/.test(t.trim())), "drawer has no standalone 'Secure' label");

  group("C. /checkout/pay sticky card + step indicator");
  await page.locator("aside button:has-text('Checkout')").click();
  await page.waitForURL("**/checkout/pay");
  await page.waitForLoadState("networkidle");
  // Step indicator
  await page.waitForSelector("[data-testid='checkout-steps']", { timeout: 5000 });
  const stepText = await page.locator("[data-testid='checkout-steps']").innerText();
  const flat = stepText.replace(/\s+/g, " ");
  assert(/\bCart\b/.test(flat) && /\bPay\b/.test(flat) && /\bDone\b/.test(flat), "step indicator shows Cart, Pay, Done labels", flat);
  // Top bar (the white header) — find it by being the first child div of the page wrapper
  const topBarText = await page.evaluate(() => {
    const wrapper = document.querySelector("[data-testid='checkout-steps']")?.closest("div[style*='justify-content: space-between']");
    return wrapper?.textContent ?? "";
  });
  assert(!/Secure/.test(topBarText), "no 'Secure' badge in top bar", topBarText);
  // FAQ rows live INSIDE the sticky summary card
  const cardText = await page.locator("aside > div").first().innerText();
  assert(/Order summary/i.test(cardText), "summary heading inside card");
  assert(/Bottle broke/.test(cardText), "FAQ row 'Bottle broke' is inside the same card as summary");
  assert(!/256-bit TLS|Bangkok next-day · Thailand-wide/.test(cardText), "no leftover delivery promises");

  group("D. Smart-FAQ branching");
  // shot-only
  await setCart(page, [{ uid: "shot|Single|one", id: "shot", flavor: "shot", title: "Ginger Shot", variant: "Single", priceId: "price_1TQWl14xTvnGlHCD127g2bEq", price: 89, qty: 1 }]);
  await page.goto(BASE + "/checkout/pay");
  await page.waitForFunction(() => {
    const el = document.querySelector("aside > div");
    return el && /Bottle broke/.test(el.textContent ?? "");
  }, { timeout: 5000 });
  let card = await page.locator("aside > div").first().innerText();
  assert(/keep refrigerated/i.test(card), "shot cart shows 'Cold-pressed · keep refrigerated'");
  assert(!/Pause, swap/.test(card), "shot cart does NOT show subscription branch");

  // subscription mix
  await setCart(page, [
    { uid: "beer|Single|sub", id: "beer", flavor: "beer", title: "Ginger Beer", variant: "Single", priceId: "price_1TQuIi4xTvnGlHCDiL4q07Dg", price: 60, qty: 2, sub: true },
    { uid: "ale|Single|sub",  id: "ale",  flavor: "ale",  title: "Ginger Ale",  variant: "Single", priceId: "price_1TQuIq4xTvnGlHCDxHwwSRdy", price: 52, qty: 2, sub: true },
    { uid: "shot|Single|sub", id: "shot", flavor: "shot", title: "Ginger Shot", variant: "Single", priceId: "price_1TQuIy4xTvnGlHCDaDhrf1Bs", price: 67, qty: 2, sub: true },
  ]);
  await page.goto(BASE + "/checkout/pay");
  await page.waitForFunction(() => /Bottle broke/.test(document.querySelector("aside > div")?.textContent ?? ""), { timeout: 5000 });
  card = await page.locator("aside > div").first().innerText();
  assert(/Pause, swap/.test(card), "subscription cart shows 'Pause, swap, or cancel'");
  assert(!/keep refrigerated/i.test(card), "subscription cart does NOT show shot branch");
  assert(!/Mix-pack ships/.test(card), "subscription cart does NOT show bundle branch");

  // bundle (custom 6-pack)
  await setCart(page, [{ uid: "bundle|x", id: "bundle", flavor: "beer", title: "Mix 6-Pack", variant: "Custom 6-Pack", bundlePicks: ["beer","beer","ale","ale","shot","shot"], price: 359, qty: 1 }]);
  await page.goto(BASE + "/checkout/pay");
  await page.waitForFunction(() => /Bottle broke/.test(document.querySelector("aside > div")?.textContent ?? ""), { timeout: 5000 });
  card = await page.locator("aside > div").first().innerText();
  assert(/Mix-pack ships/.test(card), "bundle cart shows 'Mix-pack ships boxed and padded'");
  assert(!/Pause, swap/.test(card), "bundle cart does NOT show subscription branch");

  // free shipping unlocked
  await setCart(page, [{ uid: "beer|6-Pack|one", id: "beer", flavor: "beer", title: "Ginger Beer", variant: "6-Pack", priceId: "price_1TQWl04xTvnGlHCDDlql93Ha", price: 399, qty: 2 }]);
  await page.goto(BASE + "/checkout/pay");
  await page.waitForFunction(() => /Bottle broke/.test(document.querySelector("aside > div")?.textContent ?? ""), { timeout: 5000 });
  card = await page.locator("aside > div").first().innerText();
  assert(/Free shipping unlocked/.test(card), "qualifying cart shows 'Free shipping unlocked'");
  assert(/0g residual sugar in every bottle/.test(card), "fizz cart shows 'residual sugar' branch when not subscription");

  group("E. /subscribe builder (mix any flavors)");
  await clearCart(page);
  await page.goto(BASE + "/subscribe");
  await page.waitForLoadState("networkidle");
  // Default 2/2/2 = 6 bottles → button enabled
  const startBtnText = await page.locator("button.gb-btn--primary").first().innerText();
  assert(/Start subscription · ฿358\/mo/.test(startBtnText), "default 2/2/2 mix shows ฿358/mo CTA", startBtnText);
  // Add buttons disabled at 6/6
  const addStates = await page.$$eval("button[aria-label^='Add']", els => els.map(b => b.disabled));
  assert(addStates.every(d => d === true), "all Add buttons disabled at 6/6", JSON.stringify(addStates));
  // Click minus on Beer → drops to 5
  await page.locator("button[aria-label='Remove one Ginger Beer']").click();
  const ctaAfter = await page.locator("button.gb-btn--primary").first().innerText();
  assert(/Pick 1 more bottle/.test(ctaAfter), "after -1 beer, CTA prompts to pick 1 more bottle", ctaAfter);

  group("F. /account form");
  await page.goto(BASE + "/account");
  await page.waitForLoadState("networkidle");
  const accountHeader = await page.locator("h1").first().innerText();
  assert(/Manage your/i.test(accountHeader), "account page has 'Manage your' heading", accountHeader);
  await page.locator("input[type='email']").fill("noone-test@example.com");
  await page.locator("button[type='submit']").click();
  await page.waitForSelector("text=Check your email", { timeout: 5000 });
  ok("submitting unknown email shows 'Check your email' confirmation");

  group("G. Admin login gates");
  await page.goto(BASE + "/admin/orders");
  await page.waitForLoadState("networkidle");
  const adminText = await page.locator("body").innerText();
  assert(/Owner login/i.test(adminText), "admin page renders login form when not authed");
  assert(!/\bCOD\b/.test(adminText), "admin login screen has no 'COD' chip text leak");
  assert(/Don't know what it is/i.test(adminText), "admin login has 'Don't know what it is?' helper");

  group("H. Tracking page — no fake data for unknown order");
  await page.goto(BASE + "/tracking/GB-NONEXISTENT-XYZ");
  await page.waitForLoadState("networkidle");
  const tText = await page.locator("body").innerText();
  assert(/We don't have this order on file/i.test(tText), "unknown-order tracking page shows the empty-state card");
  assert(!/Bangkok warehouse/.test(tText), "no fake 'Bangkok warehouse' map label");
  assert(!/Your door/.test(tText), "no fake 'Your door' map label");
  assert(!/Bangkok depot|Kerry Express/.test(tText), "no fake 'Bangkok depot' / 'Kerry Express' side labels");
  assert(!/Within 24h|Confirmed|Soon/.test(tText), "no fake hardcoded timestamp side labels");

  group("I. PDP mobile layout (gb-pdp-* classes)");

  // ---- mobile 375px ----
  const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mPage = await mCtx.newPage();
  await mPage.goto(BASE + "/shop/beer");
  await mPage.waitForLoadState("networkidle");

  const mGalleryPos = await mPage.evaluate(() => {
    const el = document.querySelector(".gb-pdp-gallery");
    return el ? getComputedStyle(el).position : null;
  });
  assert(mGalleryPos === "static", "mobile 375px: gallery position is static (not sticky)", `got ${mGalleryPos}`);

  const mImgHeight = await mPage.evaluate(() => {
    const el = document.querySelector(".gb-pdp-img-box");
    return el ? Math.round(el.getBoundingClientRect().height) : null;
  });
  assert(mImgHeight !== null && mImgHeight <= 360, `mobile 375px: image box height ≤ 360px`, `got ${mImgHeight}px`);

  const mThumbData = await mPage.evaluate(() => {
    const el = document.querySelector(".gb-pdp-thumbstrip");
    if (!el) return null;
    const s = getComputedStyle(el);
    return { display: s.display, overflowX: s.overflowX };
  });
  if (mThumbData) {
    assert(mThumbData.display === "flex", "mobile 375px: thumbnail strip is flex", `got display=${mThumbData.display}`);
    assert(mThumbData.overflowX === "auto" || mThumbData.overflowX === "scroll", "mobile 375px: thumbnail strip scrolls horizontally", `got overflowX=${mThumbData.overflowX}`);
  } else {
    ok("mobile 375px: no thumbnail strip rendered (product has no gallery images)");
  }

  const mH1Size = await mPage.evaluate(() => {
    const el = document.querySelector(".gb-pdp-h1");
    return el ? parseFloat(getComputedStyle(el).fontSize) : null;
  });
  assert(mH1Size !== null && mH1Size < 48, `mobile 375px: product h1 font-size < 48px`, `got ${mH1Size}px`);

  await mCtx.close();

  // ---- tablet 768px — sticky should still be disabled ----
  const tCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const tPage = await tCtx.newPage();
  await tPage.goto(BASE + "/shop/beer");
  await tPage.waitForLoadState("networkidle");

  const tGalleryPos = await tPage.evaluate(() => {
    const el = document.querySelector(".gb-pdp-gallery");
    return el ? getComputedStyle(el).position : null;
  });
  assert(tGalleryPos === "static", "tablet 768px: gallery position is static (not sticky)", `got ${tGalleryPos}`);

  const tImgHeight = await tPage.evaluate(() => {
    const el = document.querySelector(".gb-pdp-img-box");
    return el ? Math.round(el.getBoundingClientRect().height) : null;
  });
  assert(tImgHeight !== null && tImgHeight <= 360, `tablet 768px: image box height ≤ 360px`, `got ${tImgHeight}px`);

  await tCtx.close();

  // ---- desktop 1280px — sticky and full height should be restored ----
  await page.goto(BASE + "/shop/beer");
  await page.waitForLoadState("networkidle");

  const dGalleryPos = await page.evaluate(() => {
    const el = document.querySelector(".gb-pdp-gallery");
    return el ? getComputedStyle(el).position : null;
  });
  assert(dGalleryPos === "sticky", "desktop 1280px: gallery is sticky", `got ${dGalleryPos}`);

  const dImgHeight = await page.evaluate(() => {
    const el = document.querySelector(".gb-pdp-img-box");
    return el ? Math.round(el.getBoundingClientRect().height) : null;
  });
  assert(dImgHeight !== null && dImgHeight >= 580, `desktop 1280px: image box height ≥ 580px`, `got ${dImgHeight}px`);

  const dH1Size = await page.evaluate(() => {
    const el = document.querySelector(".gb-pdp-h1");
    return el ? parseFloat(getComputedStyle(el).fontSize) : null;
  });
  assert(dH1Size !== null && dH1Size >= 48, `desktop 1280px: product h1 font-size ≥ 48px`, `got ${dH1Size}px`);

  // ---- summary ----
  console.log("\n" + "─".repeat(60));
  console.log(`\x1b[1m${passed} passed, ${failed} failed\x1b[0m`);

  await browser.close();

  if (failed > 0) {
    console.log("\nFailures:");
    for (const f of failures) console.log(`  • ${f.name}${f.detail ? ` — ${f.detail}` : ""}`);
    process.exit(1);
  }
  console.log("\x1b[32mAll browser-sim assertions passed.\x1b[0m");
  process.exit(0);
}

main().catch(e => {
  console.error("Browser-sim crashed:", e);
  process.exit(2);
});
