import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Our story · Gingerbros" };

export default function StoryPage() {
  return (
    <InfoPage
      eyebrow="Our story"
      title="One guy. One stubborn recipe."
      intro="Gingerbros started in a small Bangkok kitchen in 2024 after one too many disappointing supermarket ginger beers. What began as a stubborn personal project — pressing fresh Thai ginger, fermenting it for two weeks, getting it just right — has grown into a tiny brewery that now ships across Thailand."
      sections={[
        {
          h: "Why we started",
          body: "Most ginger beer in Thai supermarkets is high-fructose syrup with ginger flavoring. We wanted the real thing — naturally fermented, fresh-pressed, with actual heat. So we made it ourselves.",
        },
        {
          h: "Where we are now",
          body: "Three core brews (Beer, Ale, Shot), bottled in glass, fermented in oak-hooped vessels in Bangkok, and shipped Thailand-wide within 48 hours of bottling. Small batches, real ingredients, no shortcuts.",
        },
      ]}
      cta={{ href: "/", label: "Shop the range" }}
    />
  );
}
