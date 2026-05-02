import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Press · Gingerbros" };

export default function PressPage() {
  return (
    <InfoPage
      eyebrow="Press"
      title="Working on a story?"
      intro="If you're writing about Thai craft beverages, small-batch soft drinks, or independent food businesses in Bangkok, we'd love to hear from you. Below is a quick fact sheet you can quote from."
      sections={[
        { h: "Quick facts", body: "• Founded 2024 in Bangkok\n• One core SKU: Ginger Beer\n• 10–14 day wild ginger-bug ferment, force-carbonated, 0g residual sugar\n• Ginger sourced from Chiang Rai\n• Ships Thailand-wide" },
        { h: "Contact", body: "Press inquiries: gingerbros.brew@gmail.com\nResponse time: within 48 hours during business days." },
        { h: "Press kit", body: "High-res logo, founder photo, bottle photography, and product cutouts are available — just email us with what you need." },
      ]}
      cta={{ href: "mailto:gingerbros.brew@gmail.com?subject=Press%20inquiry", label: "Email press@" }}
    />
  );
}
