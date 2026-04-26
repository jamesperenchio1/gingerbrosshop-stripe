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
        { h: "Why is it more expensive than supermarket ginger beer?", body: "Real fresh ginger, two-week ferment, glass bottles, and small batches all cost more than syrup-and-flavoring at scale. We think it's worth it. Try a single first if you're not sure." },
        { h: "Does it taste sweet?", body: "Less than supermarket ginger beer. Our beer reads as 'ginger-forward'. The shot has zero added sugar." },
        { h: "Do you ship outside Thailand?", body: "Not yet. Working on Singapore." },
        { h: "Can I gift it?", body: "Yes — see the gifting page. Bundles ship in a kraft box with a note from us." },
        { h: "Do you do wholesale?", body: "We supply a handful of Bangkok bars and cafes. Email us for the wholesale price list." },
      ]}
      cta={{ href: "mailto:gingerbros.brew@gmail.com?subject=Question", label: "Email us a question" }}
    />
  );
}
