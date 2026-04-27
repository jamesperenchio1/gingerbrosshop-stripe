import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Our story · Gingerbros" };

export default function StoryPage() {
  return (
    <InfoPage
      eyebrow="Our story"
      title="Two brothers, one ginger habit."
      intro="Gingerbros is a small Bangkok brewery making ginger drinks the way we wanted to drink them — real ginger, no sugar, no flavor lab. We started because we couldn't find anything in Thai supermarkets that was both honest about ingredients and actually fun to drink. So we made our own."
      sections={[
        {
          h: "What we make",
          body: "Three things, on purpose:\n\n• A naturally fermented ginger beer (14 days, real fizz, real heat).\n• A lighter ginger ale, also fermented, with lime.\n• A 60ml ginger shot blended with coconut water and taurine — for mornings, workouts, and the 3pm slump.\n\nAll three are sweetened with erythritol, so there's zero added sugar in any of them.",
        },
        {
          h: "How we brew it",
          body: "We use the ginger-bug method. Fresh ginger goes into a wild starter culture for a few days until it's actively fermenting. We brew a strong ginger tea, blend it with the bug, and let the mix ferment until it's where we want it. Then we pasteurize, sweeten with erythritol, hit it with fresh lime, keg, and bottle. Two weeks start to finish.",
        },
        {
          h: "Where we are now",
          body: "Tiny operation in Bangkok. Three core SKUs. Glass bottles, not plastic. We ship Thailand-wide via Kerry Express within 48 hours of bottling.",
        },
        {
          h: "What we won't do",
          body: "Add sugar. Use flavoring extracts. Force-carbonate from a CO₂ tank. Ship plastic. Make claims we can't back up.",
        },
      ]}
      cta={{ href: "/", label: "Shop the range" }}
    />
  );
}
