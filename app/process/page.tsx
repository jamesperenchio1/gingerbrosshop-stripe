import Link from "next/link";
import { Chrome } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { Icon, ICONS } from "@/components/shared";

export const metadata = { title: "Brewing process · Gingerbros" };

type Step = { day: string; title: string; body: string; icon: typeof ICONS.flame };

const STEPS: Step[] = [
  {
    day: "Day 0",
    title: "Ginger arrives",
    body: "Highland ginger arrives at the brewery. We sort by size, wash twice, and weigh out a batch — usually 60–80kg of root.",
    icon: ICONS.leaf,
  },
  {
    day: "Day 1",
    title: "Cold press",
    body: "We cold-press the root within 24 hours. Cold pressing keeps the volatile aromatics intact — that's where the bright, floral top notes come from.",
    icon: ICONS.sparkle,
  },
  {
    day: "Day 1",
    title: "Pitch the ferment",
    body: "Juice goes into oak-hooped vessels with our heritage yeast and erythritol (zero-sugar). We measure the gravity and start a daily log.",
    icon: ICONS.flame,
  },
  {
    day: "Days 2–13",
    title: "Slow ferment",
    body: "Two weeks of natural fermentation at a stable temperature. We taste every other day. The sugars convert, the carbonation builds naturally, and the ginger heat softens into something you can drink.",
    icon: ICONS.clock,
  },
  {
    day: "Day 14",
    title: "Bottle",
    body: "Bottled at atmospheric pressure — no force-carbonation. The fizz is from the ferment itself. Capped, labeled, and into the cool room within hours.",
    icon: ICONS.box,
  },
  {
    day: "Day 15+",
    title: "Ship",
    body: "Within 48 hours of bottling, your order is on a Kerry Express truck. Bangkok next-day, or Thailand-wide in 3–5 business days. The bottle in your hand was juice this time last week.",
    icon: ICONS.truck,
  },
];

const DIFFERENCES = [
  { from: "Most supermarket ginger beer",  to: "Gingerbros",   row: "Ginger flavoring + high-fructose syrup",                vs: "Real Thai ginger, cold-pressed within 24h" },
  { from: "Most supermarket ginger beer",  to: "Gingerbros",   row: "Force-carbonated with CO₂ tanks",                          vs: "Naturally carbonated by the ferment itself" },
  { from: "Most supermarket ginger beer",  to: "Gingerbros",   row: "Sugar (often 35g per 330ml bottle)",                       vs: "0g added sugar — sweetened with erythritol" },
  { from: "Most supermarket ginger beer",  to: "Gingerbros",   row: "Made in days from concentrate",                            vs: "14-day natural ferment" },
];

export default function ProcessPage() {
  return (
    <Chrome>
      <article style={{ background: "#FDF6EC", padding: "56px 24px 80px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", fontSize: 11, margin: "0 0 12px" }}>Brewing process</p>
          <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Fourteen days. <span style={{ fontStyle: "italic", color: "#C8893C" }}>No shortcuts.</span>
          </h1>
          <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 17, color: "rgba(44,24,16,0.72)", margin: "0 0 36px", lineHeight: 1.6 }}>
            Every bottle takes two weeks from raw root to glass. Here&apos;s what happens in between, and why it matters.
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
                  <div style={{ padding: 16, background: "#FDF6EC", borderRadius: 10, color: "rgba(44,24,16,0.6)", fontSize: 14, position: "relative" }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "rgba(44,24,16,0.45)", marginBottom: 4 }}>Most ginger beer</div>
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
