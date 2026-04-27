"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Stars } from "./shared";
import type { FlavorId } from "@/lib/products";
import type { Review, ReviewSummary } from "@/lib/reviews";

const EMPTY_SUMMARY: ReviewSummary = { count: 0, average: 0, buckets: [0,0,0,0,0] };

function summarize(rs: Review[]): ReviewSummary {
  if (rs.length === 0) return EMPTY_SUMMARY;
  const total = rs.reduce((a, r) => a + r.rating, 0);
  const counts = [0,0,0,0,0];
  for (const r of rs) counts[5 - r.rating]++;
  const buckets = counts.map(c => Math.round((c / rs.length) * 100)) as [number,number,number,number,number];
  return { count: rs.length, average: total / rs.length, buckets };
}

export function PdpRatingHeader({ summary }: { summary: ReviewSummary }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <Stars value={Math.round(summary.average)} size={16}/>
      <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, fontWeight: 700, color: "#2C1810" }}>
        {summary.count > 0 ? summary.average.toFixed(1) : "—"}
      </span>
      <a href="#reviews" style={{ fontSize: 13, color: "rgba(44,24,16,0.6)", fontFamily: "var(--gb-font-sans)", textDecoration: "underline" }}>
        {summary.count === 0 ? "Be the first to review" : `${summary.count} ${summary.count === 1 ? "review" : "reviews"}`}
      </a>
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const v = hover || value;
  return (
    <div style={{ display: "inline-flex", gap: 4 }} onMouseLeave={() => setHover(0)}>
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill={i <= v ? "#C8893C" : "#F5E6D3"} stroke="#C8893C" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ms).toLocaleDateString();
}

export function ReviewsBlock({ productId, initialReviews }: { productId: FlavorId; initialReviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [thanks, setThanks] = useState(false);

  // sync when server props change (after router.refresh())
  useEffect(() => { setReviews(initialReviews); }, [initialReviews]);

  const summary = summarize(reviews);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!name.trim()) return setErr("Add your name (or initials).");
    if (comment.trim().length < 2) return setErr("Tell us what you thought — even a sentence.");
    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, name: name.trim(), comment: comment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data?.error || "Couldn't post that review."); setBusy(false); return; }
      setReviews(prev => [data.review as Review, ...prev]);
      setName(""); setComment(""); setRating(5);
      setThanks(true);
      setTimeout(() => setThanks(false), 2400);
      router.refresh(); // re-pull server-rendered summary header + shop card counts
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
    } finally {
      setBusy(false);
    }
  };

  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,24,16,0.6)", fontFamily: "var(--gb-font-sans)", marginBottom: 6, display: "block" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", border: "1px solid rgba(44,24,16,0.15)", borderRadius: 10, fontFamily: "var(--gb-font-sans)", fontSize: 14, background: "#fff", outline: "none", color: "#2C1810" };

  return (
    <div id="reviews" style={{ marginTop: 80 }}>
      <div className="gb-grid-2" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 48, padding: "40px 36px", background: "#fff", borderRadius: 20 }}>
        <div>
          <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 56, fontWeight: 700, color: "#2C1810", lineHeight: 1 }}>
            {summary.count > 0 ? summary.average.toFixed(1) : "—"}
          </div>
          <Stars value={Math.round(summary.average)} size={18}/>
          <div style={{ fontSize: 13, color: "rgba(44,24,16,0.6)", fontFamily: "var(--gb-font-sans)", marginTop: 8 }}>
            {summary.count === 0 ? "No reviews yet." : `Based on ${summary.count} ${summary.count === 1 ? "review" : "reviews"}`}
          </div>
          {summary.count > 0 && (
            <div style={{ marginTop: 20 }}>
              {([5,4,3,2,1] as const).map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontFamily: "var(--gb-font-sans)", fontSize: 12 }}>
                  <span style={{ width: 12, color: "rgba(44,24,16,0.7)" }}>{s}</span>
                  <div style={{ flex: 1, height: 6, background: "#F5E6D3", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${summary.buckets[i]}%`, height: "100%", background: "#C8893C" }}/>
                  </div>
                  <span style={{ width: 30, textAlign: "right", color: "rgba(44,24,16,0.55)" }}>{summary.buckets[i]}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <form onSubmit={submit} style={{ background: "#FDF6EC", borderRadius: 14, padding: 20, marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 18, fontWeight: 700, color: "#2C1810", marginBottom: 14 }}>
              Leave a review
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={labelStyle}>Your rating</label>
                <StarPicker value={rating} onChange={setRating}/>
              </div>
              <div>
                <label style={labelStyle}>Name (or initials)</label>
                <input value={name} onChange={e => setName(e.target.value)} maxLength={60} style={inputStyle} placeholder="e.g. Anchalee R."/>
              </div>
              <div>
                <label style={labelStyle}>Your thoughts</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} maxLength={800} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="What did you taste? What did you pair it with? Would you buy again?"/>
              </div>
              {err && <div style={{ padding: "8px 10px", background: "#fee", color: "#8B3A1A", borderRadius: 8, fontSize: 12, fontFamily: "var(--gb-font-sans)" }}>{err}</div>}
              {thanks && <div style={{ padding: "8px 10px", background: "rgba(74,124,63,0.12)", color: "#4A7C3F", borderRadius: 8, fontSize: 12, fontFamily: "var(--gb-font-sans)", fontWeight: 700 }}>Thanks — your review is live.</div>}
              <button type="submit" disabled={busy} className="gb-btn gb-btn--primary" style={{ alignSelf: "flex-start", justifyContent: "center", opacity: busy ? 0.6 : 1 }}>
                {busy ? "Posting..." : "Post review"}
              </button>
            </div>
          </form>

          {reviews.length === 0 ? (
            <div style={{ padding: 20, background: "#FDF6EC", borderRadius: 14, fontFamily: "var(--gb-font-sans)", fontSize: 14, color: "rgba(44,24,16,0.65)" }}>
              No reviews yet — be the first.
            </div>
          ) : (
            <div className="gb-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ padding: 16, background: "#FDF6EC", borderRadius: 12, fontFamily: "var(--gb-font-sans)" }}>
                  <Stars value={r.rating} size={13}/>
                  <p style={{ fontFamily: "var(--gb-font-display)", fontSize: 15, color: "#2C1810", lineHeight: 1.55, margin: "10px 0 12px", fontStyle: "italic" }}>
                    &ldquo;{r.comment}&rdquo;
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2C1810" }}>{r.name}</span>
                    <span style={{ fontSize: 11, color: "rgba(44,24,16,0.5)" }}>{timeAgo(r.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
