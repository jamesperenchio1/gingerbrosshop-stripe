"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { FlavorId } from "./products";

export type CartLine = {
  uid: string;            // unique row key (id+variant+sub)
  id: FlavorId | "bundle";
  flavor: FlavorId;
  title: string;
  variant: "Single" | "6-Pack" | "Custom 6-Pack";
  priceId?: string;       // Stripe price ID for Single/6-Pack
  bundlePicks?: FlavorId[]; // for custom bundle
  price: number;          // unit price in baht (display only — server re-derives from priceId)
  qty: number;
  sub?: boolean;          // subscribe & save
};

type CartCtx = {
  items: CartLine[];
  add: (line: Omit<CartLine, "uid">, opts?: { openDrawer?: boolean }) => void;
  remove: (uid: string) => void;
  changeQty: (uid: string, delta: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "gb-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const add: CartCtx["add"] = (line, opts) => {
    setItems(prev => {
      const uid = `${line.id}|${line.variant}|${line.sub ? "sub" : "one"}`;
      const found = prev.find(i => i.uid === uid);
      if (found) return prev.map(i => i === found ? { ...i, qty: i.qty + line.qty } : i);
      return [...prev, { ...line, uid }];
    });
    if (opts?.openDrawer !== false) setDrawerOpen(true);
  };

  const remove: CartCtx["remove"] = (uid) => setItems(p => p.filter(i => i.uid !== uid));
  const changeQty: CartCtx["changeQty"] = (uid, d) =>
    setItems(p => p.map(i => i.uid === uid ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const clear = () => setItems([]);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, changeQty, clear, count, subtotal, drawerOpen, openDrawer, closeDrawer }}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}
