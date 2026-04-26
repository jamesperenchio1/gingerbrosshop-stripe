import { kv } from "@vercel/kv";
import type { FlavorId } from "./products";

export type Review = {
  id: string;
  productId: FlavorId;
  rating: 1 | 2 | 3 | 4 | 5;
  name: string;
  comment: string;
  createdAt: number;
};

const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const key = (id: FlavorId) => `gb:reviews:${id}`;

export async function listReviews(id: FlavorId): Promise<Review[]> {
  if (!HAS_KV) return [];
  const arr = await kv.lrange<Review>(key(id), 0, -1);
  // newest first; lpush stores in reverse insertion so head is freshest
  return arr ?? [];
}

export async function addReview(r: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const review: Review = {
    ...r,
    id: `rv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  if (HAS_KV) {
    await kv.lpush(key(r.productId), review);
    // cap at 500 reviews per product to prevent runaway storage
    await kv.ltrim(key(r.productId), 0, 499);
  }
  return review;
}

export type ReviewSummary = {
  count: number;
  average: number;
  buckets: [number, number, number, number, number]; // % per star, [5,4,3,2,1]
};

export function summarize(reviews: Review[]): ReviewSummary {
  if (reviews.length === 0) return { count: 0, average: 0, buckets: [0,0,0,0,0] };
  const total = reviews.reduce((a, r) => a + r.rating, 0);
  const counts = [0,0,0,0,0];
  for (const r of reviews) counts[5 - r.rating]++;
  const buckets = counts.map(c => Math.round((c / reviews.length) * 100)) as [number,number,number,number,number];
  return { count: reviews.length, average: total / reviews.length, buckets };
}
