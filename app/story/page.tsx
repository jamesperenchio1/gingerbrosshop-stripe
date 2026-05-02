import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Our story · Gingerbros" };

export default function StoryPage() {
  return (
    <InfoPage
      eyebrow="Our story"
      title="Started for a clean morning, not a brand."
      intro="Gingerbros began as a personal project. Cutting sugar from my morning routine and wanting a sharp, clean ginger drink. Nothing on the shelf in Bangkok actually fit — every ginger beer was 30+ grams of sugar. So I started making my own."
      sections={[
        {
          h: "What we make",
          body: "One drink: Ginger Beer. Wild-fermented, force-carbonated, 0g residual sugar. The idea was simple — make a ginger beer that actually tastes like ginger, without the sugar load. That's still the whole brief.",
        },
        {
          h: "How it's made",
          body: "1. Wild ginger-bug starter from fresh ginger and a little sugar — wild yeast does the work.\n2. Brew strong ginger tea, blend with the bug + sugar, ferment for 10–14 days until the sugar is fully consumed (taste-tested, not on a timer).\n3. Pasteurize to lock the flavor in.\n4. Sweeten back with erythritol — yeast can't metabolize it, so it stays as a clean, zero-calorie sweetener.\n5. Hit with fresh lime.\n6. Force-carbonate for clean, consistent fizz.\n7. Bottle in glass.\n\nIngredients in the bottle: fresh ginger, erythritol, filtered water, lime, ginger-bug culture. 0g residual sugar.",
        },
        {
          h: "Why batches are small",
          body: "We make a few liters at a time. Small enough to taste-test every batch and adjust. Slow enough to make actual ginger drinks, not produce-line approximations. If a batch is off, it doesn't get bottled.",
        },
        {
          h: "What we won't do",
          body: "Use flavoring extracts. Ship a residual-sugar drink and call it 'natural'. Run a recipe on a timer. Plastic bottles. Make claims we can't back up.",
        },
      ]}
      cta={{ href: "/", label: "Shop the range" }}
    />
  );
}
