"use client";
import { useState } from "react";
import { Nav } from "./Nav";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay, AccountOverlay } from "./Overlays";
import { useCart } from "@/lib/cart";

export function Chrome({ children }: { children: React.ReactNode }) {
  const { drawerOpen, openDrawer, closeDrawer } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <>
      <Nav
        onOpenCart={openDrawer}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />
      {children}
      <CartDrawer open={drawerOpen} onClose={closeDrawer}/>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)}/>
      <AccountOverlay open={accountOpen} onClose={() => setAccountOpen(false)}/>
    </>
  );
}
