"use client";
import { useEffect, useState } from "react";
import { Icon, ICONS } from "./shared";
import { GrabDispatchModal, type GrabDispatchOrder } from "./GrabDispatchModal";

type Order = {
  orderId: string;
  status?: string;
  email?: string;
  sessionId?: string;
  method?: "stripe" | "cod";
  isSubscription?: boolean;
  items?: { flavor?: string; title?: string; variant?: string; qty?: number }[];
  shippingName?: string | null;
  shippingPhone?: string | null;
  shippingAddress?: GrabDispatchOrder["shippingAddress"];
};

const STATUS_OPTIONS = ["received", "brewing", "packed", "shipped", "delivered"] as const;

export function AdminOrders() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "stripe" | "subs">("all");
  const [grabOrder, setGrabOrder] = useState<Order | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("gb-admin-secret");
    if (saved) {
      setSecret(saved);
      void load(saved);
    }
  }, []);

  const load = async (s: string) => {
    setBusy(true); setErr(null);
    try {
      const res = await fetch(`/api/admin/orders?secret=${encodeURIComponent(s)}`);
      const data = await res.json();
      if (!res.ok) {
        setErr(data?.error || "Couldn't load orders");
        setAuthed(false);
        return;
      }
      setOrders(data.orders ?? []);
      setAuthed(true);
      sessionStorage.setItem("gb-admin-secret", s);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (orderId: string, status: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/ship?orderId=${encodeURIComponent(orderId)}&secret=${encodeURIComponent(secret)}&status=${status}`);
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Update failed");
      } else {
        setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status } : o));
      }
    } finally { setBusy(false); }
  };

  const logout = () => {
    sessionStorage.removeItem("gb-admin-secret");
    setSecret(""); setAuthed(false); setOrders([]);
  };

  const filtered = orders.filter(o => {
    if (filter === "all") return true;
    if (filter === "stripe") return o.method === "stripe";
    if (filter === "subs") return !!o.isSubscription;
    return true;
  });

  if (!authed) {
    return (
      <div style={{ minHeight: "60vh", padding: "80px 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form
          onSubmit={e => { e.preventDefault(); void load(secret); }}
          style={{ maxWidth: 420, width: "100%", padding: 32, background: "#fff", borderRadius: 16, fontFamily: "var(--gb-font-sans)" }}
        >
          <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 28, fontWeight: 700, color: "#2C1810", marginBottom: 6 }}>
            Owner login
          </div>
          <p style={{ fontSize: 13, color: "rgba(44,24,16,0.6)", margin: "0 0 16px" }}>
            Paste the ADMIN_SECRET from your Vercel env. We&apos;ll keep it in this tab&apos;s sessionStorage.
          </p>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="••••••••••••"
            autoFocus
            style={{ width: "100%", padding: "14px 16px", border: "1px solid rgba(44,24,16,0.15)", borderRadius: 10, fontSize: 14, marginBottom: 12, fontFamily: "inherit" }}
          />
          {err && <div style={{ padding: "10px 12px", background: "#fee", color: "#8B3A1A", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{err}</div>}
          <button type="submit" disabled={busy || !secret} className="gb-btn gb-btn--primary" style={{ width: "100%", justifyContent: "center", opacity: busy ? 0.6 : 1 }}>
            {busy ? "Checking..." : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh", padding: "32px 24px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", fontSize: 11, margin: "0 0 8px" }}>Owner dashboard</p>
            <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 36, fontWeight: 700, color: "#2C1810", margin: 0, letterSpacing: "-0.02em" }}>
              Orders
            </h1>
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.6)", margin: "6px 0 0" }}>
              Showing {filtered.length} of {orders.length} · pulled live from KV
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => load(secret)} className="gb-btn gb-btn--ghost" disabled={busy} style={{ fontSize: 13, padding: "10px 16px" }}>
              {busy ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={async () => {
                if (!confirm("Wipe all product reviews from KV? This is one-way.")) return;
                setBusy(true);
                try {
                  const res = await fetch(`/api/admin/clear-reviews?secret=${encodeURIComponent(secret)}&product=all`, { method: "POST" });
                  const data = await res.json();
                  if (!res.ok) alert(data?.error || "Couldn't clear");
                  else alert(`Cleared: ${JSON.stringify(data.cleared)}`);
                } finally { setBusy(false); }
              }}
              className="gb-btn gb-btn--ghost"
              style={{ fontSize: 13, padding: "10px 16px" }}
            >
              Wipe reviews
            </button>
            <button onClick={logout} className="gb-btn gb-btn--ghost" style={{ fontSize: 13, padding: "10px 16px" }}>Logout</button>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {([
            { id: "all", label: "All" },
            { id: "stripe", label: "Online" },
            { id: "subs", label: "Subscriptions" },
          ] as const).map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "8px 14px", border: filter === f.id ? "1px solid #2C1810" : "1px solid rgba(44,24,16,0.12)",
              background: filter === f.id ? "#2C1810" : "#fff",
              color: filter === f.id ? "#FDF6EC" : "rgba(44,24,16,0.75)",
              borderRadius: 9999, fontSize: 13, fontWeight: 500, fontFamily: "var(--gb-font-sans)", cursor: "pointer",
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: 32, background: "#fff", borderRadius: 14, fontFamily: "var(--gb-font-sans)", color: "rgba(44,24,16,0.65)" }}>
            No orders yet.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {filtered.map(o => (
              <div key={o.orderId} style={{ background: "#fff", borderRadius: 14, padding: 20, fontFamily: "var(--gb-font-sans)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <a href={`/tracking/${o.orderId}`} target="_blank" rel="noreferrer" style={{ fontFamily: "var(--gb-font-display)", fontSize: 18, fontWeight: 700, color: "#2C1810", textDecoration: "none" }}>
                      #{o.orderId}
                    </a>
                    <div style={{ fontSize: 13, color: "rgba(44,24,16,0.65)", marginTop: 4 }}>
                      {o.email ?? "—"}{o.method && o.method !== "cod" && (
                        <> · <span style={{ textTransform: "uppercase", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#4A7C3F" }}>{o.method}</span></>
                      )}
                      {o.isSubscription && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "#C8893C", letterSpacing: "0.1em", textTransform: "uppercase" }}>· Sub</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select
                      value={o.status ?? "received"}
                      onChange={e => setStatus(o.orderId, e.target.value)}
                      disabled={busy}
                      style={{ padding: "8px 12px", border: "1px solid rgba(44,24,16,0.15)", borderRadius: 8, background: "#fff", fontSize: 13, fontFamily: "inherit", color: "#2C1810" }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {o.sessionId && (
                      <a
                        href={`https://dashboard.stripe.com/test/payments?query=${o.orderId}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 12, color: "#C8893C", textDecoration: "underline", fontWeight: 700 }}
                      >
                        Stripe →
                      </a>
                    )}
                    {o.method !== "cod" && !o.isSubscription && !["shipped", "delivered"].includes(o.status ?? "") && (
                      <button
                        onClick={async () => {
                          let order = o;
                          if (!o.shippingAddress) {
                            // Legacy order — backfill from Stripe.
                            try {
                              const res = await fetch(`/api/admin/order-shipping?orderId=${encodeURIComponent(o.orderId)}&secret=${encodeURIComponent(secret)}`);
                              const data = await res.json();
                              if (!res.ok) {
                                alert(data?.error || "Couldn't fetch shipping address");
                                return;
                              }
                              order = { ...o, shippingAddress: data.shippingAddress, shippingName: data.shippingName, shippingPhone: data.shippingPhone };
                              setOrders(prev => prev.map(x => x.orderId === o.orderId ? order : x));
                            } catch (e) {
                              alert(e instanceof Error ? e.message : "Network error");
                              return;
                            }
                          }
                          setGrabOrder(order);
                        }}
                        style={{ padding: "8px 12px", background: "#00B14F", color: "#fff", border: 0, borderRadius: 9999, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Book Grab
                      </button>
                    )}
                  </div>
                </div>

                {o.items && o.items.length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {o.items.map((it, i) => (
                      <span key={i} style={{ padding: "4px 10px", background: "#FDF6EC", borderRadius: 9999, fontSize: 12, color: "rgba(44,24,16,0.75)" }}>
                        {it.qty}× {it.title} {it.variant ? `· ${it.variant}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p style={{ marginTop: 28, fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.55)" }}>
          Tip: Stripe also has its own dashboard at{" "}
          <a href="https://dashboard.stripe.com/test/payments" target="_blank" rel="noreferrer" style={{ color: "#C8893C", textDecoration: "underline" }}>dashboard.stripe.com/test/payments</a>{" "}
          for the full payment view (cards, refunds, subscriptions).
          <br/>Need access to <code>ADMIN_SECRET</code>? Run <code>vercel env ls</code> or check your <code>.env.local</code>.
          <br/><span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 4 }}><Icon d={ICONS.shield} size={12} stroke={2}/> Don&apos;t share this URL or the secret.</span>
        </p>
      </div>
      {grabOrder && (
        <GrabDispatchModal
          order={grabOrder}
          onClose={() => setGrabOrder(null)}
          onMarkDispatched={async () => {
            await setStatus(grabOrder.orderId, "packed");
            setGrabOrder(null);
          }}
        />
      )}
    </div>
  );
}
