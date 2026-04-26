"use client";
import Link from "next/link";
import { useState } from "react";
import { Bottle, BottleImage, Icon, ICONS, Stars } from "./shared";
import type { Product } from "@/lib/products";

function ProductCard({ product, variant = "Single", showSavings = false, stock }: {
  product: Product; variant?: "Single" | "6-Pack"; showSavings?: boolean; stock?: number;
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
          {savings > 0 && (
            <span style={{
              background: "#4A7C3F", color: "#fff",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "5px 10px", borderRadius: 9999,
            }}>Save ฿{savings}</span>
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
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <Stars value={product.rating || 5} size={12}/>
          <span style={{ fontSize: 11, fontFamily: "var(--gb-font-sans)", color: "rgba(44,24,16,0.55)" }}>
            {product.reviews}
          </span>
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
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 14 }}>
          <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 22, fontWeight: 700, color: "#C8893C" }}>฿{price}</span>
          {origPrice && <span style={{ fontSize: 13, color: "rgba(44,24,16,0.4)", textDecoration: "line-through" }}>฿{origPrice}</span>}
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

export function ShopSection({ products, stock }: { products: Product[]; stock?: Record<string, number> }) {
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
              Four brews, one obsessive recipe process. Shot, ale, beer, and our new unpasteurized beer for the adventurers.
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
                  {s}{s === "6-Pack" && <span style={{ marginLeft: 6, background: "#4A7C3F", color: "#fff", padding: "2px 7px", borderRadius: 9999, fontSize: 10, fontWeight: 700 }}>SAVE</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {[
            { id: "all", label: "All brews" },
            { id: "fiery", label: "🔥 Fiery" },
            { id: "mild", label: "Mild & easy" },
            { id: "mixer", label: "For cocktails" },
            { id: "shot", label: "Morning shot" },
            { id: "new", label: "New" },
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

export function TasteGuide({ products }: { products: Product[] }) {
  return (
    <section id="taste-guide" style={{ padding: "96px 0", background: "#fff", scrollMarginTop: 80 }}>
      <div className="gb-pad-40" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 12, margin: "0 0 12px" }}>Taste Guide</p>
          <h2 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 52, fontWeight: 700, color: "#2C1810", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            Not sure where to <span style={{ fontStyle: "italic", color: "#C8893C" }}>start?</span>
          </h2>
          <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 16, color: "rgba(44,24,16,0.65)", maxWidth: 560, margin: "0 auto" }}>
            Four brews, four moods. Here&apos;s what each one is for.
          </p>
        </div>

        <div className="gb-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {products.map(p => (
            <Link key={p.id} href={`/shop/${p.id}`} style={{ background: "#FDF6EC", border: "1px solid rgba(44,24,16,0.06)", borderRadius: 18, padding: 22, textAlign: "left", fontFamily: "var(--gb-font-sans)", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><BottleImage flavor={p.flavor} size={120} src={p.heroImage}/></div>
              <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810", marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C8893C", fontWeight: 700, marginBottom: 12 }}>
                {p.id === "beer" ? "For cocktail nights" : p.id === "ale" ? "For easy sipping" : p.id === "shot" ? "For your morning kick" : "For the purists"}
              </div>
              <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ width: 14, height: 4, borderRadius: 2, background: i <= p.heat ? "linear-gradient(90deg, #C8893C, #8B3A1A)" : "rgba(44,24,16,0.08)" }}/>)}
              </div>
              <div style={{ fontSize: 13, color: "rgba(44,24,16,0.7)", lineHeight: 1.55 }}>{p.blurb.split(".")[0] + "."}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
