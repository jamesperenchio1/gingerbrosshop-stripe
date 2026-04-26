"use client";
import { useRouter } from "next/navigation";
import { Bottle, Icon, ICONS } from "./shared";
import { useCart } from "@/lib/cart";
import { getProduct } from "@/lib/products";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove, changeQty, subtotal, add } = useCart();
  const router = useRouter();
  const shipping = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 60;
  const freeShipProgress = Math.min(100, (subtotal / 500) * 100);

  const onCheckout = () => { onClose(); router.push("/checkout"); };
  const addCrossSell = () => {
    const shot = getProduct("shot");
    add({
      id: shot.id,
      flavor: shot.flavor,
      title: shot.title,
      variant: "Single",
      priceId: shot.prices.single,
      price: shot.single,
      qty: 1,
    });
  };

  return (
    <>
      <div onClick={onClose} style={{
        position:"fixed", inset:0, background:"rgba(44,24,16,0.4)", zIndex:100,
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition:"opacity 300ms",
        backdropFilter: open ? "blur(4px)" : "none",
      }}/>
      <aside style={{
        position:"fixed", top:0, right:0, bottom:0, width: "min(460px, 100%)", background:"#FDF6EC", zIndex:101,
        boxShadow:"-20px 0 60px rgba(44,24,16,0.15)",
        transform: open ? "translateX(0)" : "translateX(100%)", transition:"transform 400ms cubic-bezier(0.5,0,0.5,1)",
        display:"flex", flexDirection:"column",
      }}>
        <header style={{ padding:"20px 24px", borderBottom:"1px solid rgba(44,24,16,0.08)", display:"flex", justifyContent:"space-between", alignItems:"center", background: "#fff" }}>
          <div>
            <h3 style={{ fontFamily:"var(--gb-font-display)", fontSize:22, fontWeight:700, margin:0, color:"#2C1810" }}>Your cart</h3>
            <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.55)", marginTop: 2 }}>
              {items.length} {items.length === 1 ? "item" : "items"}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:0, cursor:"pointer", color:"#2C1810" }}><Icon d={ICONS.close} size={22}/></button>
        </header>

        {items.length === 0 ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, gap:18 }}>
            <div style={{ width:76, height:76, borderRadius:"50%", background:"#F5E6D3", display:"flex", alignItems:"center", justifyContent:"center", color:"#C8893C" }}>
              <Icon d={ICONS.bag} size={32}/>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily:"var(--gb-font-display)", fontSize: 22, fontWeight: 600, color:"#2C1810" }}>Your cart is empty</div>
              <p style={{ fontFamily:"var(--gb-font-sans)", color:"rgba(44,24,16,0.6)", margin:"8px 0 0", fontSize: 14 }}>Let&apos;s fix that. The ale is very popular.</p>
            </div>
            <button onClick={onClose} className="gb-btn gb-btn--primary">Shop the range</button>
          </div>
        ) : (
          <>
            <div style={{ padding:"16px 24px", background:"#fff", borderBottom:"1px solid rgba(44,24,16,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: "var(--gb-font-sans)", fontSize: 12 }}>
                <span style={{ color:"#2C1810" }}>
                  {shipping === 0 ? <span style={{ color: "#4A7C3F", fontWeight: 700 }}>✓ Free shipping unlocked</span> : <>Add <strong>฿{500-subtotal}</strong> more for free shipping</>}
                </span>
                <span style={{ color: "rgba(44,24,16,0.5)" }}>฿{subtotal} / ฿500</span>
              </div>
              <div style={{ height:6, background:"#F5E6D3", borderRadius:4, overflow:"hidden" }}>
                <div style={{ width: `${freeShipProgress}%`, height:"100%", background:"linear-gradient(90deg, #C8893C, #4A7C3F)", transition:"width 400ms" }}/>
              </div>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"0 24px" }}>
              {items.map(i => (
                <div key={i.uid} style={{ display:"grid", gridTemplateColumns:"80px 1fr auto", gap:14, padding:"18px 0", borderBottom:"1px solid rgba(44,24,16,0.06)" }}>
                  <div style={{ width:80, height:96, background:"linear-gradient(145deg,#F5E6D3,#FDF6EC)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Bottle flavor={i.flavor} size={70}/>
                  </div>
                  <div>
                    <div style={{ fontFamily:"var(--gb-font-display)", fontWeight:600, fontSize:15, color:"#2C1810" }}>{i.title}</div>
                    <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.14em", color:"rgba(44,24,16,0.5)", marginTop:3 }}>{i.variant}</div>
                    {i.sub && <div style={{ display: "inline-block", marginTop: 6, padding: "2px 8px", background: "rgba(74,124,63,0.14)", color: "#4A7C3F", fontSize: 10, fontWeight: 700, borderRadius: 9999, fontFamily: "var(--gb-font-sans)", letterSpacing: "0.1em" }}>SUBSCRIPTION · 10% OFF</div>}
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:10 }}>
                      <div style={{ display:"flex", alignItems:"center", border:"1px solid rgba(44,24,16,0.12)", borderRadius:9999, background: "#fff" }}>
                        <button onClick={() => changeQty(i.uid, -1)} style={{ background:"none", border:0, cursor:"pointer", padding:"6px 10px", color:"#2C1810" }}><Icon d={ICONS.minus} size={12}/></button>
                        <span style={{ width:20, textAlign:"center", fontSize:12, fontWeight:700 }}>{i.qty}</span>
                        <button onClick={() => changeQty(i.uid, 1)} style={{ background:"none", border:0, cursor:"pointer", padding:"6px 10px", color:"#2C1810" }}><Icon d={ICONS.plus} size={12}/></button>
                      </div>
                      <button onClick={() => remove(i.uid)} style={{ background:"none", border:0, cursor:"pointer", color:"rgba(44,24,16,0.5)", fontSize:11, textDecoration:"underline", fontFamily:"inherit" }}>Remove</button>
                    </div>
                  </div>
                  <div style={{ fontFamily:"var(--gb-font-sans)", fontWeight:700, color:"#C8893C", fontSize:15 }}>฿{i.price * i.qty}</div>
                </div>
              ))}

              {/* Cross-sell shot */}
              {!items.find(i => i.id === "shot" && i.variant === "Single" && !i.sub) && (
                <div style={{ margin: "20px 0", padding: 16, background: "#fff", borderRadius: 14 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C8893C", fontWeight: 700, marginBottom: 12, fontFamily: "var(--gb-font-sans)" }}>Often added with this</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 52, height: 64, background: "linear-gradient(145deg,#F5E6D3,#FDF6EC)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bottle flavor="shot" size={44}/>
                    </div>
                    <div style={{ flex: 1, fontFamily: "var(--gb-font-sans)" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#2C1810" }}>Ginger Shot · Single</div>
                      <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginTop: 2 }}>The morning ritual</div>
                    </div>
                    <button onClick={addCrossSell} style={{ padding: "8px 14px", background: "#2C1810", color: "#FDF6EC", border: 0, borderRadius: 9999, fontSize: 12, fontWeight: 600, fontFamily: "var(--gb-font-sans)", cursor: "pointer" }}>
                      + ฿89
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div style={{ borderTop:"1px solid rgba(44,24,16,0.08)", padding:"20px 24px", background:"#fff" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"rgba(44,24,16,0.7)", marginBottom:6, fontFamily: "var(--gb-font-sans)" }}>
                <span>Subtotal</span><span>฿{subtotal}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"rgba(44,24,16,0.7)", marginBottom:14, fontFamily: "var(--gb-font-sans)" }}>
                <span>Shipping</span><span>{shipping===0 ? <span style={{ color: "#4A7C3F", fontWeight: 700 }}>Free</span> : `฿${shipping}`}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"var(--gb-font-display)", fontSize:24, fontWeight:700, color:"#2C1810", marginBottom:16 }}>
                <span>Total</span><span>฿{subtotal + shipping}</span>
              </div>
              <button onClick={onCheckout} className="gb-btn gb-btn--primary" style={{ width:"100%", justifyContent:"center", fontSize: 15 }}>
                Checkout · ฿{subtotal + shipping} <Icon d={ICONS.arrow} size={16}/>
              </button>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12, fontFamily: "var(--gb-font-sans)", fontSize: 11, color: "rgba(44,24,16,0.5)" }}>
                <Icon d={ICONS.shield} size={12} stroke={2}/>
                Secure · Stripe + PromptPay QR
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
