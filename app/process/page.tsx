import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Brewing process · Gingerbros" };

export default function ProcessPage() {
  return (
    <InfoPage
      eyebrow="Brewing process"
      title="Fourteen days. No shortcuts."
      intro="Every bottle of Gingerbros Beer or Ale takes two weeks from raw ginger to glass. Here's what happens in between."
      sections={[
        { h: "Day 1 — Press", body: "Fresh ginger root arrives from Chiang Rai. We hand-wash, then cold-press the root within 24 hours so we don't lose volatile aromatics." },
        { h: "Days 1–14 — Ferment", body: "The juice goes into oak-hooped vessels with our heritage yeast culture and organic cane sugar. We let it ferment naturally for 14 days, tasting every few days." },
        { h: "Day 14 — Bottle", body: "Bottled at atmospheric pressure (no force-carbonation) so the fizz is from the live ferment itself. Capped, labeled, and into the cool room within hours." },
        { h: "Day 15+ — Ship", body: "Within 48 hours of bottling, your order is on a Kerry Express truck. Bangkok next-day or Thailand-wide in 3–5 business days." },
      ]}
    />
  );
}
