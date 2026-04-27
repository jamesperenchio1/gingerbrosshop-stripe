"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Bottle, BottleImage, Icon, ICONS, Stars } from "./shared";
import type { Product, FlavorId } from "@/lib/products";
import type { ReviewSummary } from "@/lib/reviews";

function ProductCard({ product, variant = "Single", showSavings = false, stock, summary }: {
  product: Product; variant?: "Single" | "6-Pack"; showSavings?: boolean; stock?: number; summary?: ReviewSummary;
}) {
  const price = variant === "6-Pack" ? product.sixpack : product.single;
  const origPrice = variant === "6-Pack" ? product.single * 6 : null;
  const perBottle = variant === "6-Pack" ? Math.round(price / 6) : null;
  const savings = showSavings && origPrice ? origPrice - price : 0;
  const [hovered, setHovered] = useState(false);
  const lowStock = product.lowStock || (stock !== undefined && stock <= 36);

  return (
    <Link
      href={`/shop/${product.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 20, overflow: "hidden", cursor: "pointer",
        boxShadow: hovered ? "0 18px 40px -10px rgba(44,24,16,0.16)" : "0 1px 3px rgba(44,24,16,0.06)",
        transition: "box-shadow 300ms, transform 300ms",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        display: "flex", flexDirection: "column", position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", zIndex: 2 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {product.tag && (
            <span style={{
              background: product.tagColor || "#2C1810", color: "#FDF6EC",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "5px 11px", borderRadius: 6, lineHeight: 1.2, display: "inline-flex", alignItems: "center",
            }}>{product.tag}</span>
          )}
        </div>
        <span style={{
          width: 32, height: 32, borderRadius: "50%", background: "rgba(253,246,236,0.9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(44,24,16,0.65)",
        }}>
          <Icon d={ICONS.heart} size={14} stroke={2}/>
        </span>
      </div>

      <div style={{
        height: 280,
        background: "linear-gradient(145deg, #F5E6D3, #FDF6EC)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: 200, height: 200, background: "rgba(200,137,60,0.12)",
          borderRadius: "50%", filter: "blur(40px)",
        }}/>
        <div style={{ position: "relative", transform: hovered ? "translateY(-6px) rotate(-2deg)" : "translateY(0)", transition: "transform 400ms" }}>
          <BottleImage flavor={product.flavor} size={230} src={product.heroImage}/>
        </div>

        <div style={{
          position: "absolute", left: 14, right: 14, bottom: 14,
          opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 250ms, transform 250ms", pointerEvents: "none",
        }}>
          <div style={{
            width: "100%", padding: "12px 16px", borderRadius: 9999,
            background: "#2C1810", color: "#FDF6EC",
            fontFamily: "var(--gb-font-sans)", fontWeight: 600, fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            View product <Icon d={ICONS.arrow} size={14} stroke={2.2}/>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 22px 22px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, minHeight: 18 }}>
          {summary && summary.count > 0 ? (
            <>
              <Stars value={Math.round(summary.average)} size={12}/>
              <span style={{ fontSize: 11, fontFamily: "var(--gb-font-sans)", color: "rgba(44,24,16,0.55)" }}>
                {summary.average.toFixed(1)} · {summary.count} {summary.count === 1 ? "review" : "reviews"}
              </span>
            </>
          ) : (
            <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "rgba(44,24,16,0.45)" }}>
              New · be the first to review
            </span>
          )}
          {lowStock && (
            <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "#8B3A1A", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Low stock
            </span>
          )}
        </div>
        <h3 style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 600, color: "#2C1810", margin: 0, letterSpacing: "-0.01em" }}>
          {product.title}
        </h3>
        <div style={{ marginTop: 4, fontSize: 12, color: "rgba(44,24,16,0.6)", fontFamily: "var(--gb-font-sans)" }}>
          {product.subtitle}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 22, fontWeight: 700, color: "#C8893C" }}>฿{price}</span>
          {origPrice && <span style={{ fontSize: 13, color: "rgba(44,24,16,0.4)", textDecoration: "line-through" }}>฿{origPrice}</span>}
          {savings > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, color: "#4A7C3F", letterSpacing: "0.06em" }}>
              Save ฿{savings}
            </span>
          )}
          {perBottle && <span style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginLeft: "auto", fontFamily: "var(--gb-font-sans)" }}>฿{perBottle}/bottle</span>}
        </div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, color: "rgba(44,24,16,0.5)", fontFamily: "var(--gb-font-sans)" }}>Heat</span>
          <div style={{ display: "flex", gap: 3 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{
                width: 14, height: 4, borderRadius: 2,
                background: i <= product.heat ? "linear-gradient(90deg, #C8893C, #8B3A1A)" : "rgba(44,24,16,0.08)",
              }}/>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ShopSection({ products, stock, summaries }: { products: Product[]; stock?: Record<string, number>; summaries?: Record<FlavorId, ReviewSummary> }) {
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
              Pick your pour.
            </h2>
            <p style={{ fontFamily: "var(--gb-font-sans)", color: "rgba(44,24,16,0.65)", fontSize: 16, marginTop: 10, maxWidth: 480 }}>
              Three brews, one obsessive recipe. The flagship beer, a crisp easy-drinking ale, and a concentrated morning shot.
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
            { id: "all", label: "All brews" },
            { id: "carbonated", label: "🫧 Carbonated" },
            { id: "wellness", label: "💪 Wellness" },
            { id: "mixer", label: "🍸 Mixer" },
            { id: "everyday", label: "🥤 Everyday" },
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
            <ProductCard key={p.id} product={p} variant={size} showSavings={size === "6-Pack"} stock={stock?.[p.id]} summary={summaries?.[p.id]}/>
          ))}
        </div>
      </div>
    </section>
  );
}

// Taste guide — clean comparison panel.
type SpecCol = { id: FlavorId; label: string; volume: string; carbonation: string; heat: string; bestFor: string };
const SPEC_COLS: SpecCol[] = [
  { id: "beer", label: "Daily mixer",      volume: "330ml glass", carbonation: "Natural ferment", heat: "Bold",  bestFor: "Cocktails, dinner" },
  { id: "ale",  label: "Easy drinker",     volume: "330ml glass", carbonation: "Natural ferment", heat: "Mild",  bestFor: "Daily, with food"  },
  { id: "shot", label: "Wellness shot",    volume: "60ml",        carbonation: "Still",           heat: "Sharp", bestFor: "Mornings, post-gym" },
];
const SPEC_ROWS: { label: string; render: (c: SpecCol) => string }[] = [
  { label: "Volume",      render: c => c.volume },
  { label: "Sugar",       render: ()  => "0g added" },
  { label: "Carbonation", render: c => c.carbonation },
  { label: "Heat",        render: c => c.heat },
  { label: "Best for",    render: c => c.bestFor },
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

        <div className="gb-grid-4" style={{ display: "grid", gridTemplateColumns: "180px repeat(3, 1fr)", gap: 0, background: "#FDF6EC", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(44,24,16,0.06)" }}>
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
              {SPEC_COLS.map(c => (
                <div key={c.id + row.label} style={{ padding: "16px 22px", borderTop: "1px solid rgba(44,24,16,0.08)", borderRight: "1px solid rgba(44,24,16,0.06)", fontFamily: "var(--gb-font-sans)", fontSize: 14, fontWeight: 600, color: "#2C1810", textAlign: "center", background: i % 2 === 0 ? "transparent" : "rgba(44,24,16,0.02)" }}>
                  {row.render(c)}
                </div>
              ))}
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
      </div>
    </section>
  );
}
