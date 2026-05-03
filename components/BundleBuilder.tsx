"use client";
import { BottleImage, Icon, ICONS } from "./shared";
import { useCart } from "@/lib/cart";
import { getProduct } from "@/lib/products";

export function BundleBuilder() {
  const { add } = useCart();
  const p = getProduct("beer");

  const singleTotal = p.single * 6;   // ฿900
  const saved = singleTotal - p.sixpack; // ฿150
  const perBottle = Math.round(p.sixpack / 6); // ฿125

  const handleAdd = () => {
    add({
      id: "beer",
      flavor: "beer",
      title: "Ginger Beer",
      variant: "6-Pack",
      priceId: p.prices.sixpack,
      price: p.sixpack,
      qty: 1,
    });
  };

  return (
    <section id="bundle" style={{ padding: "96px 0", background: "linear-gradient(180deg, #FDF6EC 0%, #F5E6D3 100%)", position: "relative", overflow: "hidden", scrollMarginTop: 80 }}>
      <div aria-hidden style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, background: "radial-gradient(circle at 50% 50%, rgba(200,137,60,0.14) 0%, rgba(200,137,60,0) 70%)", borderRadius: "50%", pointerEvents: "none" }}/>
      <div className="gb-pad-40" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div className="gb-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

          {/* Left: copy + CTA */}
          <div>
            <p style={{ color: "#4A7C3F", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 12, margin: "0 0 12px" }}>
              Stock Up · Save 16%
            </p>
            <h2 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 56, fontWeight: 700, color: "#2C1810", margin: "0 0 16px", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              Six bottles. <span style={{ fontStyle: "italic", color: "#C8893C" }}>Sixteen percent off.</span>
            </h2>
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 17, color: "rgba(44,24,16,0.7)", margin: "0 0 32px", maxWidth: 440, lineHeight: 1.6 }}>
              Cheaper per bottle, shipped together. No subscription needed.
            </p>

            {/* Price breakdown */}
            <div style={{ marginBottom: 28, padding: "20px 24px", background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px rgba(44,24,16,0.06)", display: "inline-flex", flexDirection: "column", gap: 8, minWidth: 240 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 24, fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.55)" }}>
                <span>6 × ฿{p.single}</span>
                <span style={{ textDecoration: "line-through" }}>฿{singleTotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 24, fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "#4A7C3F", fontWeight: 700 }}>
                <span>Bundle discount (16%)</span>
                <span>−฿{saved}</span>
              </div>
              <div style={{ height: 1, background: "rgba(44,24,16,0.08)" }}/>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "baseline" }}>
                <div>
                  <span style={{ fontFamily: "var(--gb-font-display)", fontSize: 28, fontWeight: 700, color: "#C8893C" }}>฿{p.sixpack}</span>
                  <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.5)", marginLeft: 8 }}>฿{perBottle}/bottle</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={handleAdd}
                className="gb-btn gb-btn--primary"
                style={{ fontSize: 15, padding: "16px 28px" }}
              >
                Add 6-Pack to Cart <Icon d={ICONS.arrow} size={16}/>
              </button>
            </div>
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.5)", marginTop: 12 }}>
              Or <a href="/subscribe" style={{ color: "#C8893C", fontWeight: 700, textDecoration: "none" }}>subscribe monthly</a> and save 10% every month.
            </p>
          </div>

          {/* Right: 2×3 bottle grid */}
          <div style={{ position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, padding: 28, background: "#fff", borderRadius: 20, boxShadow: "0 12px 40px rgba(44,24,16,0.08)" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background: "#F5E6D3", borderRadius: 12, height: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}>
                  <BottleImage flavor="beer" size={80} src={p.heroImage}/>
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", top: -10, right: -10, background: "#4A7C3F", color: "#fff", padding: "8px 16px", borderRadius: 9999, fontFamily: "var(--gb-font-sans)", fontSize: 12, fontWeight: 700, boxShadow: "0 4px 12px rgba(74,124,63,0.35)" }}>
              ฿{p.sixpack} · Save ฿{saved}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function SubscriptionBlock() {
  const p = getProduct("beer");
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
              Subscribe for a monthly 6-pack. Skip a month, adjust, or cancel from your account — no phone calls, no nonsense.
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
            <a href="/subscribe" className="gb-btn gb-btn--primary" style={{ background: "#C8893C", fontSize: 15 }}>
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
                <div style={{ fontSize: 12, color: "rgba(253,246,236,0.5)", textDecoration: "line-through" }}>฿{p.sixpack}</div>
                <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 32, fontWeight: 700, color: "#C8893C", lineHeight: 1 }}>฿{p.subAmount}</div>
                <div style={{ fontSize: 11, color: "rgba(253,246,236,0.55)", marginTop: 2 }}>/month</div>
              </div>
            </div>
            {/* 2×3 grid of 6 bottles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 22 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 80 }}>
                  <BottleImage flavor="beer" size={70} src="/products/ginger-beer-bg.png"/>
                </div>
              ))}
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
