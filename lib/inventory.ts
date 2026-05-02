import { kv } from "@vercel/kv";
import type { FlavorId } from "./products";

// Default starting stock counts.
const SEED: Record<FlavorId, number> = {
  beer: 480,
};

const LOW_STOCK_THRESHOLD = 36;

const key = (id: FlavorId) => `gb:stock:${id}`;
const HAS_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function getStock(id: FlavorId): Promise<number> {
  if (!HAS_KV) return SEED[id];
  const v = await kv.get<number>(key(id));
  if (v == null) {
    await kv.set(key(id), SEED[id]);
    return SEED[id];
  }
  return v;
}

export async function getAllStock(): Promise<Record<FlavorId, number>> {
  const ids: FlavorId[] = ["beer"];
  const entries = await Promise.all(ids.map(async id => [id, await getStock(id)] as const));
  return Object.fromEntries(entries) as Record<FlavorId, number>;
}

export async function decrementStock(id: FlavorId, by: number): Promise<number> {
  if (!HAS_KV) return Math.max(0, SEED[id] - by);
  const next = await kv.decrby(key(id), by);
  if (next < 0) {
    // Floor at 0 so the visible stock never reads negative. We log so an
    // operator can chase the over-sell, but we still return 0 (the order
    // already completed payment by the time this runs).
    console.warn(`[inventory] oversell on ${id}: went to ${next}, flooring to 0`);
    await kv.set(key(id), 0);
    return 0;
  }
  return next;
}

export async function setStock(id: FlavorId, value: number): Promise<void> {
  if (!HAS_KV) return;
  await kv.set(key(id), value);
}

export function isLowStock(count: number): boolean {
  return count <= LOW_STOCK_THRESHOLD;
}
