import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Our story · Gingerbros" };

export default function StoryPage() {
  return (
    <InfoPage
      eyebrow="Our story"
      title="Started in a bedroom, not a boardroom."
      intro="It started in Australia. I love a properly carbonated drink and I never liked the sugar — and I figured ginger beer was something I could just make in my own room. The first batches were half-experiment, half-trying-to-catch-a-buzz off the natural ferment. One thing led to another, the recipe got better, the goal shifted from buzz to balance, and here we are. Real ginger, properly fermented, fully carbonated."
      sections={[
        {
          h: "What we make",
          body: "One drink: Ginger Beer. The cocktail mixer / Friday-night drink / cold-with-food drink. Bold, ginger-forward, fully carbonated. Low residual sugar — we sweeten with erythritol after fermentation. We wanted to make this one thing really well rather than spread thin across a range.",
        },
        {
          h: "How it's made",
          body: "1. Wild ginger-bug starter from fresh ginger and a little sugar — wild yeast does the work.\n2. Brew strong ginger tea, blend with the bug + sugar, ferment for ~4 days in Bangkok's heat (Thailand's ~30°C climate accelerates the ginger bug dramatically versus cooler climates).\n3. Pasteurize to lock the flavor in.\n4. Sweeten back with erythritol — yeast can't metabolize it, so it stays as a clean, zero-calorie sweetener.\n5. Hit with fresh lime.\n6. Force-carbonate for clean, consistent fizz.\n7. Bottle in glass.\n\nIngredients in the bottle: fresh ginger, erythritol, filtered water, lime, ginger-bug culture.",
        },
        {
          h: "Why batches are small",
          body: "We make a few liters at a time. Small enough to taste-test every batch and adjust. Slow enough to make actual ginger beer, not a produce-line approximation. If a batch is off, it doesn't get bottled.",
        },
        {
          h: "What we won't do",
          body: "Use flavoring extracts. Run a recipe on a timer without tasting it. Plastic bottles. Make claims we can't back up.",
        },
      ]}
      cta={{ href: "/", label: "Shop now" }}
    />
  );
}
