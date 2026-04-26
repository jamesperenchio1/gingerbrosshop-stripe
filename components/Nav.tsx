"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, ICONS, Logo } from "./shared";
import { useCart } from "@/lib/cart";

function AnnouncementBar() {
  const messages = [
    { icon: ICONS.truck, text: "Free shipping on orders over ฿500" },
    { icon: ICONS.leaf, text: "Brewed fresh in Bangkok · Ships within 48h" },
    { icon: ICONS.gift, text: "New: Build-your-own 6-pack — mix and match" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % messages.length), 4200);
    return () => clearInterval(t);
  }, [messages.length]);
  return (
    <div style={{
      background: "#2C1810", color: "#FDF6EC",
      fontFamily: "var(--gb-font-sans)", fontSize: 12, fontWeight: 500,
      letterSpacing: "0.08em", textAlign: "center", padding: "9px 16px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      overflow: "hidden", position: "relative",
    }}>
      <span style={{ color: "#C8893C", display: "flex", alignItems: "center" }}>
        <Icon d={messages[i].icon} size={14} stroke={2}/>
      </span>
      <span style={{ transition: "opacity 400ms" }}>{messages[i].text}</span>
    </div>
  );
}

export function Nav({ onOpenCart, onOpenSearch, onOpenAccount }: {
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}) {
  const { count } = useCart();

  const navBtn: React.CSSProperties = {
    background: "none", border: 0, cursor: "pointer",
    fontFamily: "var(--gb-font-sans)", fontSize: 14, fontWeight: 500,
    color: "rgba(44,24,16,0.75)", padding: "8px 4px",
    transition: "color 200ms", position: "relative",
    display: "inline-flex", alignItems: "center", gap: 4,
    textDecoration: "none",
  };

  return (
    <>
      <AnnouncementBar />
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid #F5E6D3",
        background: "rgba(253,246,236,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      }}>
        <nav style={{
          maxWidth: 1440, margin: "0 auto", padding: "0 32px", height: 68,
          display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
        }}>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="gb-hide-mobile">
            <Link href="/#shop" style={navBtn}>Shop</Link>
            <Link href="/shop/beer" style={navBtn}>Flavors <Icon d={ICONS.chevDown} size={12} stroke={2}/></Link>
            <Link href="/#story" style={navBtn}>Our Story</Link>
            <Link href="/tracking" style={navBtn}>Track order</Link>
          </div>

          <Link href="/" style={{ background: "none", border: 0, cursor: "pointer", padding: 0, justifySelf: "center" }}>
            <Logo size={26}/>
          </Link>

          <div style={{ display: "flex", gap: 22, justifyContent: "flex-end", alignItems: "center" }}>
            <span style={{ ...navBtn }} className="gb-hide-mobile">
              <Icon d={ICONS.pin} size={16} stroke={2}/> TH · THB
            </span>
            <button onClick={onOpenSearch} style={{ ...navBtn, padding: 0 }} aria-label="Search">
              <Icon d={ICONS.search} size={18}/>
            </button>
            <button onClick={onOpenAccount} style={{ ...navBtn, padding: 0 }} aria-label="Account">
              <Icon d={ICONS.user} size={18}/>
            </button>
            <button onClick={onOpenCart} style={{
              ...navBtn, padding: "10px 16px",
              background: "#2C1810", color: "#FDF6EC", borderRadius: 9999,
            }}>
              <Icon d={ICONS.bag} size={15} stroke={2}/>
              <span style={{ fontWeight: 600 }}>Cart</span>
              <span style={{
                background: "#C8893C", color: "#fff", borderRadius: 9999,
                minWidth: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, padding: "0 6px",
              }}>{count}</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
