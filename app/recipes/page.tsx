import Link from "next/link";
import { Chrome } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { Icon, ICONS, BottleImage } from "@/components/shared";

export const metadata = { title: "Recipes · Gingerbros" };

type Recipe = {
  id: string;
  title: string;
  tagline: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  servings: number;
  ingredients: string[];
  steps: string[];
  pairWith?: string;
};

const RECIPES: Recipe[] = [
  {
    id: "bangkok-mule",
    title: "Bangkok Mule",
    tagline: "Our take on a Moscow Mule. Spicier, drier, a touch citrus.",
    difficulty: "Easy",
    time: "2 min",
    servings: 1,
    ingredients: [
      "60ml dark rum (or vodka, or whisky)",
      "1 Gingerbros Ginger Beer (chilled)",
      "1 lime wedge — half juiced, half garnish",
      "Plenty of crushed ice",
      "Mint sprig (optional)",
    ],
    steps: [
      "Fill a copper mug or rocks glass to the brim with crushed ice.",
      "Pour the rum, then squeeze in half the lime.",
      "Top with ginger beer slowly so the head doesn't blow off the glass.",
      "Stir once, gently. Garnish with mint and the second lime wedge.",
    ],
    pairWith: "Spicy noodle soup. Salty late-night street food.",
  },
  {
    id: "dark-storm",
    title: "Dark & Stormy",
    tagline: "The classic. Dark rum, ginger beer, lime. Three ingredients.",
    difficulty: "Easy",
    time: "2 min",
    servings: 1,
    ingredients: [
      "60ml dark rum",
      "1 Gingerbros Ginger Beer (chilled)",
      "Juice of half a lime",
      "Ice",
    ],
    steps: [
      "Fill a tall glass with ice.",
      "Pour the lime juice and rum.",
      "Top with ginger beer — pour slowly over the back of a spoon to layer it.",
      "Garnish with a lime wheel.",
    ],
    pairWith: "Anything from the grill. Charred pork skewers.",
  },
  {
    id: "spicy-mocktail",
    title: "Spicy Ginger Punch",
    tagline: "Zero proof. The burn is all ginger.",
    difficulty: "Easy",
    time: "3 min",
    servings: 1,
    ingredients: [
      "1 Gingerbros Ginger Beer",
      "30ml fresh lime juice",
      "4–5 slices fresh chilli",
      "Crushed ice",
      "Mint to garnish",
    ],
    steps: [
      "Muddle the chilli slices with the lime juice in the glass.",
      "Fill with crushed ice.",
      "Top with ginger beer. Stir once.",
      "Garnish with mint.",
    ],
    pairWith: "Spicy Thai street food. Especially good with som tam.",
  },
];

export default function RecipesPage() {
  return (
    <Chrome>
      <article style={{ background: "#FDF6EC", padding: "56px 24px 80px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", fontSize: 11, margin: "0 0 12px" }}>Recipes</p>
          <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Three ways to drink it.
          </h1>
          <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 17, color: "rgba(44,24,16,0.72)", margin: "0 0 36px", lineHeight: 1.6, maxWidth: 640 }}>
            Ginger beer works straight from the fridge or as the backbone of a proper cocktail. Here&apos;s three ways to get the most out of it.
          </p>

          <div style={{ display: "grid", gap: 18 }}>
            {RECIPES.map(r => (
              <RecipeCard key={r.id} r={r}/>
            ))}
          </div>

          <div style={{ marginTop: 40, padding: 28, background: "#fff", borderRadius: 16, fontFamily: "var(--gb-font-sans)", fontSize: 15, color: "rgba(44,24,16,0.7)", lineHeight: 1.6, textAlign: "center" }}>
            Got a recipe of your own? <Link href="/contact" style={{ color: "#C8893C", fontWeight: 700, textDecoration: "underline" }}>Send it our way</Link> — we feature one a month on the blog and the customer gets a free 6-pack.
          </div>
        </div>
      </article>
      <Footer/>
    </Chrome>
  );
}

function RecipeCard({ r }: { r: Recipe }) {
  return (
    <section style={{ background: "#fff", borderRadius: 16, padding: 28, display: "grid", gridTemplateColumns: "180px 1fr", gap: 28 }} className="gb-grid-2">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 14 }}>
        <div style={{ background: "linear-gradient(145deg,#F5E6D3,#FDF6EC)", borderRadius: 14, padding: 14, width: "100%", display: "flex", justifyContent: "center" }}>
          <BottleImage flavor="beer" size={130} src="/products/ginger-beer-bg.png"/>
        </div>
        <div style={{ display: "grid", gap: 8, width: "100%", fontSize: 12, fontFamily: "var(--gb-font-sans)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(44,24,16,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, fontSize: 10 }}>Uses</span>
            <span style={{ color: "#2C1810", fontWeight: 700 }}>Ginger Beer</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(44,24,16,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, fontSize: 10 }}>Time</span>
            <span style={{ color: "#2C1810", fontWeight: 700 }}>{r.time}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(44,24,16,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, fontSize: 10 }}>Difficulty</span>
            <span style={{ color: "#2C1810", fontWeight: 700 }}>{r.difficulty}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(44,24,16,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, fontSize: 10 }}>Serves</span>
            <span style={{ color: "#2C1810", fontWeight: 700 }}>{r.servings}</span>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontFamily: "var(--gb-font-display)", fontSize: 26, fontWeight: 700, color: "#2C1810", margin: "0 0 6px" }}>{r.title}</h2>
        <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 14, color: "rgba(44,24,16,0.7)", margin: "0 0 20px", lineHeight: 1.55 }}>{r.tagline}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="gb-grid-2">
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "#4A7C3F", marginBottom: 10 }}>Ingredients</div>
            <ul style={{ listStyle: "disc", padding: "0 0 0 18px", margin: 0, fontFamily: "var(--gb-font-sans)", fontSize: 14, color: "rgba(44,24,16,0.78)", lineHeight: 1.65 }}>
              {r.ingredients.map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "#4A7C3F", marginBottom: 10 }}>Steps</div>
            <ol style={{ listStyle: "decimal", padding: "0 0 0 18px", margin: 0, fontFamily: "var(--gb-font-sans)", fontSize: 14, color: "rgba(44,24,16,0.78)", lineHeight: 1.65 }}>
              {r.steps.map(s => <li key={s} style={{ marginBottom: 6 }}>{s}</li>)}
            </ol>
          </div>
        </div>

        {r.pairWith && (
          <div style={{ marginTop: 18, padding: "12px 14px", background: "#FDF6EC", borderRadius: 10, fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.72)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#C8893C" }}><Icon d={ICONS.sparkle} size={14} stroke={2}/></span>
            <span><strong style={{ color: "#2C1810" }}>Pair with:</strong> {r.pairWith}</span>
          </div>
        )}

        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <Link href="/shop/beer" className="gb-btn gb-btn--primary" style={{ fontSize: 13, padding: "10px 18px" }}>
            Shop Ginger Beer <Icon d={ICONS.arrow} size={14} stroke={2}/>
          </Link>
        </div>
      </div>
    </section>
  );
}
