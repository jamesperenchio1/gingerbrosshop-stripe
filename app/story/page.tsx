import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Our story · Gingerbros" };

export default function StoryPage() {
  return (
    <InfoPage
      eyebrow="Our story"
      title="Started in a bedroom, not a boardroom."
      intro="It started in Australia. I love a properly carbonated drink and I never liked the sugar — and I figured ginger beer was something I could just make in my own room. The first batches were half-experiment, half-trying-to-catch-a-buzz off the natural ferment. One thing led to another, the recipe got better, the goal shifted from buzz to balance, and here we are."
      sections={[
        {
          h: "What we make",
          body: "One drink: Ginger Beer. The cocktail mixer / Friday-night drink / cold-with-food drink. Bold, ginger-forward, fully carbonated. Naturally low sugar from the fermentation itself. We wanted to make this one thing really well rather than spread thin across a range.",
        },
        {
          h: "How it's made",
          body: "1. Wild ginger-bug starter from fresh ginger and a little sugar — wild yeast does the work.\n2. Brew strong ginger tea, blend with the bug + sugar, and ferment until the sugar is mostly consumed and the ginger character is rounded — taste-tested, not on a timer.\n3. Pasteurize to lock the flavor in.\n4. Add fresh lime.\n5. Force-carbonate for clean, consistent fizz.\n6. Bottle in glass.\n\nIngredients: fresh ginger, filtered water, lime, ginger-bug culture.",
        },
        {
          h: "Why batches are small",
          body: "We make a few liters at a time. Small enough to taste-test every batch and adjust. If a batch is off, it doesn't get bottled.",
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
