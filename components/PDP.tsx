"use client";
import Link from "next/link";
import { useState } from "react";
import { Bottle, BottleImage, Icon, ICONS } from "./shared";
import { PdpRatingHeader, ReviewsBlock } from "./Reviews";
import type { Review, ReviewSummary } from "@/lib/reviews";

function brewCopy(id: Product["id"]): string {
  if (id === "shot") {
    return "Fresh ginger gets cold-pressed within a day of arriving at the kitchen. The juice goes into the bottle with coconut water (for natural electrolytes) and a measured dose of taurine. No fermentation, no sugar, no flavor extracts — three ingredients on the label is the whole list.";
  }
  // beer + ale share a ferment
  return "Ginger-bug method. We start a wild fermentation culture from fresh ginger, then blend it into a strong ginger tea with sugar. The yeast eats the sugar and produces a small amount of CO₂ + a lot of flavor. When fermentation is done we pasteurize to lock the flavor in, sweeten back up with erythritol (which yeast can't metabolize), finish with fresh lime, and force-carbonate before bottling. Result: 0g residual sugar in the bottle, real ginger flavor, full carbonation.";
}

function pairCopy(id: Product["id"]): string {
  if (id === "beer") return "Build a Bangkok Mule with dark rum or whisky and a squeeze of lime — that's the move. Otherwise serve cold over ice; cuts through rich, fatty street food (moo krata, khao soi). Best within a few days of opening for full fizz.";
  if (id === "ale") return "Long glass, ice spear, splash of whisky or rum, twist of lemon — easiest highball you'll make. On its own with dinner, especially anything fried. Splash into sparkling wine for a low-effort spritz.";
  return "Drink cold, neat, like a wellness shot. First thing in the morning before coffee. 30 minutes before a workout. When you feel a sniffle. Chase with warm water and lemon if the heat is too much for you.";
}

function shippingCopy(): React.ReactNode {
  return (
    <>
      Bangkok next-day available · Thailand-wide via Kerry Express in 3–5 business days · free over ฿500. We ship within 48 hours of bottling. Bottle arrives broken or anything off?{" "}
      <a href="/contact" style={{ color: "#C8893C", fontWeight: 700, textDecoration: "underline" }}>Reach us via LINE / IG / email →</a>
      {" "}— send a photo and we&apos;ll replace it free. We don&apos;t accept open-bottle returns; it&apos;s a fermented product and we can&apos;t safely resell it.
    </>
  );
}
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export function ProductDetail({ product, stock, summary, initialReviews }: {
  product: Product;
  stock?: number;
  summary: ReviewSummary;
  initialReviews: Review[];
}) {
  const [variant, setVariant] = useState<"Single" | "6-Pack">("Single");
  const [qty, setQty] = useState(1);
  const [sub, setSub] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [openTab, setOpenTab] = useState("story");
  const { add } = useCart();

  const basePrice = variant === "6-Pack" ? product.sixpack : product.single;
  const price = sub ? Math.round((variant === "6-Pack" ? product.sixpack : product.single) * 0.9) : basePrice;

  const priceId = sub
    ? product.prices.sub
    : (variant === "6-Pack" ? product.prices.sixpack : product.prices.single);

  const handleAdd = () => {
    add({
      id: product.id,
      flavor: product.flavor,
      title: product.title,
      variant,
      priceId,
      price,
      qty,
      sub,
    });
  };

  const lowStock = product.lowStock || (stock !== undefined && stock <= 36);

  return (
    <div style={{ background: "#FDF6EC", paddingBottom: 40 }}>
      <div className="gb-pad-40" style={{ maxWidth: 1440, margin: "0 auto", padding: "20px 40px", fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.55)" }}>
        <Link href="/" style={{ color: "inherit" }}>Shop</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span>Ginger Beverages</span>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#2C1810", fontWeight: 600 }}>{product.title}</span>
      </div>

      <div className="gb-pad-40" style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 40px 80px" }}>
        <div className="gb-grid-2" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64 }}>
          <div style={{ position: "sticky", top: 120, alignSelf: "start" }}>
            {(() => {
              const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [];
              const total = gallery.length;
              const safeIdx = total === 0 ? 0 : ((activeImg % total) + total) % total;
              const src = gallery[safeIdx];
              const goPrev = () => total > 0 && setActiveImg((safeIdx - 1 + total) % total);
              const goNext = () => total > 0 && setActiveImg((safeIdx + 1) % total);

              const arrowBtn: React.CSSProperties = {
                position: "absolute", top: "50%", transform: "translateY(-50%)",
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(253,246,236,0.95)", border: "1px solid rgba(44,24,16,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#2C1810",
                boxShadow: "0 4px 14px rgba(44,24,16,0.12)", zIndex: 5,
              };

              return (
                <>
                  <div style={{
                    background: "linear-gradient(155deg, #F5E6D3 0%, #FDF6EC 100%)", borderRadius: 20,
                    height: 600, display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", width: 480, height: 480, background: "rgba(200,137,60,0.14)", borderRadius: "50%", filter: "blur(80px)" }}/>

                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt={`${product.title} — image ${safeIdx + 1}`} style={{ maxHeight: 540, maxWidth: "85%", objectFit: "contain", display: "block", animation: "gbFade 200ms ease-out" }}/>
                    ) : (
                      <Bottle flavor={product.flavor} size={460}/>
                    )}

                    <div style={{ position: "absolute", top: 20, left: 20, display: "flex", flexDirection: "column", gap: 8, zIndex: 4 }}>
                      <span style={{ background: "#2C1810", color: "#FDF6EC", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 9999 }}>{product.tag}</span>
                      <span style={{ background: "#fff", color: "#4A7C3F", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 9999 }}>0g sugar</span>
                    </div>

                    {total > 1 && (
                      <>
                        <button type="button" onClick={goPrev} aria-label="Previous photo" style={{ ...arrowBtn, left: 14 }}>
                          <Icon d={ICONS.arrowLeft} size={18} stroke={2}/>
                        </button>
                        <button type="button" onClick={goNext} aria-label="Next photo" style={{ ...arrowBtn, right: 14 }}>
                          <Icon d={ICONS.arrow} size={18} stroke={2}/>
                        </button>
                        <div style={{ position: "absolute", bottom: 16, right: 18, fontFamily: "var(--gb-font-sans)", fontSize: 11, fontWeight: 700, color: "rgba(44,24,16,0.55)", background: "rgba(253,246,236,0.85)", padding: "4px 10px", borderRadius: 9999, zIndex: 4 }}>
                          {safeIdx + 1} / {total}
                        </div>
                      </>
                    )}
                  </div>

                  {total > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(total, 7)},1fr)`, gap: 10, marginTop: 12 }}>
                      {gallery.slice(0, 7).map((thumb, i) => (
                        <button key={i} onClick={() => setActiveImg(i)} aria-label={`View image ${i + 1}`} style={{
                          background: safeIdx === i ? "#fff" : "linear-gradient(145deg,#F5E6D3,#FDF6EC)",
                          borderRadius: 10, height: 80, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                          cursor: "pointer", border: 0, boxShadow: safeIdx === i ? "inset 0 0 0 2px #2C1810" : "none", padding: 6,
                          transition: "transform 200ms",
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={thumb} alt="" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}/>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <div style={{ paddingTop: 8 }}>
            <PdpRatingHeader summary={summary}/>
            <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 11, margin: "0 0 8px" }}>
              {product.flavor === "shot" ? "Concentrated Kick · 60ml" : product.flavor === "beer" ? "Naturally Fermented · 330ml" : "Crisp & Carbonated · 330ml"}
            </p>
            <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: "0 0 14px", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              {product.title}
            </h1>
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 16, color: "rgba(44,24,16,0.72)", lineHeight: 1.65, margin: "0 0 24px" }}>
              {product.blurb}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "10px 14px", background: "#fff", borderRadius: 12, border: "1px solid rgba(44,24,16,0.08)" }}>
              <span style={{ color: "#C8893C" }}><Icon d={ICONS.flame} size={18} stroke={2}/></span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--gb-font-sans)" }}>Heat</span>
              <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ width: 20, height: 5, borderRadius: 3, background: i <= product.heat ? "linear-gradient(90deg, #C8893C, #8B3A1A)" : "rgba(44,24,16,0.1)" }}/>
                ))}
              </div>
              <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.7)", marginLeft: 8 }}>{["","Mellow","Bright","Warm","Fiery","Scorcher"][product.heat]}</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(44,24,16,0.6)", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 10, fontFamily: "var(--gb-font-sans)" }}>Size</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {([
                  { v: "Single" as const, price: product.single, sub: "1 bottle", save: 0 },
                  { v: "6-Pack" as const, price: product.sixpack, sub: `6 bottles · ฿${Math.round(product.sixpack/6)}/ea`, save: product.single*6 - product.sixpack },
                ]).map(o => (
                  <button key={o.v} onClick={() => setVariant(o.v)} style={{
                    padding: "14px 18px", textAlign: "left",
                    border: variant === o.v ? "2px solid #2C1810" : "2px solid rgba(44,24,16,0.1)",
                    background: "#fff", borderRadius: 12, cursor: "pointer",
                    fontFamily: "var(--gb-font-sans)", transition: "all 200ms", position: "relative",
                  }}>
                    {o.save > 0 && <span style={{ position: "absolute", top: -9, right: 10, background: "#4A7C3F", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 9999 }}>SAVE ฿{o.save}</span>}
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#2C1810" }}>{o.v}</div>
                    <div style={{ fontSize: 12, color: "rgba(44,24,16,0.55)", marginTop: 2 }}>{o.sub}</div>
                    <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, color: "#C8893C" }}>฿{o.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {variant === "6-Pack" && (
              <label style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                background: sub ? "linear-gradient(145deg, rgba(74,124,63,0.12), rgba(74,124,63,0.06))" : "#fff",
                border: sub ? "2px solid #4A7C3F" : "2px solid rgba(44,24,16,0.1)",
                borderRadius: 12, cursor: "pointer", marginBottom: 20,
              }}>
                <input type="checkbox" checked={sub} onChange={e => setSub(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#4A7C3F" }}/>
                <div style={{ flex: 1, fontFamily: "var(--gb-font-sans)" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#2C1810" }}>Subscribe & save 10%</div>
                  <div style={{ fontSize: 12, color: "rgba(44,24,16,0.6)", marginTop: 2 }}>Every 30 days · Skip or cancel anytime</div>
                </div>
                <div style={{ fontFamily: "var(--gb-font-sans)", fontWeight: 700, color: "#4A7C3F", fontSize: 14 }}>−10%</div>
              </label>
            )}

            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(44,24,16,0.15)", borderRadius: 9999, padding: "0 6px", background: "#fff" }}>
                <button onClick={() => setQty(Math.max(1, qty-1))} style={{ background: "none", border: 0, padding: "12px 10px", cursor: "pointer", color: "#2C1810" }}><Icon d={ICONS.minus} size={14}/></button>
                <span style={{ width: 24, textAlign: "center", fontWeight: 700, fontSize: 14 }}>{qty}</span>
                <button onClick={() => setQty(qty+1)} style={{ background: "none", border: 0, padding: "12px 10px", cursor: "pointer", color: "#2C1810" }}><Icon d={ICONS.plus} size={14}/></button>
              </div>
              <button onClick={handleAdd} className="gb-btn gb-btn--primary" style={{ flex: 1, justifyContent: "center", fontSize: 15 }}>
                Add to cart · ฿{price * qty}
              </button>
            </div>

            <div className="gb-grid-2" style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {[
                { icon: ICONS.truck, title: "Ships in 48h", body: "Free over ฿500 · Bangkok next-day" },
                { icon: ICONS.shield, title: "Bottle guarantee", body: "Broken on arrival? Free replacement." },
                { icon: ICONS.box, title: lowStock ? "Low stock" : "In stock", body: lowStock ? "Almost out — order soon" : "Restocked weekly · ships within 48h" },
                { icon: ICONS.leaf, title: "0g added sugar", body: "Sweetened with erythritol" },
              ].map(b => (
                <div key={b.title} style={{ padding: "10px 12px", background: "#fff", borderRadius: 10, border: "1px solid rgba(44,24,16,0.06)", display: "flex", gap: 10, alignItems: "flex-start", fontFamily: "var(--gb-font-sans)" }}>
                  <span style={{ color: "#C8893C", marginTop: 2 }}><Icon d={b.icon} size={15} stroke={2}/></span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#2C1810" }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(44,24,16,0.6)", marginTop: 1 }}>{b.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, borderTop: "1px solid rgba(44,24,16,0.1)" }}>
              {[
                { k: "story", h: "The story", body: product.about },
                { k: "ingredients", h: "Ingredients & nutrition", body: product.ingredients },
                { k: "brew", h: "How we make it", body: brewCopy(product.id) },
                { k: "pair", h: "Pairings & serving", body: pairCopy(product.id) },
                { k: "shipping", h: "Shipping & breakage", body: shippingCopy() },
              ].map(t => (
                <div key={t.k} style={{ borderBottom: "1px solid rgba(44,24,16,0.1)" }}>
                  <button onClick={() => setOpenTab(openTab === t.k ? "" : t.k)} style={{ width: "100%", padding: "18px 0", background: "none", border: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--gb-font-display)", fontSize: 18, fontWeight: 600, color: "#2C1810" }}>
                    {t.h}
                    <span style={{ transform: openTab === t.k ? "rotate(180deg)" : "none", transition: "transform 200ms" }}>
                      <Icon d={ICONS.chevDown} size={18} stroke={2}/>
                    </span>
                  </button>
                  {openTab === t.k && (
                    <p style={{ color: "rgba(44,24,16,0.75)", fontSize: 14, lineHeight: 1.75, margin: "0 0 22px", fontFamily: "var(--gb-font-sans)" }}>{t.body}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ReviewsBlock productId={product.id} initialReviews={initialReviews}/>
      </div>
    </div>
  );
}
