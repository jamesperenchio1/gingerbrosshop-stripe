import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Press kit · Gingerbros" };

export default function PressKitPage() {
  return (
    <InfoPage
      eyebrow="Press kit"
      title="Logos, photos, and brand assets."
      intro="Materials for media, retailers, and partners writing about or selling Gingerbros."
      sections={[
        { h: "Brand assets", body: "Wordmark, monogram, and color palette: email gingerbros.brew@gmail.com and we'll send a zip with SVG/PNG/PDF in light + dark variants." },
        { h: "Product photography", body: "Bottle cutouts, lifestyle, and behind-the-scenes shots in 300 DPI. Ask for the latest photo pack." },
        { h: "Founder bio + photo", body: "Available on request. Please credit photography to Gingerbros." },
        { h: "Quick facts (for fact-checking)", body: "Founded 2024 · Bangkok · 14-day natural ferment · ginger sourced from Chiang Rai · three core SKUs · ships Thailand-wide." },
      ]}
      cta={{ href: "mailto:gingerbros.brew@gmail.com?subject=Press%20kit%20request", label: "Request the press kit" }}
    />
  );
}
