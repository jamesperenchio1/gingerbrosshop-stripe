import { NextResponse } from "next/server";
import { z } from "zod";
import { addReview, listReviews } from "@/lib/reviews";
import type { FlavorId } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FLAVOR_IDS = ["beer"] as const;

const PostBody = z.object({
  productId: z.enum(FLAVOR_IDS),
  rating: z.number().int().min(1).max(5),
  name: z.string().trim().min(1).max(60),
  comment: z.string().trim().min(2).max(800),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") as FlavorId | null;
  if (!id || !FLAVOR_IDS.includes(id as (typeof FLAVOR_IDS)[number])) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const reviews = await listReviews(id);
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = PostBody.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid review payload" }, { status: 400 });
  }
  const review = await addReview({
    productId: parsed.productId,
    rating: parsed.rating as 1 | 2 | 3 | 4 | 5,
    name: parsed.name,
    comment: parsed.comment,
  });
  return NextResponse.json({ review });
}
