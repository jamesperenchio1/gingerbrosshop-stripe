"use client";
import { useState } from "react";
import { Icon, ICONS } from "./shared";

export function AccountClient() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string>("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/account/portal-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Something went wrong");
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setError("Network error — try again");
      setState("error");
    }
  };

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh", padding: "60px 0", fontFamily: "var(--gb-font-sans)" }}>
      <div className="gb-pad-40" style={{ maxWidth: 520, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 44, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#2C1810" }}>
            Manage your <span style={{ fontStyle: "italic", color: "#C8893C" }}>subscription.</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(44,24,16,0.7)", lineHeight: 1.55, margin: 0 }}>
            Enter the email you used at checkout. We&rsquo;ll send you a secure link to your customer portal — change card, pause, swap flavors, or cancel.
          </p>
        </div>

        {state === "sent" ? (
          <div style={{ background: "#fff", borderRadius: 18, padding: 32, textAlign: "center", boxShadow: "0 4px 16px rgba(44,24,16,0.05)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(74,124,63,0.12)", color: "#4A7C3F", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Icon d={ICONS.check} size={26} stroke={2.4}/>
            </div>
            <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810", marginBottom: 8 }}>
              Check your email
            </div>
            <p style={{ fontSize: 14, color: "rgba(44,24,16,0.7)", lineHeight: 1.55, margin: 0 }}>
              If <strong>{email}</strong> has an active subscription with us, a portal link is on its way. The link expires in 15 minutes and works once.
            </p>
            <button onClick={() => { setEmail(""); setState("idle"); }} style={{ marginTop: 20, background: "none", border: 0, color: "#C8893C", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ background: "#fff", borderRadius: 18, padding: 32, boxShadow: "0 4px 16px rgba(44,24,16,0.05)" }}>
            <label htmlFor="email" style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(44,24,16,0.6)", marginBottom: 8 }}>
              Your email
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={state === "sending"}
              style={{
                width: "100%", padding: "14px 16px", fontSize: 16,
                border: "1.5px solid rgba(44,24,16,0.15)", borderRadius: 12,
                fontFamily: "inherit", color: "#2C1810", background: "#FDF6EC",
                outline: "none", marginBottom: 16,
              }}
            />
            {state === "error" && (
              <div style={{ fontSize: 13, color: "#8B3A1A", marginBottom: 14 }}>{error}</div>
            )}
            <button
              type="submit"
              disabled={state === "sending"}
              className="gb-btn gb-btn--primary"
              style={{ background: "#C8893C", width: "100%", justifyContent: "center", padding: "14px 20px", opacity: state === "sending" ? 0.6 : 1 }}
            >
              {state === "sending" ? "Sending…" : <>Send portal link <Icon d={ICONS.arrow} size={14}/></>}
            </button>
          </form>
        )}

        <div style={{ marginTop: 28, fontSize: 13, color: "rgba(44,24,16,0.6)", textAlign: "center", lineHeight: 1.55 }}>
          Just want to track an order? <a href="/tracking" style={{ color: "#C8893C", fontWeight: 700 }}>Order tracking →</a>
        </div>
      </div>
    </div>
  );
}
