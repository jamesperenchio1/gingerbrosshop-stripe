"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottleImage, Icon, ICONS } from "./shared";
import { useCart } from "@/lib/cart";
import { PRODUCTS, type FlavorId } from "@/lib/products";

const BOX_SIZE = 6;

export function SubscribeClient() {
  const router = useRouter();
  const { add, clear } = useCart();
  const [picks, setPicks] = useState<Record<FlavorId, number>>({ beer: 6 });

  const total = picks.beer;
  const remaining = BOX_SIZE - total;
  const monthly = PRODUCTS.reduce((sum, p) => sum + picks[p.id] * p.subBottleAmount, 0);

  const inc = (id: FlavorId) => {
    if (total >= BOX_SIZE) return;
    setPicks(p => ({ ...p, [id]: p[id] + 1 }));
  };
  const dec = (id: FlavorId) => {
    setPicks(p => ({ ...p, [id]: Math.max(0, p[id] - 1) }));
  };

  const start = () => {
    if (total !== BOX_SIZE) return;
    clear();
    // One cart line per flavor with non-zero qty. Each line uses the per-bottle recurring price;
    // /api/checkout sends them as separate sub line items so customers can later adjust qty per flavor.
    const order: FlavorId[] = ["beer"];
    for (const id of order) {
      const qty = picks[id];
      if (qty <= 0) continue;
      const product = PRODUCTS.find(p => p.id === id)!;
      add({
        id,
        flavor: id,
        title: product.title,
        variant: "Single",
        priceId: product.prices.subBottle,
        price: product.subBottleAmount,
        qty,
        sub: true,
      }, { openDrawer: false });
    }
    router.push("/checkout/pay");
  };

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh", padding: "40px 0 80px", fontFamily: "var(--gb-font-sans)" }}>
      <div className="gb-pad-40" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(200,137,60,0.12)", color: "#C8893C", borderRadius: 9999, fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 18 }}>
            <Icon d={ICONS.repeat} size={13} stroke={2}/> Monthly 6-pack · save 10%
          </div>
          <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 56, fontWeight: 700, margin: "0 0 14px", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#2C1810" }}>
            Build your monthly <span style={{ fontStyle: "italic", color: "#C8893C" }}>crate.</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(44,24,16,0.7)", maxWidth: 580, margin: "0 auto", lineHeight: 1.55 }}>
            6 bottles of Ginger Beer, every month. Free shipping always, 10% off forever, pause or cancel anytime from your portal.
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, padding: 40, boxShadow: "0 8px 32px rgba(44,24,16,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(44,24,16,0.55)", fontWeight: 700 }}>
              Step 1 · Build your 6-pack
            </div>
            <div style={{ display: "inline-flex", gap: 6, alignItems: "center", padding: "6px 14px", background: total === BOX_SIZE ? "rgba(74,124,63,0.12)" : "rgba(200,137,60,0.12)", borderRadius: 9999, fontSize: 12, fontWeight: 700, color: total === BOX_SIZE ? "#4A7C3F" : "#C8893C" }}>
              {total === BOX_SIZE ? <><Icon d={ICONS.check} size={13} stroke={2.4}/> 6 of 6 bottles</> : <>{total} of 6 · {remaining} to go</>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
            {PRODUCTS.map(p => {
              const qty = picks[p.id];
              return (
                <div key={p.id} style={{ background: "#FDF6EC", border: qty > 0 ? "2px solid #C8893C" : "2px solid rgba(44,24,16,0.06)", borderRadius: 18, padding: 18, transition: "border 200ms" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                    <div style={{ width: 64, height: 80, background: p.cardTone.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <BottleImage flavor={p.flavor} size={64} src={p.heroImage}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 19, fontWeight: 700, color: "#2C1810" }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(44,24,16,0.6)", marginTop: 2 }}>{p.size}</div>
                      <div style={{ fontSize: 13, color: "#C8893C", fontWeight: 700, marginTop: 4 }}>฿{p.subBottleAmount}/bottle</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                    <button
                      onClick={() => dec(p.id)}
                      disabled={qty === 0}
                      aria-label={`Remove one ${p.title}`}
                      style={{ width: 38, height: 38, borderRadius: 9999, border: 0, background: qty === 0 ? "rgba(44,24,16,0.05)" : "#fff", color: "#2C1810", cursor: qty === 0 ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: qty === 0 ? "none" : "0 1px 4px rgba(44,24,16,0.08)" }}
                    >
                      <Icon d={ICONS.minus} size={16} stroke={2.4}/>
                    </button>
                    <div style={{ flex: 1, textAlign: "center", fontFamily: "var(--gb-font-display)", fontSize: 24, fontWeight: 700, color: "#2C1810" }}>
                      {qty}
                    </div>
                    <button
                      onClick={() => inc(p.id)}
                      disabled={remaining <= 0}
                      aria-label={`Add one ${p.title}`}
                      style={{ width: 38, height: 38, borderRadius: 9999, border: 0, background: remaining <= 0 ? "rgba(44,24,16,0.05)" : "#C8893C", color: remaining <= 0 ? "rgba(44,24,16,0.3)" : "#fff", cursor: remaining <= 0 ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Icon d={ICONS.plus} size={16} stroke={2.4}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: "1px solid rgba(44,24,16,0.08)", paddingTop: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(44,24,16,0.55)", fontWeight: 700, marginBottom: 4 }}>Your monthly box</div>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810" }}>
                  {total === 0 ? "Start picking bottles" : `${picks.beer}× Beer`}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 36, fontWeight: 700, color: "#C8893C", lineHeight: 1 }}>฿{monthly}</div>
                <div style={{ fontSize: 12, color: "rgba(44,24,16,0.55)" }}>per month, shipped</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
              {[
                { icon: ICONS.check, label: "10% off every month" },
                { icon: ICONS.truck, label: "Free shipping always" },
                { icon: ICONS.repeat, label: "Pause, skip, swap, cancel" },
                { icon: ICONS.shield, label: "Card on file with Stripe" },
              ].map(b => (
                <div key={b.label} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "rgba(44,24,16,0.75)" }}>
                  <span style={{ color: "#C8893C", display: "inline-flex" }}><Icon d={b.icon} size={16} stroke={2}/></span>
                  {b.label}
                </div>
              ))}
            </div>

            <button
              onClick={start}
              disabled={total !== BOX_SIZE}
              className="gb-btn gb-btn--primary"
              style={{ background: total === BOX_SIZE ? "#C8893C" : "rgba(44,24,16,0.15)", width: "100%", justifyContent: "center", padding: "16px 24px", fontSize: 15, cursor: total === BOX_SIZE ? "pointer" : "not-allowed", color: total === BOX_SIZE ? "#fff" : "rgba(44,24,16,0.4)" }}
            >
              {total === BOX_SIZE ? <>Start subscription · ฿{monthly}/mo <Icon d={ICONS.arrow} size={16}/></> : `Pick ${remaining} more bottle${remaining === 1 ? "" : "s"}`}
            </button>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "rgba(44,24,16,0.55)" }}>
              No commitment. Pause, change the mix, or cancel anytime from your account.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 36, padding: 24, background: "rgba(44,24,16,0.03)", borderRadius: 16, fontSize: 13, color: "rgba(44,24,16,0.7)", lineHeight: 1.6 }}>
          <strong style={{ color: "#2C1810" }}>How it works.</strong> You&rsquo;ll be charged today and on the same day every month. Your confirmation email contains a link to manage your subscription — change the mix, update card, pause, or cancel — all through Stripe&rsquo;s secure customer portal. Lost the email? Visit{" "}
          <a href="/account" style={{ color: "#C8893C", fontWeight: 700 }}>your account page</a> and we&rsquo;ll send you a new link.
        </div>
      </div>
    </div>
  );
}
