"use client";
import { BottleImage, Icon, ICONS, Wave } from "./shared";

const HEADLINES = {
  craft: { eyebrow: "Thai Craft · Since 2024", line1: "Real ginger,", line2: "made by hand.", sub: "Small-batch Thai ginger beer. Fermented, bottled by hand in Bangkok — nothing from a flavor lab." },
  maker: { eyebrow: "Handmade in Bangkok", line1: "Ginger with", line2: "a kick you can feel.", sub: "Fresh ginger, real ingredients, no syrupy shortcuts. The kind of drink that makes the supermarket version taste like tap water with sugar." },
  love:  { eyebrow: "Thai Craft Beverages", line1: "Made with", line2: "Ginger & Love.", sub: "Handcrafted ginger beverages from the heart of Thailand. Bold flavors, natural ingredients, zero compromise." },
};

export function Hero({ variant = "maker" }: { variant?: keyof typeof HEADLINES }) {
  const h = HEADLINES[variant] || HEADLINES.craft;
  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <div style={{
        position: "relative", minHeight: 660,
        background: "linear-gradient(160deg, #FDF6EC 0%, #F5E6D3 60%, #FDF6EC 100%)",
      }}>
        <div aria-hidden style={{ position:"absolute", top:40, left:-80, width:420, height:420, background:"radial-gradient(circle at 50% 50%, rgba(200,137,60,0.14) 0%, rgba(200,137,60,0) 70%)", borderRadius:"50%" }}/>
        <div aria-hidden style={{ position:"absolute", bottom:-80, right:-60, width:460, height:460, background:"radial-gradient(circle at 50% 50%, rgba(74,124,63,0.10) 0%, rgba(74,124,63,0) 70%)", borderRadius:"50%" }}/>

        <div className="gb-hero-grid" style={{
          maxWidth: 1440, margin: "0 auto", padding: "72px 40px 120px",
          display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 60, alignItems: "center",
          position: "relative", zIndex: 2,
        }}>
          <div style={{ position: "relative" }}>
            <a
              href="#bundle"
              className="gb-hero-pill"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 14px 6px 6px", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(44,24,16,0.08)", borderRadius: 9999, marginBottom: 22, textDecoration: "none", color: "inherit", transition: "transform 200ms" }}
            >
              <span style={{ background: "#4A7C3F", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", padding: "4px 10px", borderRadius: 9999 }}>NEW</span>
              <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.75)" }}>
                Build-your-own 6-pack — mix any flavors, save 10%
              </span>
              <Icon d={ICONS.chevRight} size={13} stroke={2}/>
            </a>

            <p style={{
              color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700,
              letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 12,
              margin: "0 0 20px",
            }}>{h.eyebrow}</p>

            <h1 className="gb-h1" style={{
              fontFamily: "var(--gb-font-display)", fontSize: 78, fontWeight: 700,
              color: "#2C1810", lineHeight: 1.02, margin: "0 0 24px", letterSpacing: "-0.02em",
            }}>
              {h.line1}<br/>
              <span style={{
                background: "linear-gradient(90deg, #C8893C 0%, #8B3A1A 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}>{h.line2}</span>
            </h1>

            <p style={{
              fontFamily: "var(--gb-font-sans)", fontSize: 18,
              color: "rgba(44,24,16,0.72)", maxWidth: 520, margin: "0 0 36px", lineHeight: 1.6,
            }}>{h.sub}</p>

            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <a href="#shop" className="gb-btn gb-btn--primary" style={{ fontSize: 15, padding: "16px 30px" }}>
                Shop the range <Icon d={ICONS.arrow} size={16}/>
              </a>
              <a href="#taste-guide" className="gb-btn gb-btn--ghost" style={{ fontSize: 14 }}>
                Taste guide <Icon d={ICONS.chevRight} size={14}/>
              </a>
            </div>

            <div style={{ display: "flex", gap: 28, marginTop: 44, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810" }}>0g</div>
                <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginTop: 4, fontFamily: "var(--gb-font-sans)", letterSpacing: "0.04em" }}>added sugar</div>
              </div>
              <div style={{ width: 1, background: "rgba(44,24,16,0.12)" }}/>
              <div>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810" }}>48h</div>
                <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginTop: 4, fontFamily: "var(--gb-font-sans)", letterSpacing: "0.04em" }}>bottle-to-doorstep</div>
              </div>
              <div style={{ width: 1, background: "rgba(44,24,16,0.12)" }}/>
              <div>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810" }}>Glass</div>
                <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginTop: 4, fontFamily: "var(--gb-font-sans)", letterSpacing: "0.04em" }}>not plastic</div>
              </div>
            </div>
          </div>

          <div className="gb-hide-mobile" style={{ position: "relative", height: 560 }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
              <div style={{ position: "absolute", bottom: 40, width: 380, height: 30, background: "radial-gradient(ellipse, rgba(44,24,16,0.25) 0%, transparent 70%)", filter: "blur(6px)" }}/>
              <div style={{ position: "absolute", zIndex: 3, bottom: 40 }}>
                <BottleImage flavor="beer" size={460} src="/products/ginger-beer-bg.png"/>
              </div>
            </div>

            <div style={{
              position: "absolute", bottom: 0, left: 0, width: 260, zIndex: 5,
              background: "#fff", borderRadius: 16, padding: "16px 18px",
              boxShadow: "0 12px 28px rgba(44,24,16,0.12)",
              fontFamily: "var(--gb-font-sans)",
            }}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#C8893C", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Made in Bangkok</div>
              <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 15, fontWeight: 500, color: "#2C1810", lineHeight: 1.45 }}>
                Real ginger, real ingredients, zero sugar. Nothing from a flavor lab.
              </div>
            </div>

            <div style={{
              position: "absolute", top: 10, right: 10, width: 110, height: 110,
              borderRadius: "50%", background: "#2C1810", color: "#FDF6EC",
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
              fontFamily: "var(--gb-font-sans)", textAlign: "center",
              boxShadow: "0 8px 20px rgba(44,24,16,0.25)",
            }}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#C8893C", fontWeight: 700 }}>SINCE</div>
              <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 28, fontWeight: 700, lineHeight: 1 }}>2024</div>
              <div style={{ fontSize: 9, letterSpacing: "0.18em", opacity: 0.7, marginTop: 4 }}>BANGKOK</div>
            </div>
          </div>
        </div>

        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 40, overflow: "hidden",
          padding: "10px 0", borderTop: "1px solid rgba(44,24,16,0.08)", borderBottom: "1px solid rgba(44,24,16,0.08)",
        }}>
          <div style={{ display: "inline-flex", whiteSpace: "nowrap", animation: "gbMarquee 40s linear infinite" }}>
            {Array.from({ length: 4 }).map((_, k) => (
              <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 28, fontFamily: "var(--gb-font-display)", fontStyle: "italic", fontSize: 18, color: "rgba(44,24,16,0.55)", marginRight: 28 }}>
                Fresh Thai ginger <span style={{ color: "#C8893C" }}>✦</span>
                Zero added sugar <span style={{ color: "#C8893C" }}>✦</span>
                Sweetened with erythritol <span style={{ color: "#C8893C" }}>✦</span>
                Glass, not plastic <span style={{ color: "#C8893C" }}>✦</span>
                Made in Bangkok <span style={{ color: "#C8893C" }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <Wave fill="#FFFFFF" height={70}/>
    </div>
  );
}
