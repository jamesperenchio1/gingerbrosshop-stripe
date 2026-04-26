"use client";
import { Icon, ICONS, Logo, Wave } from "./shared";

export function StoryStrip() {
  return (
    <section id="story" style={{ padding: "100px 0", background: "#FDF6EC", position: "relative", overflow: "hidden" }}>
      <div className="gb-pad-40" style={{ maxWidth: 1440, margin: "0 auto", padding: "0 40px" }}>
        <div className="gb-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div className="gb-hide-mobile" style={{ position: "relative", height: 480 }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #3a2418 0%, #8B3A1A 50%, #C8893C 100%)", borderRadius: 20, overflow: "hidden" }}>
              <svg width="100%" height="100%" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
                <defs>
                  <linearGradient id="tankG" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#FDF6EC" stopOpacity="0.12"/>
                    <stop offset="1" stopColor="#FDF6EC" stopOpacity="0.04"/>
                  </linearGradient>
                  <radialGradient id="glowG" cx="0.5" cy="0.3" r="0.6">
                    <stop offset="0" stopColor="#C8893C" stopOpacity="0.5"/>
                    <stop offset="1" stopColor="#C8893C" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <rect width="480" height="480" fill="url(#glowG)"/>
                <rect x="140" y="100" width="200" height="300" rx="12" fill="url(#tankG)" stroke="#FDF6EC" strokeWidth="1.5" strokeOpacity="0.35"/>
                <ellipse cx="240" cy="100" rx="100" ry="18" fill="#FDF6EC" fillOpacity="0.15" stroke="#FDF6EC" strokeWidth="1.5" strokeOpacity="0.35"/>
                <rect x="150" y="180" width="180" height="210" rx="6" fill="#C8893C" fillOpacity="0.35"/>
                <ellipse cx="240" cy="180" rx="90" ry="10" fill="#E8B86A" fillOpacity="0.55"/>
                {[{x:180,y:330,r:4},{x:220,y:270,r:6},{x:260,y:310,r:3},{x:290,y:260,r:5},{x:200,y:220,r:4},{x:270,y:370,r:3}].map((b,i)=>(
                  <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#FDF6EC" fillOpacity="0.6"/>
                ))}
                <rect x="330" y="320" width="40" height="10" fill="#FDF6EC" fillOpacity="0.3"/>
                <circle cx="380" cy="325" r="12" fill="none" stroke="#FDF6EC" strokeWidth="2" strokeOpacity="0.4"/>
                <line x1="140" y1="200" x2="340" y2="200" stroke="#FDF6EC" strokeOpacity="0.25" strokeWidth="1"/>
                <line x1="140" y1="300" x2="340" y2="300" stroke="#FDF6EC" strokeOpacity="0.25" strokeWidth="1"/>
                <text x="240" y="440" textAnchor="middle" fontFamily="var(--gb-font-sans)" fontSize="11" letterSpacing="3" fill="#FDF6EC" fillOpacity="0.5" fontWeight="700">FERMENTER · TANK 02</text>
              </svg>
              <div style={{ position: "absolute", top: 16, left: 16, padding: "6px 12px", background: "rgba(253,246,236,0.15)", backdropFilter: "blur(8px)", borderRadius: 9999, fontFamily: "var(--gb-font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#FDF6EC", textTransform: "uppercase" }}>
                Day 9 · active ferment
              </div>
            </div>
            <div style={{ position: "absolute", bottom: -30, right: -30, width: 240, background: "#fff", padding: 20, borderRadius: 16, boxShadow: "0 16px 40px rgba(44,24,16,0.14)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#C8893C", fontWeight: 700, textTransform: "uppercase" }}>Provenance</div>
              <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810", marginTop: 6, lineHeight: 1.2 }}>
                Ginger from <span style={{ fontStyle: "italic", color: "#C8893C" }}>Chiang Rai</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(44,24,16,0.65)", marginTop: 8, fontFamily: "var(--gb-font-sans)", lineHeight: 1.5 }}>
                Highland-grown. Harvested within 72h of bottling.
              </div>
            </div>
          </div>
          <div>
            <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 12, margin: "0 0 14px" }}>Our Craft</p>
            <h2 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 52, fontWeight: 700, color: "#2C1810", margin: "0 0 20px", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              One guy. One stubborn recipe.
            </h2>
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 17, color: "rgba(44,24,16,0.7)", lineHeight: 1.65, margin: "0 0 32px" }}>
              Started in a small Bangkok kitchen in 2024 after one too many bad supermarket ginger beers. Now a proper little brewery — fresh Thai ginger, a 14-day ferment, and no shortcuts.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                { n: "14", u: "day ferment" },
                { n: "0", u: "added flavor" },
                { n: "100%", u: "Thai ginger" },
              ].map(s => (
                <div key={s.u} style={{ borderTop: "1px solid rgba(44,24,16,0.12)", paddingTop: 14 }}>
                  <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 36, fontWeight: 700, color: "#2C1810", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: "rgba(44,24,16,0.6)", marginTop: 6, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--gb-font-sans)" }}>{s.u}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Socials() {
  const items = [ICONS.ig, ICONS.tiktok, ICONS.fb, ICONS.line];
  const labels = ["Instagram", "TikTok", "Facebook", "LINE"];
  return (
    <div style={{ display: "flex", gap: 14 }}>
      {items.map((d, i) => (
        <a key={labels[i]} href="#" aria-label={labels[i]} style={{ color: "rgba(255,255,255,0.7)", width: 36, height: 36, borderRadius: "50%", border: "1px solid currentColor", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={d} size={16}/>
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "#2C1810", color: "rgba(255,255,255,0.8)", width: "100%" }}>
      <Wave fill="#2C1810" height={60}/>
      <div className="gb-pad-40" style={{ maxWidth: 1440, margin: "0 auto", padding: "0 40px" }}>
        <div className="gb-grid-2" style={{ padding: "48px 0 40px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <h3 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 36, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>
              Recipes, restocks, and the occasional <span style={{ fontStyle: "italic", color: "#C8893C" }}>misfit batch.</span>
            </h3>
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "10px 0 0" }}>One email a month. No spam. ฿50 off your next order.</p>
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.06)", padding: 6, borderRadius: 9999, border: "1px solid rgba(255,255,255,0.1)" }}>
            <input placeholder="you@example.com" style={{ flex: 1, background: "transparent", border: 0, outline: "none", color: "#fff", padding: "12px 18px", fontFamily: "var(--gb-font-sans)", fontSize: 14 }}/>
            <button style={{ padding: "12px 22px", background: "#C8893C", color: "#fff", border: 0, borderRadius: 9999, fontFamily: "var(--gb-font-sans)", fontWeight: 600, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
              Subscribe
            </button>
          </form>
        </div>

        <div className="gb-grid-4" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1fr", gap: 36, padding: "56px 0" }}>
          <div style={{ maxWidth: 280 }}>
            <Logo color="light" size={30}/>
            <p style={{ fontFamily: "var(--gb-font-sans)", color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.65, margin: "16px 0 20px" }}>
              Handcrafted ginger beverages from Thailand. Real root, real ferment, real small-batch.
            </p>
            <Socials/>
          </div>
          {[
            { h: "Shop", items: ["All brews", "Ginger Beer", "Ginger Ale", "Ginger Shot", "Build a 6-pack", "Subscriptions"] },
            { h: "Learn", items: ["Our story", "Where we source", "Brewing process", "Recipes", "Press"] },
            { h: "Help", items: ["Shipping info", "Track my order", "Returns", "FAQ", "Contact us"] },
            { h: "More", items: ["Gifting", "Refer a friend", "Press kit"] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: "var(--gb-font-sans)", fontWeight: 700, color: "#C8893C", fontSize: 12, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 18 }}>{col.h}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                {col.items.map(i => (
                  <li key={i}><a href="#" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--gb-font-sans)", fontSize: 13, textDecoration: "none" }}>{i}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderTop: "1px solid rgba(255,255,255,0.1)", fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(255,255,255,0.4)", flexWrap: "wrap", gap: 10 }}>
          <span>© 2026 Gingerbros · All rights reserved</span>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Cookies</a>
          </div>
          <span>Brewed in Bangkok 🇹🇭</span>
        </div>
      </div>
    </footer>
  );
}
