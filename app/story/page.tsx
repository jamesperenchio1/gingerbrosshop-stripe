import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Our story · Gingerbros" };

export default function StoryPage() {
  return (
    <InfoPage
      eyebrow="Our story"
      title="Small batch. One stubborn recipe."
      intro="Gingerbros is a tiny Bangkok kitchen making three ginger drinks. We started because the ginger drinks we wanted to drink — real ginger, no residual sugar, no flavor lab — didn't really exist on Thai shelves. So we made our own."
      sections={[
        {
          h: "What we make",
          body: "Three things, on purpose:\n\n• Ginger Beer — bold, fully carbonated, lime-finished.\n• Ginger Ale — lighter cousin, brighter lime.\n• Ginger Shot — 60ml of cold-pressed ginger, coconut water, and taurine for mornings.\n\nAll three end up with 0g residual sugar in the bottle. The beer + ale ferment the sugar out and we sweeten back with erythritol; the shot has no sugar to begin with.",
        },
        {
          h: "How the beer + ale are made",
          body: "1. Wild ginger-bug starter from fresh ginger.\n2. Brew strong ginger tea, blend with the bug + sugar, ferment until the sugar is gone.\n3. Pasteurize to lock the flavor in.\n4. Sweeten back with erythritol (zero-cal, yeast can't eat it).\n5. Hit with fresh lime.\n6. Force-carbonate.\n7. Bottle in glass.\n\nIngredients in the bottle: fresh ginger, erythritol, filtered water, lime, ginger-bug culture.",
        },
        {
          h: "How the shot is made",
          body: "Cold-press fresh ginger root. Blend with coconut water (for natural electrolytes) and a measured dose of taurine. Bottle cold. No fermentation, no sweetener, no flavoring. Three real ingredients on the label.",
        },
        {
          h: "What we won't do",
          body: "Use flavoring extracts. Bottle a residual-sugar drink and call it 'natural'. Force-carbonate junk and call it craft. Ship plastic. Make claims we can't back up.",
        },
      ]}
      cta={{ href: "/", label: "Shop the range" }}
    />
  );
}
