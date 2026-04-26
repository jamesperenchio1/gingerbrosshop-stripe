"use client";
import Link from "next/link";
import { useState } from "react";
import { Bottle, BottleImage, Icon, ICONS, Stars } from "./shared";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export function ProductDetail({ product, stock }: { product: Product; stock?: number }) {
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
            <div style={{
              background: "linear-gradient(155deg, #F5E6D3 0%, #FDF6EC 100%)", borderRadius: 20,
              height: 600, display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", width: 480, height: 480, background: "rgba(200,137,60,0.14)", borderRadius: "50%", filter: "blur(80px)" }}/>
              {(() => {
                const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [];
                const src = gallery[activeImg];
                if (src) {
                  return (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={src} alt={product.title} style={{ maxHeight: 540, maxWidth: "90%", objectFit: "contain", display: "block" }}/>
                  );
                }
                if (activeImg === 1) {
                  return (
                    <div style={{ display: "flex", gap: 12 }}>
                      <Bottle flavor={product.flavor} size={320}/>
                      <Bottle flavor={product.flavor} size={320}/>
                    </div>
                  );
                }
                return <Bottle flavor={product.flavor} size={460}/>;
              })()}

              <div style={{ position: "absolute", top: 20, left: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ background: "#2C1810", color: "#FDF6EC", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 9999 }}>{product.tag}</span>
                <span style={{ background: "#fff", color: "#4A7C3F", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 9999 }}>No added flavor</span>
              </div>

              <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, background: "rgba(253,246,236,0.92)", backdropFilter: "blur(10px)", padding: "14px 18px", borderRadius: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#C8893C", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>★★★★★ Customer Favorite</div>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 15, fontStyle: "italic", color: "#2C1810", lineHeight: 1.45 }}>
                  &ldquo;The ginger beer I&apos;ve been chasing for years.&rdquo;
                  <span style={{ fontFamily: "var(--gb-font-sans)", fontStyle: "normal", fontSize: 11, color: "rgba(44,24,16,0.6)", marginLeft: 8 }}>— Anchalee R.</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(product.gallery?.length ?? 4, 6)},1fr)`, gap: 10, marginTop: 12 }}>
              {(product.gallery && product.gallery.length > 0
                ? product.gallery.slice(0, 6).map((src, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{
                    background: activeImg === i ? "#fff" : "linear-gradient(145deg,#F5E6D3,#FDF6EC)",
                    borderRadius: 10, height: 100, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                    cursor: "pointer", border: 0, boxShadow: activeImg === i ? "inset 0 0 0 2px #2C1810" : "none", padding: 6,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}/>
                  </button>
                ))
                : [0,1,2,3].map(i => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{
                    background: activeImg === i ? "#fff" : "linear-gradient(145deg,#F5E6D3,#FDF6EC)",
                    borderRadius: 10, height: 100, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", border: 0, boxShadow: activeImg === i ? "inset 0 0 0 2px #2C1810" : "none",
                  }}>
                    <Bottle flavor={product.flavor} size={58}/>
                  </button>
                ))
              )}
            </div>
          </div>

          <div style={{ paddingTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Stars value={5} size={16}/>
              <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, fontWeight: 700, color: "#2C1810" }}>4.9</span>
              <a href="#reviews" style={{ fontSize: 13, color: "rgba(44,24,16,0.6)", fontFamily: "var(--gb-font-sans)", textDecoration: "underline" }}>
                {product.reviews} reviews
              </a>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#8B3A1A", fontWeight: 600, fontFamily: "var(--gb-font-sans)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B3A1A", animation: "gbPulse 1.6s infinite" }}/>
                42 bought this week
              </span>
            </div>
            <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 11, margin: "0 0 8px" }}>
              {product.flavor === "shot" ? "Concentrated Kick · 60ml" : product.flavor === "beer" ? "Naturally Fermented · 330ml" : product.flavor === "ale" ? "Crisp & Carbonated · 330ml" : "Wild Ferment · 330ml"}
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
                { icon: ICONS.box, title: lowStock ? "Low stock" : "In stock", body: stock !== undefined ? `${stock} bottles left · restocked weekly` : "Plenty in the fridge · restocked weekly" },
                { icon: ICONS.leaf, title: "Real ingredients", body: "No flavoring, no preservatives" },
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
                { k: "brew", h: "How we brew it", body: "Fresh ginger is pressed within 24 hours of delivery. The juice ferments for 14 days in oak-hooped vessels with our heritage yeast, then we bottle at atmospheric pressure for a lively, not-too-aggressive fizz." },
                { k: "pair", h: "Pairings & serving", body: "Serve cold over ice with a twist of lime. Cuts through fatty street food (moo krata, khao soi) and works as a stand-in for tonic with dark rum or bourbon." },
                { k: "shipping", h: "Shipping & returns", body: "We ship Bangkok next-day, Thailand-wide in 3–5 business days. Shattered on arrival? Snap a photo, we replace it free within 48h." },
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

        {/* Reviews */}
        <div id="reviews" style={{ marginTop: 80 }}>
          <div className="gb-grid-2" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 48, padding: "48px 40px", background: "#fff", borderRadius: 20 }}>
            <div>
              <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 56, fontWeight: 700, color: "#2C1810", lineHeight: 1 }}>4.9</div>
              <Stars value={5} size={18}/>
              <div style={{ fontSize: 13, color: "rgba(44,24,16,0.6)", fontFamily: "var(--gb-font-sans)", marginTop: 8 }}>Based on {product.reviews} reviews</div>
              <div style={{ marginTop: 20 }}>
                {[{s:5,p:86},{s:4,p:10},{s:3,p:3},{s:2,p:1},{s:1,p:0}].map(r => (
                  <div key={r.s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontFamily: "var(--gb-font-sans)", fontSize: 12 }}>
                    <span style={{ width: 12, color: "rgba(44,24,16,0.7)" }}>{r.s}</span>
                    <div style={{ flex: 1, height: 6, background: "#F5E6D3", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${r.p}%`, height: "100%", background: "#C8893C" }}/>
                    </div>
                    <span style={{ width: 30, textAlign: "right", color: "rgba(44,24,16,0.55)" }}>{r.p}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="gb-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { name: "Sarawut T.", role: "Verified buyer", quote: "Proper spicy. The ale is my kid's favorite — no added sugar that makes her bounce off walls." },
                { name: "Em L.", role: "Verified buyer · Bangkok", quote: "I was cutting soda. This replaced it entirely. The shot gets me through afternoon meetings." },
                { name: "Jan R.", role: "Subscriber for 6 months", quote: "The unpasteurized beer has a depth you can't fake. Tastes like a proper brewery, not a syrup." },
                { name: "Mook P.", role: "Verified buyer", quote: "Packaging is beautiful and nothing arrived broken. 6-pack discount makes it a no-brainer." },
              ].map(r => (
                <div key={r.name} style={{ padding: 18, background: "#FDF6EC", borderRadius: 14, fontFamily: "var(--gb-font-sans)" }}>
                  <Stars value={5} size={13}/>
                  <p style={{ fontFamily: "var(--gb-font-display)", fontSize: 15, color: "#2C1810", lineHeight: 1.55, margin: "10px 0 12px", fontStyle: "italic" }}>&ldquo;{r.quote}&rdquo;</p>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#2C1810" }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginTop: 2 }}>{r.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
