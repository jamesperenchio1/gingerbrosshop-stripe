import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Our story · Gingerbros" };

export default function StoryPage() {
  return (
    <InfoPage
      eyebrow="Our story"
      title="Started for a clean morning, not a brand."
      intro="Gingerbros began as a personal project. Cutting sugar from my morning routine and wanting a sharp, clean ginger drink to start the day with. Nothing on the shelf in Bangkok actually fit — every ginger beer was 30+ grams of sugar, every shot was overpriced concentrate. So I started making my own."
      sections={[
        {
          h: "What we make, and why three things",
          body: "Three drinks that map to three real moments:\n\n• Ginger Beer — the cocktail mixer / Friday-night drink. Bold, ginger-forward, fully carbonated.\n• Ginger Ale — the everyday drinker. Lighter ratio of ginger, brighter lime, easier with food.\n• Ginger Shot — the morning shot. Cold-pressed ginger + coconut water + taurine. The original idea that started this.\n\nNo fourth flavor planned. Three is a focused range; we'd rather make these three really well than dilute it.",
        },
        {
          h: "How the beer is made",
          body: "1. Wild ginger-bug starter from fresh ginger and a little sugar — wild yeast does the work.\n2. Brew strong ginger tea, blend with the bug + sugar, ferment for 10–14 days until the sugar is fully consumed (taste-tested, not on a timer).\n3. Pasteurize to lock the flavor in.\n4. Sweeten back with erythritol — yeast can't metabolize it, so it stays as a clean, zero-calorie sweetener.\n5. Hit with fresh lime.\n6. Force-carbonate for clean, consistent fizz.\n7. Bottle in glass.\n\nIngredients in the bottle: fresh ginger, erythritol, filtered water, lime, ginger-bug culture. 0g residual sugar.",
        },
        {
          h: "How the ale is made",
          body: "Different drink, simpler build. Cook fresh ginger and lime down into a concentrated syrup, sweeten with erythritol, then blend with cold soda water and bottle. No fermentation — that's the beer. The ale is honest ginger syrup and bubbles, lighter on the heat, brighter on the lime. Goes straight into a glass with ice or stretches a splash of rum.",
        },
        {
          h: "How the shot is made",
          body: "Cold-press fresh ginger root. Blend with coconut water (for natural electrolytes) and a measured dose of taurine. Bottle cold. No fermentation, no sweetener, no flavoring. Three real ingredients on the label.",
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
