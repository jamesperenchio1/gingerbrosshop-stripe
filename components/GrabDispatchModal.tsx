"use client";
import { useState } from "react";
import { Icon, ICONS } from "./shared";

export type GrabDispatchOrder = {
  orderId: string;
  email?: string;
  shippingName?: string | null;
  shippingPhone?: string | null;
  shippingAddress?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
  items?: { title?: string; variant?: string; qty?: number }[];
};

const GRAB_EXPRESS_URL = "https://grab.com/th/services/transport-and-delivery/express/";

function formatAddress(a: GrabDispatchOrder["shippingAddress"]): string {
  if (!a) return "";
  return [a.line1, a.line2, a.city, a.state, a.postal_code, a.country].filter(Boolean).join(", ");
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // older browsers — leave silent
    }
  };
  return (
    <div style={{ background: "#FDF6EC", borderRadius: 10, padding: "10px 14px", display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(44,24,16,0.55)", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, color: "#2C1810", wordBreak: "break-word", lineHeight: 1.4 }}>{value || <span style={{ color: "rgba(44,24,16,0.4)" }}>(missing)</span>}</div>
      </div>
      <button
        onClick={onCopy}
        disabled={!value}
        style={{ padding: "6px 12px", background: copied ? "#4A7C3F" : "#fff", color: copied ? "#fff" : "#2C1810", border: "1px solid rgba(44,24,16,0.12)", borderRadius: 9999, fontSize: 11, fontWeight: 700, cursor: value ? "pointer" : "not-allowed", fontFamily: "inherit", whiteSpace: "nowrap" }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function GrabDispatchModal({
  order,
  onClose,
  onMarkDispatched,
}: {
  order: GrabDispatchOrder;
  onClose: () => void;
  onMarkDispatched: () => void | Promise<void>;
}) {
  const [marking, setMarking] = useState(false);
  const address = formatAddress(order.shippingAddress);
  const itemSummary = (order.items ?? [])
    .map(i => `${i.qty ?? 1}× ${i.title ?? "Item"}${i.variant ? ` (${i.variant})` : ""}`)
    .join(", ");
  const ref = `Gingerbros #${order.orderId}`;

  const handleMark = async () => {
    setMarking(true);
    try { await onMarkDispatched(); } finally { setMarking(false); }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(44,24,16,0.5)", backdropFilter: "blur(4px)", zIndex: 200 }}/>
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(560px, calc(100% - 32px))", maxHeight: "calc(100vh - 64px)", overflowY: "auto", background: "#fff", borderRadius: 18, zIndex: 201, boxShadow: "0 24px 60px rgba(44,24,16,0.25)", padding: 28, fontFamily: "var(--gb-font-sans)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C8893C", fontWeight: 700, marginBottom: 4 }}>Book Grab Express</div>
            <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810" }}>Order #{order.orderId}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: 0, cursor: "pointer", color: "rgba(44,24,16,0.6)" }}>
            <Icon d={ICONS.close} size={20}/>
          </button>
        </div>

        <p style={{ fontSize: 13, color: "rgba(44,24,16,0.7)", lineHeight: 1.55, margin: "0 0 16px" }}>
          Copy these fields into the Grab Express booking flow. Once dispatched, mark the order as packed below.
        </p>

        <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
          <CopyField label="Recipient" value={order.shippingName ?? ""}/>
          <CopyField label="Phone" value={order.shippingPhone ?? ""}/>
          <CopyField label="Drop-off address" value={address}/>
          <CopyField label="Order reference" value={ref}/>
          {itemSummary && <CopyField label="Items" value={itemSummary}/>}
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <a
            href={GRAB_EXPRESS_URL}
            target="_blank"
            rel="noreferrer"
            className="gb-btn gb-btn--primary"
            style={{ background: "#00B14F", justifyContent: "center", padding: "12px 18px", textDecoration: "none" }}
          >
            Open Grab Express <Icon d={ICONS.arrow} size={14}/>
          </a>
          <button
            onClick={handleMark}
            disabled={marking}
            style={{ padding: "10px 16px", background: "#fff", color: "#2C1810", border: "1px solid rgba(44,24,16,0.15)", borderRadius: 9999, fontSize: 13, fontWeight: 600, cursor: marking ? "wait" : "pointer", fontFamily: "inherit" }}
          >
            {marking ? "Saving…" : "Mark as dispatched (status → packed)"}
          </button>
        </div>
      </div>
    </>
  );
}
