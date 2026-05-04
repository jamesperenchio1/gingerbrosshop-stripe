// Single source of truth for product catalog.
// Stripe account: acct_1TC1Ee4xTvnGlHCD (test mode).
//
// STRIPE_PRICES is the only place price data lives.
// All display values (single, sixpack, subAmount, subBottleAmount) are derived
// from the satang amounts here — nothing is repeated elsewhere.

export type FlavorId = "beer";

/** Stripe Price IDs and their satang amounts — colocated so updating one keeps the other in sync. */
const STRIPE_PRICES: Record<FlavorId, {
  single:    { id: string; satang: number };
  sixpack:   { id: string; satang: number };
  sub:       { id: string; satang: number };
  subBottle: { id: string; satang: number };
}> = {
  beer: {
    single:    { id: "price_1TRqTZ4xTvnGlHCDZvNPl4wr", satang: 15000 },
    sixpack:   { id: "price_1TRqTe4xTvnGlHCDqlqD857d", satang: 75000 },
    sub:       { id: "price_1TRqTo4xTvnGlHCDBSSe5v8v", satang: 67500 },
    subBottle: { id: "price_1TRqTu4xTvnGlHCDJnyG9Xl6", satang: 11500 },
  },
};

/** Convert Stripe satang to whole-baht display value. */
function thb(satang: number): number { return satang / 100; }

export type Product = {
  id: FlavorId;
  flavor: FlavorId;
  title: string;
  subtitle: string;
  size: string;
  /** Single-bottle price in baht — derived from STRIPE_PRICES. */
  single: number;
  /** 6-pack price in baht — derived from STRIPE_PRICES. */
  sixpack: number;
  /** Alias for single; kept for compat. */
  singlePrice: number;
  /** Monthly subscription 6-pack price in baht — derived from STRIPE_PRICES. */
  subAmount: number;
  /** Per-bottle monthly subscription price in baht — derived from STRIPE_PRICES. */
  subBottleAmount: number;
  rating: number;
  reviews: number;
  heat: number;
  tag: string;
  tagColor?: string;
  lowStock?: boolean;
  filterTags: string[];
  blurb: string;
  about: string;
  ingredients: string;
  /** Compare-table data. */
  process: string;
  ingredientsShort: string[];
  abv: string;
  serve: string;
  pairsWith: string;
  carbonation: string;
  sugarLabel: string;
  /** Visual block tone used behind the bottle on cards. */
  cardTone: { bg: string; bgHover: string };
  prices: {
    single: string;
    sixpack: string;
    sub: string;
    /** Per-bottle recurring monthly price. Used by mix-pack subscriptions: a sub line of qty=N pulls N bottles of this flavor each month. */
    subBottle: string;
  };
  stripeProductId: string;
  /** Primary, transparent-background image used on cards / PDP hero. */
  heroImage?: string;
  /** Additional photos shown on the PDP gallery. */
  gallery?: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "beer", flavor: "beer", title: "Ginger Beer",
    subtitle: "330ml",
    size: "330ml",
    single:          thb(STRIPE_PRICES.beer.single.satang),
    sixpack:         thb(STRIPE_PRICES.beer.sixpack.satang),
    singlePrice:     thb(STRIPE_PRICES.beer.single.satang),
    subAmount:       thb(STRIPE_PRICES.beer.sub.satang),
    subBottleAmount: thb(STRIPE_PRICES.beer.subBottle.satang),
    rating: 0, reviews: 0, heat: 4,
    tag: "Bestseller",
    filterTags: ["carbonated", "mixer"],
    blurb: "Our flagship. Real ginger, a proper kick, fully carbonated. Low-sugar, ginger-forward.",
    about: "We grow a wild ginger-bug culture from fresh ginger, then pitch it into a strong ginger tea with sugar. When fermentation is right, we pasteurize, add fresh lime, force-carbonate, and bottle.",
    ingredients: "Fresh ginger, filtered water, lime, ginger-bug culture.",
    process: "Wild ferment · Ginger bug",
    ingredientsShort: ["Fresh ginger", "Ginger-bug culture", "Erythritol", "Lime", "Water"],
    abv: "<0.5%",
    serve: "Cold, with food",
    pairsWith: "Grilled, spicy, fatty",
    carbonation: "Force-carbonated",
    sugarLabel: "Naturally low",
    cardTone: { bg: "#F5E6D3", bgHover: "#EDD9C0" },
    stripeProductId: "prod_UPLRWgaSJebePn",
    prices: {
      single:    STRIPE_PRICES.beer.single.id,
      sixpack:   STRIPE_PRICES.beer.sixpack.id,
      sub:       STRIPE_PRICES.beer.sub.id,
      subBottle: STRIPE_PRICES.beer.subBottle.id,
    },
    heroImage: "/products/ginger-beer-bg.png",
    gallery: [
      "/products/ginger-beer-bg.png",
      "/products/ginger-beer-1.jpg",
      "/products/ginger-beer-2.jpg",
      "/products/ginger-beer-3.jpg",
    ],
  },
];

export const PRICE_TO_PRODUCT: Record<string, { id: FlavorId; variant: "Single" | "6-Pack" | "Subscription" | "Sub Bottle" }> = (() => {
  const out: Record<string, { id: FlavorId; variant: "Single" | "6-Pack" | "Subscription" | "Sub Bottle" }> = {};
  for (const p of PRODUCTS) {
    out[p.prices.single]     = { id: p.id, variant: "Single" };
    out[p.prices.sixpack]    = { id: p.id, variant: "6-Pack" };
    out[p.prices.sub]        = { id: p.id, variant: "Subscription" };
    out[p.prices.subBottle]  = { id: p.id, variant: "Sub Bottle" };
  }
  return out;
})();

export function getProduct(id: FlavorId): Product {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) throw new Error(`Unknown product: ${id}`);
  return p;
}

const SHORT: Record<FlavorId, string> = { beer: "Beer" };

/** Format ["beer","beer","beer","beer","beer","beer"] -> "6× Beer". */
export function formatBundlePicks(picks: FlavorId[] | undefined, sep = " · "): string {
  if (!picks || picks.length === 0) return "Custom 6-Pack";
  const counts = picks.reduce((acc, f) => {
    acc[f] = (acc[f] ?? 0) + 1;
    return acc;
  }, {} as Record<FlavorId, number>);
  const order: FlavorId[] = ["beer"];
  return order
    .filter(f => (counts[f] ?? 0) > 0)
    .map(f => `${counts[f]}× ${SHORT[f]}`)
    .join(sep);
}
