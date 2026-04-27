"use client";
import { type ReactNode } from "react";

export type IconDef = string | ReactNode;

export function Icon({ d, size = 20, stroke = 1.8, fill = "none" }: { d: IconDef; size?: number; stroke?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {typeof d === "string" ? <path d={d} /> : d}
    </svg>
  );
}

export const ICONS: Record<string, IconDef> = {
  menu: "M3 6h18M3 12h18M3 18h18",
  search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
  bag:  <><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 1 1 6 0"/></>,
  close: "M6 6l12 12M18 6L6 18",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 6l-6 6 6 6",
  check: "M5 12l5 5L20 7",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  chevDown: "M6 9l6 6 6-6",
  chevRight: "M9 6l6 6-6 6",
  star: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z",
  truck: <><rect x="1" y="6" width="14" height="11" rx="1"/><path d="M15 10h4l3 3v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
  leaf: <><path d="M11 20A7 7 0 0 1 4 13c0-6 5-10 16-10 0 8-4 17-9 17Z"/><path d="M4 20c4-6 7-8 12-10"/></>,
  flame: <><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-3 0 2 1 3 2 3 0-3-1-5 1-8Z"/><path d="M6 16a6 6 0 0 0 12 0c0-3-2-5-3-6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
  heart: "M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6C19 16.5 12 21 12 21Z",
  gift: <><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 13h18M7.5 8a2.5 2.5 0 1 1 0-5C9 3 12 5 12 8c0-3 3-5 4.5-5a2.5 2.5 0 1 1 0 5"/></>,
  sparkle: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z",
  ig: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></>,
  tiktok: <><path d="M15 4v10a4 4 0 1 1-4-4"/><path d="M15 4c0 2.5 2 4.5 4.5 4.5"/></>,
  fb: "M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v5h4v-5h3l1-4h-4V8.5A.5.5 0 0 1 14.5 8H14Z",
  line: <><rect x="3" y="4" width="18" height="14" rx="4"/><path d="M8 18l-1 3 4-3"/><path d="M7 9v4M10 9v4M10 9h1.5a1 1 0 0 1 1 1v3M15 9v4M17 9h-2v4h2"/></>,
  pin: <><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></>,
  repeat: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/></>,
  box: <><path d="M21 8l-9 4-9-4 9-4 9 4Z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/></>,
};

export function Logo({ color = "dark", size = 24, accent = "#C8893C" }: { color?: "dark" | "light"; size?: number; accent?: string }) {
  const darkC = color === "dark" ? "#2C1810" : "#fff";
  return (
    <span style={{ fontFamily: "var(--gb-font-display)", fontWeight: 700, fontSize: size, color: darkC, letterSpacing: "-0.01em", lineHeight: 1, whiteSpace: "nowrap" }}>
      Ginger<span style={{ color: accent }}>bros</span>
    </span>
  );
}

/**
 * BottleImage: prefers a real product photo when one is provided,
 * falls back to the CSS-drawn Bottle svg.
 */
export function BottleImage({ flavor = "beer", size = 160, src }: { flavor?: "beer" | "shot" | "ale"; size?: number; src?: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={`${flavor} bottle`} style={{ width: "auto", height: size, maxWidth: "100%", display: "block", objectFit: "contain" }}/>
    );
  }
  return <Bottle flavor={flavor} size={size}/>;
}

/** Mix-bundle icon — three little bottles fanned out, used for custom 6-packs. */
export function MixBottles({ flavors, size = 80 }: { flavors?: ("beer" | "shot" | "ale")[]; size?: number }) {
  const fallback: ("beer" | "shot" | "ale")[] = ["beer", "ale", "shot"];
  const display: ("beer" | "shot" | "ale")[] = (flavors && flavors.length > 0 ? flavors : fallback).slice(0, 3);
  const w = size * 1.6;
  return (
    <div style={{ position: "relative", width: w, height: size, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      {display.map((f, i) => {
        const offset = (i - (display.length - 1) / 2) * (size * 0.32);
        const rot = (i - (display.length - 1) / 2) * 6;
        return (
          <div key={i} style={{ position: "absolute", transform: `translateX(${offset}px) rotate(${rot}deg)`, zIndex: i === Math.floor(display.length / 2) ? 2 : 1 }}>
            <Bottle flavor={f} size={size}/>
          </div>
        );
      })}
    </div>
  );
}

export function Bottle({ flavor = "beer", size = 160 }: { flavor?: "beer" | "shot" | "ale"; size?: number }) {
  const palettes: Record<string, { body: string; cap: string; label: string; accent: string; name: string }> = {
    shot:  { body: "#8B3A1A", cap: "#2C1810", label: "#FDF6EC", accent: "#C8893C", name: "SHOT" },
    beer:  { body: "#C8893C", cap: "#2C1810", label: "#FDF6EC", accent: "#8B3A1A", name: "BEER" },
    ale:   { body: "#E8B86A", cap: "#2C1810", label: "#FDF6EC", accent: "#4A7C3F", name: "ALE" },
  };
  const p = palettes[flavor] || palettes.beer;
  const w = size * 0.42, h = size;
  const id = `g-${flavor}-${size}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor={p.body} stopOpacity="0.85"/>
          <stop offset="0.5" stopColor={p.body}/>
          <stop offset="1" stopColor={p.body} stopOpacity="0.75"/>
        </linearGradient>
      </defs>
      <rect x={w*0.32} y={0} width={w*0.36} height={h*0.08} fill={p.cap} rx="2"/>
      <rect x={w*0.38} y={h*0.08} width={w*0.24} height={h*0.10} fill={`url(#${id})`}/>
      <path d={`M ${w*0.1} ${h*0.22} Q ${w*0.08} ${h*0.30} ${w*0.08} ${h*0.40} L ${w*0.08} ${h*0.95} Q ${w*0.08} ${h} ${w*0.18} ${h} L ${w*0.82} ${h} Q ${w*0.92} ${h} ${w*0.92} ${h*0.95} L ${w*0.92} ${h*0.40} Q ${w*0.92} ${h*0.30} ${w*0.90} ${h*0.22} Z`} fill={`url(#${id})`}/>
      <rect x={w*0.14} y={h*0.42} width={w*0.72} height={h*0.38} fill={p.label} rx="2"/>
      <text x={w/2} y={h*0.56} textAnchor="middle" fontFamily="var(--gb-font-display)" fontWeight="700" fontSize={w*0.16} fill="#2C1810">GB</text>
      <line x1={w*0.22} y1={h*0.63} x2={w*0.78} y2={h*0.63} stroke={p.accent} strokeWidth="1"/>
      <text x={w/2} y={h*0.73} textAnchor="middle" fontFamily="var(--gb-font-sans)" fontWeight="700" fontSize={w*0.08} fill="#2C1810" letterSpacing="1.5">
        {p.name}
      </text>
      <path d={`M ${w*0.14} ${h*0.24} L ${w*0.18} ${h*0.22} L ${w*0.18} ${h*0.95} L ${w*0.14} ${h*0.95} Z`} fill="rgba(255,255,255,0.25)"/>
    </svg>
  );
}

export function Wave({ fill = "#FFFFFF", flip = false, height = 80 }: { fill?: string; flip?: boolean; height?: number }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none"
      style={{ display: "block", width: "100%", height, transform: flip ? "scaleY(-1)" : "none", marginTop: -1, marginBottom: -1 }}>
      <path d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z" fill={fill}/>
    </svg>
  );
}

export function Stars({ value = 5, size = 14 }: { value?: number; size?: number }) {
  return (
    <div style={{ display: "inline-flex", gap: 2, color: "#C8893C" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= value ? "#C8893C" : "#F5E6D3"} stroke="#C8893C" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z"/>
        </svg>
      ))}
    </div>
  );
}
