import { Chrome } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { Icon, ICONS } from "@/components/shared";

export const metadata = { title: "Contact · Gingerbros" };

export default function ContactPage() {
  return (
    <Chrome>
      <article style={{ background: "#FDF6EC", padding: "56px 24px 80px", minHeight: "60vh" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", fontSize: 11, margin: "0 0 12px" }}>Contact</p>
          <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Talk to a real human.
          </h1>
          <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 17, color: "rgba(44,24,16,0.72)", margin: "0 0 32px", lineHeight: 1.65 }}>
            We read every message. Pick the channel that suits you — replies usually come within 48 hours on weekdays.
          </p>

          <div style={{ display: "grid", gap: 14 }}>
            <ContactRow icon={ICONS.line} title="LINE · fastest" body="Add @gingerbros and message us — best for order issues, gift questions, or just saying hi." href="https://line.me/R/ti/p/@852nqred?ts=07142313&oat_content=url" cta="Open LINE"/>
            <ContactRow icon={ICONS.ig} title="Instagram DM" body="@gingerbrosbrew · DMs work well for quick chats and recipe asks." href="https://www.instagram.com/gingerbrosbrew" cta="DM us on IG"/>
            <ContactRow icon={ICONS.box} title="Order tracking" body="Already ordered? The fastest path is to look up your order — status, ETA, and what's in the box, all in one place." href="/tracking" cta="Track an order"/>
            <ContactRow icon={ICONS.info} title="Email" body="gingerbros.brew@gmail.com · for press, wholesale, or anything you'd rather put in writing." href="mailto:gingerbros.brew@gmail.com" cta="Copy email" copyText="gingerbros.brew@gmail.com"/>
          </div>

          <p style={{ marginTop: 32, fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.55)", lineHeight: 1.55 }}>
            Brewed and shipped from Bangkok. We&apos;re a tiny team — sometimes replies take a day or two. We&apos;ll always answer.
          </p>
        </div>
      </article>
      <Footer/>
    </Chrome>
  );
}

function ContactRow({ icon, title, body, href, cta, copyText }: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
  copyText?: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", background: "#fff", borderRadius: 14, textDecoration: "none", color: "inherit", border: "1px solid rgba(44,24,16,0.06)", transition: "transform 200ms, box-shadow 200ms" }}
    >
      <span style={{ width: 44, height: 44, borderRadius: "50%", background: "#FDF6EC", color: "#C8893C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={icon} size={22} stroke={2}/>
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 18, fontWeight: 700, color: "#2C1810" }}>{title}</div>
        <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 14, color: "rgba(44,24,16,0.7)", marginTop: 2 }}>{body}</div>
      </div>
      <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, fontWeight: 700, color: "#C8893C", whiteSpace: "nowrap" }}>
        {copyText ? cta : `${cta} →`}
      </span>
    </a>
  );
}
