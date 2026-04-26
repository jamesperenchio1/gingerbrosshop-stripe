import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Where we source · Gingerbros" };

export default function SourcingPage() {
  return (
    <InfoPage
      eyebrow="Where we source"
      title="From Chiang Rai to your door."
      intro="The single biggest lever in ginger beer quality is the ginger itself. We source highland-grown, fresh root from Chiang Rai farmers and press it within 72 hours of harvest."
      sections={[
        { h: "Ginger", body: "Highland-grown Thai ginger from Chiang Rai. Pressed within 72 hours of harvest. We pay above-market rates for the freshest crop." },
        { h: "Sugar", body: "Organic Thai cane sugar — no high-fructose corn syrup, no flavor enhancers." },
        { h: "Water & yeast", body: "Filtered Bangkok municipal water and our own heritage yeast culture, kept alive batch to batch." },
        { h: "Glass, not plastic", body: "Bottles are 100% recyclable glass sourced from a Thai manufacturer in Saraburi." },
      ]}
    />
  );
}
