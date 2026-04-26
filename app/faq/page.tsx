import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "FAQ · Gingerbros" };

export default function FAQPage() {
  return (
    <InfoPage
      eyebrow="FAQ"
      title="The questions we get most."
      intro="Quick answers to the things people email us about. Don't see yours? Reply to any of our emails — we read all of them."
      sections={[
        { h: "Is your ginger beer alcoholic?", body: "Trace amounts (<0.5% ABV) from natural fermentation, well below the threshold to be classified as alcoholic in Thailand. Treat it like any other soft drink." },
        { h: "How long does a bottle last?", body: "Unopened, 4 months in the fridge. Once opened, finish within 24 hours for best fizz. We bottle-date everything." },
        { h: "Is there sugar in this?", body: "No added sugar — we sweeten with erythritol, a zero-calorie sugar alcohol. So you get the flavor without the spike." },
      ]}
      cta={{ href: "/contact", label: "Have another question?" }}
    />
  );
}
