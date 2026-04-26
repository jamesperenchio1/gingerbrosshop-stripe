"use client";
import { useState } from "react";
import { Nav } from "./Nav";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay, AccountOverlay } from "./Overlays";

export function Chrome({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <>
      <Nav
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />
      {children}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}/>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)}/>
      <AccountOverlay open={accountOpen} onClose={() => setAccountOpen(false)}/>
    </>
  );
}
