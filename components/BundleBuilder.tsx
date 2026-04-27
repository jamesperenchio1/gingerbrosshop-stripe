"use client";
import { useState } from "react";
import { Bottle, BottleImage, Icon, ICONS } from "./shared";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export function BundleBuilder({ products }: { products: Product[] }) {
  const [picks, setPicks] = useState<Product[]>([]);
  const max = 6;
  const { add } = useCart();

  const total = picks.reduce((a, p) => a + p.single, 0);
  const discounted = Math.round(total * 0.9); // 10% off
  const saved = total - discounted;
  const progress = (picks.length / max) * 100;

  const addOne = (p: Product) => { if (picks.length < max) setPicks([...picks, p]); };
  const removeAt = (i: number) => setPicks(picks.filter((_, idx) => idx !== i));

  const handleAdd = () => {
    if (picks.length !== max) return;
    add({
      id: "bundle",
      flavor: picks[0].flavor,
      title: "Mix-your-own 6-Pack",
      variant: "Custom 6-Pack",
      bundlePicks: picks.map(p => p.flavor),
      price: discounted,
      qty: 1,
    });
    setPicks([]);
  };

  return (
    <section id="bundle" style={{ padding: "96px 0", background: "linear-gradient(180deg, #FDF6EC 0%, #F5E6D3 100%)", position: "relative", overflow: "hidden", scrollMarginTop: 80 }}>
      <div className="gb-pad-40" style={{ maxWidth: 1440, margin: "0 auto", padding: "0 40px" }}>
        <div className="gb-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: 56, alignItems: "flex-start" }}>
          <div>
            <p style={{ color: "#4A7C3F", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 12, margin: "0 0 12px" }}>
              Mix & Match · Save 10%
            </p>
            <h2 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 56, fontWeight: 700, color: "#2C1810", margin: "0 0 16px", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              Build your <span style={{ fontStyle: "italic", color: "#C8893C" }}>own 6-pack.</span>
            </h2>
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 17, color: "rgba(44,24,16,0.7)", margin: "0 0 36px", maxWidth: 520, lineHeight: 1.6 }}>
              Can&apos;t decide? Pick any six bottles. Any flavors, any ratio. We&apos;ll pack it up and ship it within 48 hours.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {products.map(p => (
                <button key={p.id} onClick={() => addOne(p)} disabled={picks.length >= max} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                  background: "#fff", border: "1px solid rgba(44,24,16,0.08)", borderRadius: 14,
                  cursor: picks.length >= max ? "not-allowed" : "pointer", opacity: picks.length >= max ? 0.5 : 1,
                  textAlign: "left", fontFamily: "var(--gb-font-sans)",
                }}>
                  <div style={{ width: 44, height: 56, background: "linear-gradient(145deg,#F5E6D3,#FDF6EC)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 3 }}>
                    <BottleImage flavor={p.flavor} size={50} src={p.heroImage}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 15, fontWeight: 600, color: "#2C1810" }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginTop: 2 }}>฿{p.single} each</div>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2C1810", color: "#FDF6EC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={ICONS.plus} size={14} stroke={2.5}/>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{
            background: "#fff", borderRadius: 20, padding: 24,
            boxShadow: "0 18px 40px rgba(44,24,16,0.08)", position: "sticky", top: 100,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810" }}>Your box</div>
              <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.6)" }}>
                {picks.length} of {max}
              </div>
            </div>

            <div style={{ height: 8, background: "#F5E6D3", borderRadius: 9999, overflow: "hidden", marginBottom: 18 }}>
              <div style={{
                width: `${progress}%`, height: "100%",
                background: "linear-gradient(90deg, #C8893C, #4A7C3F)",
                transition: "width 320ms cubic-bezier(0.5,0,0.5,1)",
              }}/>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginBottom: 20 }}>
              {Array.from({ length: max }).map((_, i) => {
                const p = picks[i];
                return (
                  <div key={i} onClick={() => p && removeAt(i)} style={{
                    height: 70, borderRadius: 10, border: p ? "none" : "1px dashed rgba(44,24,16,0.2)",
                    background: p ? "linear-gradient(145deg,#F5E6D3,#FDF6EC)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: p ? "pointer" : "default", padding: 4,
                  }}>
                    {p && <BottleImage flavor={p.flavor} size={60} src={p.heroImage}/>}
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: "1px solid rgba(44,24,16,0.08)", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(44,24,16,0.65)", fontFamily: "var(--gb-font-sans)", marginBottom: 6 }}>
                <span>Singles total</span>
                <span style={{ textDecoration: picks.length ? "line-through" : "none" }}>฿{total}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#4A7C3F", fontFamily: "var(--gb-font-sans)", fontWeight: 600, marginBottom: 14 }}>
                <span>Bundle discount (10%)</span>
                <span>− ฿{saved}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
                <span style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810" }}>Total</span>
                <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 26, fontWeight: 700, color: "#C8893C" }}>฿{discounted}</span>
              </div>
              <button
                disabled={picks.length !== max}
                onClick={handleAdd}
                className="gb-btn gb-btn--primary"
                style={{ width: "100%", justifyContent: "center", opacity: picks.length === max ? 1 : 0.45, cursor: picks.length === max ? "pointer" : "not-allowed" }}
              >
                {picks.length === max ? <>Add to cart <Icon d={ICONS.arrow} size={16}/></> : `Pick ${max - picks.length} more`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SubscriptionBlock() {
  return (
    <section style={{ padding: "96px 0", background: "#2C1810", color: "#FDF6EC", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, background: "radial-gradient(circle at 50% 50%, rgba(200,137,60,0.15) 0%, rgba(200,137,60,0) 70%)", borderRadius: "50%" }}/>
      <div aria-hidden style={{ position: "absolute", bottom: -100, right: -100, width: 500, height: 500, background: "radial-gradient(circle at 50% 50%, rgba(74,124,63,0.12) 0%, rgba(74,124,63,0) 70%)", borderRadius: "50%" }}/>

      <div className="gb-pad-40" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", position: "relative" }}>
        <div className="gb-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(200,137,60,0.18)", color: "#C8893C", borderRadius: 9999, fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 22 }}>
              <Icon d={ICONS.repeat} size={13} stroke={2}/> Save 10% Forever
            </div>
            <h2 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 58, fontWeight: 700, margin: "0 0 20px", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#FDF6EC" }}>
              Never run out of <span style={{ fontStyle: "italic", color: "#E8B86A" }}>the good stuff.</span>
            </h2>
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 17, color: "rgba(253,246,236,0.75)", lineHeight: 1.6, margin: "0 0 32px", maxWidth: 480 }}>
              Subscribe for a monthly 6-pack. Change flavors, skip a month, or cancel from your account — no phone calls, no nonsense.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 28, marginBottom: 36, justifyContent: "start" }}>
              {[
                { icon: ICONS.check, label: "Save 10%" },
                { icon: ICONS.repeat, label: "Skip or cancel anytime" },
                { icon: ICONS.truck, label: "Free shipping always" },
              ].map(b => (
                <div key={b.label} style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: "var(--gb-font-sans)", fontSize: 13 }}>
                  <span style={{ color: "#C8893C" }}><Icon d={b.icon} size={16} stroke={2}/></span>
                  {b.label}
                </div>
              ))}
            </div>
            <a href="/shop/beer" className="gb-btn gb-btn--primary" style={{ background: "#C8893C", fontSize: 15 }}>
              Start a subscription <Icon d={ICONS.arrow} size={16}/>
            </a>
          </div>

          <div style={{
            background: "linear-gradient(145deg, rgba(253,246,236,0.06), rgba(253,246,236,0.02))",
            border: "1px solid rgba(253,246,236,0.12)", borderRadius: 20, padding: 28,
            backdropFilter: "blur(8px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "#C8893C", fontWeight: 700, marginBottom: 6 }}>The Crate</div>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 28, fontWeight: 700 }}>Monthly 6-pack</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "rgba(253,246,236,0.5)", textDecoration: "line-through" }}>฿399</div>
                <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 32, fontWeight: 700, color: "#C8893C", lineHeight: 1 }}>฿359</div>
                <div style={{ fontSize: 11, color: "rgba(253,246,236,0.55)", marginTop: 2 }}>/month</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
              <BottleImage flavor="beer" size={90} src="/products/ginger-beer-bg.png"/>
              <Bottle flavor="ale" size={90}/>
              <BottleImage flavor="shot" size={90} src="/products/ginger-shot-bg.png"/>
            </div>
            <div style={{ borderTop: "1px solid rgba(253,246,236,0.1)", paddingTop: 16, fontSize: 13, color: "rgba(253,246,236,0.7)", fontFamily: "var(--gb-font-sans)", lineHeight: 1.6 }}>
              Your first box ships within 2 days. Then every 30 days — or whenever you tell us to.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
