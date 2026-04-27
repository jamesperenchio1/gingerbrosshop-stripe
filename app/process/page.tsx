import Link from "next/link";
import { Chrome } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { Icon, ICONS } from "@/components/shared";

export const metadata = { title: "Brewing process · Gingerbros" };

type Step = { day: string; title: string; body: string; icon: typeof ICONS.flame };

// Beer + ale share this fermentation flow. The shot is cold-pressed only — see /shop/shot.
const STEPS: Step[] = [
  {
    day: "Step 1",
    title: "Start the ginger bug",
    body: "We grate fresh ginger, mix it with sugar and water, and let wild yeast take over. After a few days the starter is bubbling — that's the live culture we'll use to ferment the batch.",
    icon: ICONS.sparkle,
  },
  {
    day: "Step 2",
    title: "Brew the ginger tea",
    body: "Strong ginger tea, more sugar, water. The sugar is fuel for the yeast — by the end of fermentation it's gone. We add it knowing it won't end up in the bottle.",
    icon: ICONS.leaf,
  },
  {
    day: "Step 3",
    title: "Pitch + ferment",
    body: "We blend the bug into the tea and let it ferment until the sugar is fully consumed. Time varies batch-to-batch — we taste-test, we don't rush it. Live culture, real flavor.",
    icon: ICONS.flame,
  },
  {
    day: "Step 4",
    title: "Pasteurize",
    body: "Once the ferment is where we want it, we pasteurize to lock the flavor profile in. This stops the yeast so the bottle is shelf-stable.",
    icon: ICONS.shield,
  },
  {
    day: "Step 5",
    title: "Sweeten + finish",
    body: "Erythritol goes in for sweetness — yeast can't metabolize it, so it stays in the bottle as a clean, zero-calorie sweetener. Then a hit of fresh lime to brighten it.",
    icon: ICONS.sparkle,
  },
  {
    day: "Step 6",
    title: "Force-carbonate + bottle",
    body: "We force-carbonate to get crisp, consistent fizz, then bottle. Glass bottles, capped fresh, into the cool room.",
    icon: ICONS.box,
  },
  {
    day: "Step 7",
    title: "Ship",
    body: "Within 48 hours of bottling, your order is on a Kerry Express truck. Bangkok next-day, Thailand-wide in 3–5 business days.",
    icon: ICONS.truck,
  },
];

const DIFFERENCES = [
  { row: "Ginger flavoring + high-fructose syrup",   vs: "Real ginger, fermented for real flavor" },
  { row: "Up to 35g sugar per 330ml bottle",          vs: "0g residual sugar — sweetened with erythritol after fermentation" },
  { row: "Made in days from concentrate",             vs: "Batch-by-batch wild ferment, taste-tested before bottling" },
  { row: "Plastic bottles",                           vs: "Glass, every time" },
];

export default function ProcessPage() {
  return (
    <Chrome>
      <article style={{ background: "#FDF6EC", padding: "56px 24px 80px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", fontSize: 11, margin: "0 0 12px" }}>Brewing process</p>
          <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Wild fermentation, <span style={{ fontStyle: "italic", color: "#C8893C" }}>small batches.</span>
          </h1>
          <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 17, color: "rgba(44,24,16,0.72)", margin: "0 0 32px", lineHeight: 1.6 }}>
            Beer and ale go through a wild ginger-bug fermentation — slow, real, no shortcuts. Here&apos;s what happens between fresh root and the bottle in your hand. The shot is a different process: cold-pressed and bottled, no fermentation. <Link href="/shop/shot" style={{ color: "#C8893C", textDecoration: "underline", fontWeight: 700 }}>See the shot →</Link>
          </p>

          {/* Timeline */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px 36px", marginBottom: 40 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 18, position: "relative", paddingBottom: i === STEPS.length - 1 ? 0 : 28 }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: "absolute", left: 21, top: 44, bottom: 0, width: 2, background: "linear-gradient(180deg, #C8893C, rgba(200,137,60,0.2))" }}/>
                )}
                <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(145deg, #C8893C, #8B3A1A)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(200,137,60,0.3)" }}>
                  <Icon d={s.icon} size={20} stroke={2}/>
                </div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "#C8893C", marginBottom: 4 }}>{s.day}</div>
                  <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810", marginBottom: 6 }}>{s.title}</div>
                  <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 15, color: "rgba(44,24,16,0.7)", lineHeight: 1.6, margin: 0 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--gb-font-display)", fontSize: 26, fontWeight: 700, color: "#2C1810", margin: "0 0 6px" }}>What&apos;s different about ours</h2>
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 14, color: "rgba(44,24,16,0.65)", margin: "0 0 22px" }}>The four things that change the drink in your hand.</p>

            <div style={{ display: "grid", gap: 14 }}>
              {DIFFERENCES.map((d, i) => (
                <div key={i} className="gb-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontFamily: "var(--gb-font-sans)" }}>
                  <div style={{ padding: 16, background: "#FDF6EC", borderRadius: 10, color: "rgba(44,24,16,0.6)", fontSize: 14 }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "rgba(44,24,16,0.45)", marginBottom: 4 }}>Most ginger drinks</div>
                    {d.row}
                  </div>
                  <div style={{ padding: 16, background: "linear-gradient(145deg, rgba(200,137,60,0.10), rgba(200,137,60,0.04))", borderRadius: 10, color: "#2C1810", fontSize: 14, fontWeight: 600, border: "1px solid rgba(200,137,60,0.2)" }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "#C8893C", marginBottom: 4 }}>Gingerbros</div>
                    {d.vs}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/" className="gb-btn gb-btn--primary">
            Shop the range <Icon d={ICONS.arrow} size={16} stroke={2}/>
          </Link>
        </div>
      </article>
      <Footer/>
    </Chrome>
  );
}
