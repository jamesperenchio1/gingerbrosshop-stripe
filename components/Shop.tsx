"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BottleImage, Icon, ICONS } from "./shared";
import type { Product, FlavorId } from "@/lib/products";
import type { ReviewSummary } from "@/lib/reviews";

function ProductCard({ product, variant = "Single", showSavings = false, stock }: {
  product: Product; variant?: "Single" | "6-Pack"; showSavings?: boolean; stock?: number;
}) {
  const price = variant === "6-Pack" ? product.sixpack : product.single;
  const origPrice = variant === "6-Pack" ? product.single * 6 : null;
  const savings = showSavings && origPrice ? origPrice - price : 0;
  const [hovered, setHovered] = useState(false);
  const lowStock = product.lowStock || (stock !== undefined && stock <= 36);

  return (
    <Link
      href={`/shop/${product.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 4,
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid rgba(44,24,16,0.08)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        textDecoration: "none",
      }}
    >
      <div style={{
        position: "relative",
        height: 320,
        background: hovered ? product.cardTone.bgHover : product.cardTone.bg,
        transition: "background 220ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {product.tag && (
          <span style={{
            position: "absolute", top: 16, left: 18,
            fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "#2C1810",
            fontFamily: "var(--gb-font-sans)",
          }}>{product.tag}</span>
        )}
        {lowStock && (
          <span style={{
            position: "absolute", top: 16, right: 18,
            fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "#8B3A1A",
            fontFamily: "var(--gb-font-sans)",
          }}>Low stock</span>
        )}
        <BottleImage flavor={product.flavor} size={240} src={product.heroImage}/>
      </div>

      <div style={{ borderTop: "1px solid rgba(44,24,16,0.08)" }}/>

      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        <h3 style={{
          fontFamily: "var(--gb-font-display)", fontSize: 26, fontWeight: 600,
          color: "#2C1810", margin: 0, letterSpacing: "-0.01em",
          textDecoration: hovered ? "underline" : "none",
          textUnderlineOffset: 4,
        }}>
          {product.title}
        </h3>
        <div style={{
          display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap",
          fontFamily: "var(--gb-font-sans)", fontSize: 12,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(44,24,16,0.7)", fontWeight: 600,
        }}>
          <span>{product.size}</span>
          <span style={{ color: "rgba(44,24,16,0.25)" }}>·</span>
          <span style={{ color: "#2C1810" }}>฿{price}</span>
          {origPrice && (
            <span style={{ color: "rgba(44,24,16,0.35)", textDecoration: "line-through", letterSpacing: "0.12em" }}>
              ฿{origPrice}
            </span>
          )}
          {savings > 0 && (
            <span style={{ color: "#4A7C3F", letterSpacing: "0.14em" }}>
              −฿{savings}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ShopSection({ products, stock }: { products: Product[]; stock?: Record<string, number>; summaries?: Record<FlavorId, ReviewSummary> }) {
  const [size, setSize] = useState<"Single" | "6-Pack">("Single");

  return (
    <section id="shop" style={{ padding: "96px 0 80px", background: "#fff", position: "relative" }}>
      <div className="gb-pad-40" style={{ maxWidth: 1440, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 24 }}>
          <div>
            <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 12, margin: "0 0 12px" }}>Our Drink</p>
            <h2 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: 0, letterSpacing: "-0.02em" }}>
              One drink. Done right.
            </h2>
            <p style={{ fontFamily: "var(--gb-font-sans)", color: "rgba(44,24,16,0.65)", fontSize: 16, marginTop: 10, maxWidth: 480 }}>
              Wild-fermented, force-carbonated, properly spicy. No syrup, no concentrate.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "inline-flex", padding: 4, background: "#FDF6EC", borderRadius: 9999, border: "1px solid rgba(44,24,16,0.08)" }}>
              {(["Single", "6-Pack"] as const).map(s => (
                <button key={s} onClick={() => setSize(s)} style={{
                  padding: "9px 20px", border: 0, borderRadius: 9999, cursor: "pointer",
                  background: size === s ? "#2C1810" : "transparent",
                  color: size === s ? "#FDF6EC" : "rgba(44,24,16,0.7)",
                  fontFamily: "var(--gb-font-sans)", fontSize: 13, fontWeight: 600,
                  transition: "all 200ms",
                }}>
                  {s}{s === "6-Pack" && <span style={{ marginLeft: 6, color: "#4A7C3F", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>−16%</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="gb-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} variant={size} showSavings={size === "6-Pack"} stock={stock?.[p.id]}/>
          ))}
        </div>
      </div>
    </section>
  );
}

// Attribute bar — same visual as HeatBars but generic
function AttrBar({ value, max = 5, color = "#C8893C" }: { value: number; max?: number; color?: string }) {
  return (
    <div style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{
          width: 16, height: 5, borderRadius: 2,
          background: i < value
            ? `linear-gradient(90deg, ${color}, ${color}cc)`
            : "rgba(44,24,16,0.1)",
        }}/>
      ))}
    </div>
  );
}

export function TasteGuide({ products, summaries: _summaries }: { products: Product[]; summaries?: Record<FlavorId, ReviewSummary> }) {
  const p = products[0];
  if (!p) return null;

  const attrs = [
    { label: "Heat",         value: 4, color: "#C8893C" },
    { label: "Carbonation",  value: 4, color: "#4A7C3F" },
    { label: "Sweetness",    value: 2, color: "#C8893C" },
  ];
  const pairsWith = ["Bangkok Mule", "Dark & Stormy", "Grilled food"];
  const tastingNotes = ["Punchy ginger", "Dry finish", "Light sweetness"];
  const specGrid = [
    { label: "Size",    value: p.size },
    { label: "Process", value: "Ginger bug" },
    { label: "ABV",     value: p.abv },
    { label: "Ginger",  value: "Chiang Rai" },
  ];

  return (
    <section id="taste-guide" style={{ padding: "96px 0", background: "#fff", scrollMarginTop: 80 }}>
      <div className="gb-pad-40" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 12, margin: "0 0 12px" }}>The Beer</p>
          <h2 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: 0, letterSpacing: "-0.02em" }}>
            How it drinks.
          </h2>
        </div>

        {/* Desktop: 2-col layout */}
        <div className="gb-show-desktop" style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 40, alignItems: "start" }}>
          {/* Left: bottle photo */}
          <div style={{
            background: "#F5E6D3", borderRadius: 20, height: 440,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 30%, rgba(200,137,60,0.15) 0%, transparent 65%)" }}/>
            <BottleImage flavor={p.flavor} size={300} src={p.heroImage}/>
          </div>

          {/* Right: specs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Attribute bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {attrs.map(a => (
                <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 100, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,24,16,0.5)", fontFamily: "var(--gb-font-sans)", flexShrink: 0 }}>
                    {a.label}
                  </div>
                  <AttrBar value={a.value} color={a.color}/>
                  <div style={{ fontSize: 12, color: "rgba(44,24,16,0.45)", fontFamily: "var(--gb-font-sans)" }}>{a.value}/5</div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(44,24,16,0.08)" }}/>

            {/* Pairs with */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,24,16,0.5)", fontFamily: "var(--gb-font-sans)", marginBottom: 10 }}>Pairs with</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {pairsWith.map(tag => (
                  <span key={tag} style={{ padding: "6px 14px", background: "#FDF6EC", border: "1px solid rgba(44,24,16,0.1)", borderRadius: 9999, fontSize: 13, fontFamily: "var(--gb-font-sans)", color: "#2C1810", fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Tasting notes */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,24,16,0.5)", fontFamily: "var(--gb-font-sans)", marginBottom: 10 }}>Tasting notes</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tastingNotes.map(note => (
                  <span key={note} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(200,137,60,0.08)", border: "1px solid rgba(200,137,60,0.2)", borderRadius: 9999, fontSize: 13, fontFamily: "var(--gb-font-sans)", color: "#8B3A1A", fontWeight: 500 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8893C", flexShrink: 0, display: "inline-block" }}/>
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(44,24,16,0.08)" }}/>

            {/* Spec mini-grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {specGrid.map(s => (
                <div key={s.label} style={{ padding: "12px 16px", background: "#FDF6EC", borderRadius: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,24,16,0.45)", fontFamily: "var(--gb-font-sans)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 16, fontWeight: 700, color: "#2C1810" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link href={`/shop/${p.id}`} className="gb-btn gb-btn--primary" style={{ alignSelf: "flex-start", fontSize: 14, padding: "14px 24px" }}>
              Shop Ginger Beer <Icon d={ICONS.arrow} size={15} stroke={2}/>
            </Link>
          </div>
        </div>

        {/* Mobile: single card */}
        <div className="gb-show-mobile" style={{ display: "grid", gap: 20 }}>
          {/* Bottle */}
          <div style={{ background: "#F5E6D3", borderRadius: 16, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BottleImage flavor={p.flavor} size={200} src={p.heroImage}/>
          </div>
          {/* Specs */}
          <div style={{ background: "#FDF6EC", borderRadius: 16, padding: 22, border: "1px solid rgba(44,24,16,0.06)", fontFamily: "var(--gb-font-sans)" }}>
            {/* Attrs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {attrs.map(a => (
                <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 90, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(44,24,16,0.5)", flexShrink: 0 }}>{a.label}</span>
                  <AttrBar value={a.value} color={a.color}/>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: "rgba(44,24,16,0.08)", marginBottom: 14 }}/>
            {/* Pairs / notes */}
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(44,24,16,0.45)", marginBottom: 8 }}>Pairs with</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {pairsWith.map(t => <span key={t} style={{ padding: "5px 12px", background: "#fff", border: "1px solid rgba(44,24,16,0.1)", borderRadius: 9999, fontSize: 12, color: "#2C1810" }}>{t}</span>)}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(44,24,16,0.45)", marginBottom: 8 }}>Tasting notes</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
              {tastingNotes.map(n => <span key={n} style={{ padding: "5px 12px", background: "rgba(200,137,60,0.08)", border: "1px solid rgba(200,137,60,0.2)", borderRadius: 9999, fontSize: 12, color: "#8B3A1A" }}>{n}</span>)}
            </div>
            {/* Spec grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
              {specGrid.map(s => (
                <div key={s.label} style={{ padding: "10px 14px", background: "#fff", borderRadius: 10 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,24,16,0.4)", marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 14, fontWeight: 700, color: "#2C1810" }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#C8893C" }}>฿{p.single}</div>
                <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)" }}>or ฿{p.sixpack} / 6-pack</div>
              </div>
              <Link href={`/shop/${p.id}`} className="gb-btn gb-btn--primary" style={{ fontSize: 13, padding: "10px 18px" }}>
                Shop <Icon d={ICONS.arrow} size={14} stroke={2}/>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
