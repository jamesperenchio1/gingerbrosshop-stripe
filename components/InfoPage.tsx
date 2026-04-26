import Link from "next/link";
import { Chrome } from "./Chrome";
import { Footer } from "./Footer";
import { Icon, ICONS } from "./shared";

export type InfoSection = { h: string; body: string };

export function InfoPage({
  eyebrow, title, intro, sections, cta,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections?: InfoSection[];
  cta?: { href: string; label: string };
}) {
  return (
    <Chrome>
      <article style={{ background: "#FDF6EC", padding: "56px 24px 80px", minHeight: "60vh" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", fontSize: 11, margin: "0 0 12px" }}>{eyebrow}</p>
          <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>{title}</h1>
          <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 17, color: "rgba(44,24,16,0.72)", margin: "0 0 32px", lineHeight: 1.65 }}>{intro}</p>

          {sections && sections.length > 0 && (
            <div style={{ display: "grid", gap: 28, background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24 }}>
              {sections.map(s => (
                <div key={s.h}>
                  <h2 style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810", margin: "0 0 8px" }}>{s.h}</h2>
                  <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 15, color: "rgba(44,24,16,0.72)", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>{s.body}</p>
                </div>
              ))}
            </div>
          )}

          {cta && (
            <Link href={cta.href} className="gb-btn gb-btn--primary" style={{ marginTop: 8 }}>
              {cta.label} <Icon d={ICONS.arrow} size={16}/>
            </Link>
          )}
        </div>
      </article>
      <Footer/>
    </Chrome>
  );
}
