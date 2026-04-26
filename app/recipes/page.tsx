import Link from "next/link";
import { Chrome } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { Icon, ICONS, BottleImage } from "@/components/shared";

export const metadata = { title: "Recipes · Gingerbros" };

type Recipe = {
  id: string;
  flavor: "beer" | "ale" | "shot";
  title: string;
  tagline: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;          // e.g. "2 min"
  servings: number;
  ingredients: string[];
  steps: string[];
  pairWith?: string;
};

const RECIPES: Recipe[] = [
  {
    id: "bangkok-mule",
    flavor: "beer",
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
    id: "rum-highball",
    flavor: "ale",
    title: "Highball, the easy way",
    tagline: "Two ingredients. Friday night, sorted.",
    difficulty: "Easy",
    time: "1 min",
    servings: 1,
    ingredients: [
      "45ml dark rum or whisky",
      "1 Gingerbros Ginger Ale (chilled)",
      "Long glass · long ice spear",
      "Lemon twist",
    ],
    steps: [
      "Drop the ice spear in a long glass.",
      "Pour the rum down the side of the glass.",
      "Top gently with ginger ale, twist the lemon peel over the surface, drop it in.",
    ],
    pairWith: "Anything fried — gai tod, tempura, or a bowl of crisps.",
  },
  {
    id: "shrub-spritz",
    flavor: "ale",
    title: "Berry shrub spritz",
    tagline: "Zero-proof. Bright, fruity, a bit grown-up.",
    difficulty: "Easy",
    time: "3 min",
    servings: 1,
    ingredients: [
      "30ml fruit shrub (raspberry, hibiscus, or strawberry vinegar)",
      "1 Gingerbros Ginger Ale",
      "Squeeze of lime",
      "Crushed ice · soda water (optional, to lengthen)",
    ],
    steps: [
      "Fill a wine glass with crushed ice.",
      "Add the shrub and lime juice; stir.",
      "Top with ginger ale. Splash soda if you want it lighter.",
    ],
    pairWith: "Brunch. Hot afternoons. Sunday-doing-nothing.",
  },
  {
    id: "morning-kick",
    flavor: "shot",
    title: "Morning kick",
    tagline: "The simplest serve. Open, drink, go.",
    difficulty: "Easy",
    time: "10 sec",
    servings: 1,
    ingredients: [
      "1 Gingerbros Ginger Shot — straight from the fridge",
      "(Optional) glass of warm water with lemon to chase",
    ],
    steps: [
      "Shake the bottle gently — the ginger settles.",
      "Drink it neat. Cold from the fridge hits best.",
      "If the heat is too much first time, follow with a small glass of warm water and lemon.",
    ],
    pairWith: "Pre-workout. Pre-coffee. Pre-meeting.",
  },
  {
    id: "shot-elevated",
    flavor: "shot",
    title: "Shot, elevated",
    tagline: "When you want it to taste like more than just medicine.",
    difficulty: "Easy",
    time: "2 min",
    servings: 1,
    ingredients: [
      "1 Gingerbros Ginger Shot",
      "120ml fresh orange juice",
      "1 small banana, frozen",
      "1 tsp chia seeds (optional)",
      "Handful of ice",
    ],
    steps: [
      "Add everything to a blender.",
      "Blend until smooth — about 20 seconds.",
      "Pour into a tall glass and drink within an hour for best texture.",
    ],
    pairWith: "Post-workout. A real breakfast.",
  },
  {
    id: "hot-toddy",
    flavor: "shot",
    title: "Cold-fighting toddy",
    tagline: "When you feel a sniffle coming on.",
    difficulty: "Easy",
    time: "3 min",
    servings: 1,
    ingredients: [
      "1 Gingerbros Ginger Shot",
      "200ml hot water (just below boiling)",
      "1 tsp honey",
      "Squeeze of fresh lemon",
      "(Optional) 30ml whisky",
    ],
    steps: [
      "Stir the honey into the hot water until it dissolves.",
      "Add the ginger shot, lemon juice, and whisky (if using).",
      "Drink slowly. Pull a blanket over yourself.",
    ],
  },
];

const FLAVOR_NAMES: Record<Recipe["flavor"], string> = {
  beer: "Ginger Beer",
  ale: "Ginger Ale",
  shot: "Ginger Shot",
};

export default function RecipesPage() {
  return (
    <Chrome>
      <article style={{ background: "#FDF6EC", padding: "56px 24px 80px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", fontSize: 11, margin: "0 0 12px" }}>Recipes</p>
          <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 48, fontWeight: 700, color: "#2C1810", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Six ways to drink it.
          </h1>
          <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 17, color: "rgba(44,24,16,0.72)", margin: "0 0 36px", lineHeight: 1.6, maxWidth: 640 }}>
            Ginger beer for the cocktails you make Friday night. Ginger ale for the afternoon highball. Ginger shot for the morning. Here&apos;s six recipes to get the most out of each.
          </p>

          {/* Filter tabs (visual only, all recipes show on this single page) */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {[
              { id: "all", label: "All recipes" },
              { id: "beer", label: "Ginger Beer" },
              { id: "ale", label: "Ginger Ale" },
              { id: "shot", label: "Ginger Shot" },
            ].map(c => (
              <a key={c.id} href={`#${c.id}`} style={{ padding: "8px 14px", border: "1px solid rgba(44,24,16,0.12)", background: "#fff", color: "rgba(44,24,16,0.75)", borderRadius: 9999, fontSize: 13, fontWeight: 500, fontFamily: "var(--gb-font-sans)", textDecoration: "none" }}>{c.label}</a>
            ))}
          </div>

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
    <section id={r.flavor} style={{ background: "#fff", borderRadius: 16, padding: 28, display: "grid", gridTemplateColumns: "180px 1fr", gap: 28 }} className="gb-grid-2">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 14 }}>
        <div style={{ background: "linear-gradient(145deg,#F5E6D3,#FDF6EC)", borderRadius: 14, padding: 14, width: "100%", display: "flex", justifyContent: "center" }}>
          <BottleImage flavor={r.flavor} size={130} src={`/products/ginger-${r.flavor}-bg.png`}/>
        </div>
        <div style={{ display: "grid", gap: 8, width: "100%", fontSize: 12, fontFamily: "var(--gb-font-sans)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(44,24,16,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, fontSize: 10 }}>Uses</span>
            <span style={{ color: "#2C1810", fontWeight: 700 }}>{FLAVOR_NAMES[r.flavor]}</span>
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
          <Link href={`/shop/${r.flavor}`} className="gb-btn gb-btn--primary" style={{ fontSize: 13, padding: "10px 18px" }}>
            Shop {FLAVOR_NAMES[r.flavor]} <Icon d={ICONS.arrow} size={14} stroke={2}/>
          </Link>
        </div>
      </div>
    </section>
  );
}
