import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Recipes · Gingerbros" };

export default function RecipesPage() {
  return (
    <InfoPage
      eyebrow="Recipes"
      title="Mules, highballs, and a 3pm pick-me-up."
      intro="A starter set of cocktails and serves built around our brews. More coming soon — got a favorite? Reply to any of our emails with the recipe."
      sections={[
        { h: "Bangkok Mule", body: "60ml dark rum or vodka · 1 lime wedge, juiced · 1 Ginger Beer · ice, copper mug if you have one. Build over ice, stir gently, garnish with mint." },
        { h: "Easy highball", body: "45ml whisky · 1 Ginger Ale · lemon twist · plenty of ice. Long glass, gentle pour to keep the bubbles." },
        { h: "Morning kick", body: "1 Ginger Shot, neat, straight from the fridge. Optional: chase with warm water and lemon." },
        { h: "Coming soon", body: "Lao-style fizzy spritz · Khao soi pairing notes · spicy paloma with the shot · zero-proof Mule for the kids." },
      ]}
    />
  );
}
