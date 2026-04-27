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
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? products : products.filter(p => p.filterTags?.includes(filter));

  return (
    <section id="shop" style={{ padding: "96px 0 80px", background: "#fff", position: "relative" }}>
      <div className="gb-pad-40" style={{ maxWidth: 1440, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 24 }}>
          <div>
            <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 12, margin: "0 0 12px" }}>Our Range</p>
            <h2 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: 0, letterSpacing: "-0.02em" }}>
              Three drinks. One root.
            </h2>
            <p style={{ fontFamily: "var(--gb-font-sans)", color: "rgba(44,24,16,0.65)", fontSize: 16, marginTop: 10, maxWidth: 480 }}>
              A wild-fermented beer, a syrup-and-soda ale, and a cold-pressed shot. Same fresh ginger, three honest ways to drink it.
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

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {[
            { id: "all", label: "All drinks" },
            { id: "carbonated", label: "Carbonated" },
            { id: "wellness", label: "Wellness" },
            { id: "mixer", label: "Mixer" },
            { id: "everyday", label: "Everyday" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "9px 16px", border: filter === f.id ? "1px solid #2C1810" : "1px solid rgba(44,24,16,0.12)",
              background: filter === f.id ? "#2C1810" : "#fff",
              color: filter === f.id ? "#FDF6EC" : "rgba(44,24,16,0.75)",
              borderRadius: 9999, fontSize: 13, fontWeight: 500, fontFamily: "var(--gb-font-sans)",
              cursor: "pointer", transition: "all 200ms",
            }}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="gb-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} variant={size} showSavings={size === "6-Pack"} stock={stock?.[p.id]}/>
          ))}
        </div>
      </div>
    </section>
  );
}

// Taste guide — clean comparison panel.
type SpecCol = { id: FlavorId; label: string; bestFor: string };
const SPEC_COLS: SpecCol[] = [
  { id: "beer", label: "Daily mixer",   bestFor: "Cocktails, dinner" },
  { id: "ale",  label: "Easy drinker",  bestFor: "Daily, with food"  },
  { id: "shot", label: "Wellness shot", bestFor: "First thing in the morning" },
];

// Heat is rendered as the same 5-bar meter the PDP uses, driven off product.heat.
function HeatBars({ value }: { value: number }) {
  return (
    <div style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: 14, height: 5, borderRadius: 2, background: i <= value ? "linear-gradient(90deg, #C8893C, #8B3A1A)" : "rgba(44,24,16,0.12)" }}/>
      ))}
    </div>
  );
}

const SPEC_ROWS: { label: string; render: (c: SpecCol, p: Product) => React.ReactNode }[] = [
  { label: "Size",         render: (_c, p) => p.size },
  { label: "Process",      render: (_c, p) => p.process },
  { label: "Ingredients",  render: (_c, p) => p.ingredientsShort.join(", ") },
  { label: "Sugar",        render: (_c, p) => p.sugarLabel },
  { label: "Heat",         render: (_c, p) => <HeatBars value={p.heat}/> },
  { label: "Carbonation",  render: (_c, p) => p.carbonation },
  { label: "ABV",          render: (_c, p) => p.abv },
  { label: "Serve",        render: (_c, p) => p.serve },
  { label: "Pairs with",   render: (_c, p) => p.pairsWith },
  { label: "Best for",     render: (c, _p) => c.bestFor },
];

export function TasteGuide({ products, summaries: _summaries }: { products: Product[]; summaries?: Record<FlavorId, ReviewSummary> }) {
  const byId = Object.fromEntries(products.map(p => [p.id, p])) as Record<FlavorId, Product>;
  return (
    <section id="taste-guide" style={{ padding: "96px 0", background: "#fff", scrollMarginTop: 80 }}>
      <div className="gb-pad-40" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 36 }}>
          <div>
            <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 12, margin: "0 0 12px" }}>Compare</p>
            <h2 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: 0, letterSpacing: "-0.02em" }}>
              The lineup, side by side.
            </h2>
          </div>
          <Link href="#bundle" style={{ fontFamily: "var(--gb-font-sans)", fontSize: 14, fontWeight: 700, color: "#C8893C", textDecoration: "underline" }}>
            Or build a 6-pack with all three →
          </Link>
        </div>

        {/* Desktop: spec-sheet grid */}
        <div className="gb-show-desktop" style={{ display: "grid", gridTemplateColumns: "180px repeat(3, 1fr)", gap: 0, background: "#FDF6EC", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(44,24,16,0.06)" }}>
          {/* Header row */}
          <div style={{ padding: "28px 22px 18px", borderRight: "1px solid rgba(44,24,16,0.06)", display: "flex", alignItems: "flex-end" }}/>
          {SPEC_COLS.map(c => {
            const p = byId[c.id];
            if (!p) return null;
            return (
              <div key={c.id} style={{ padding: "28px 22px 18px", textAlign: "center", borderRight: "1px solid rgba(44,24,16,0.06)" }}>
                <div style={{ height: 160, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 14 }}>
                  <BottleImage flavor={p.flavor} size={160} src={p.heroImage}/>
                </div>
                <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "#C8893C", marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 24, fontWeight: 700, color: "#2C1810" }}>{p.title}</div>
              </div>
            );
          })}

          {/* Spec rows */}
          {SPEC_ROWS.map((row, i) => (
            <React.Fragment key={row.label}>
              <div style={{ padding: "16px 22px", borderTop: "1px solid rgba(44,24,16,0.08)", borderRight: "1px solid rgba(44,24,16,0.06)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(44,24,16,0.55)", display: "flex", alignItems: "center", background: i % 2 === 0 ? "transparent" : "rgba(44,24,16,0.02)" }}>
                {row.label}
              </div>
              {SPEC_COLS.map(c => {
                const p = byId[c.id];
                return (
                  <div key={c.id + row.label} style={{ padding: "16px 22px", borderTop: "1px solid rgba(44,24,16,0.08)", borderRight: "1px solid rgba(44,24,16,0.06)", fontFamily: "var(--gb-font-sans)", fontSize: 14, fontWeight: 600, color: "#2C1810", textAlign: "center", background: i % 2 === 0 ? "transparent" : "rgba(44,24,16,0.02)" }}>
                    {p ? row.render(c, p) : null}
                  </div>
                );
              })}
            </React.Fragment>
          ))}

          {/* Price + CTA row */}
          <div style={{ padding: "20px 22px 26px", borderTop: "1px solid rgba(44,24,16,0.08)", borderRight: "1px solid rgba(44,24,16,0.06)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(44,24,16,0.55)", display: "flex", alignItems: "center" }}>
            From
          </div>
          {SPEC_COLS.map(c => {
            const p = byId[c.id];
            if (!p) return null;
            return (
              <div key={c.id + "-cta"} style={{ padding: "20px 22px 26px", borderTop: "1px solid rgba(44,24,16,0.08)", borderRight: "1px solid rgba(44,24,16,0.06)", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 26, fontWeight: 700, color: "#C8893C", marginBottom: 4 }}>฿{p.single}</div>
                <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginBottom: 14 }}>or ฿{p.sixpack} / 6-pack</div>
                <Link href={`/shop/${p.id}`} className="gb-btn gb-btn--primary" style={{ width: "100%", justifyContent: "center", fontSize: 13, padding: "12px 18px" }}>
                  Shop <Icon d={ICONS.arrow} size={14} stroke={2}/>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical stack of cards, one per product */}
        <div className="gb-show-mobile" style={{ display: "grid", gap: 14 }}>
          {SPEC_COLS.map(c => {
            const p = byId[c.id];
            if (!p) return null;
            return (
              <div key={c.id} style={{ background: "#FDF6EC", borderRadius: 16, padding: 22, fontFamily: "var(--gb-font-sans)", border: "1px solid rgba(44,24,16,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 72, height: 100, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <BottleImage flavor={p.flavor} size={100} src={p.heroImage}/>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "#C8893C", marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810" }}>{p.title}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 6, marginBottom: 16, padding: "12px 14px", background: "#fff", borderRadius: 10 }}>
                  {SPEC_ROWS.map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}>
                      <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: "rgba(44,24,16,0.5)" }}>{row.label}</span>
                      <span style={{ fontWeight: 600, color: "#2C1810" }}>{row.render(c, p)}</span>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
