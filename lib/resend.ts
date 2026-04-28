import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

export const FROM = process.env.RESEND_FROM ?? "Gingerbros <onboarding@resend.dev>";
export const OWNER = process.env.OWNER_EMAIL ?? "gingerbros.brew@gmail.com";

type EmailItem = { title: string; variant: string; qty: number; price: number };

export type OrderEmailData = {
  orderId: string;
  email: string;
  total: number;
  shipping: number;
  subtotal: number;
  items: EmailItem[];
  trackUrl: string;
  portalUrl?: string;
  isSubscription?: boolean;
  isCOD?: boolean;
};

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const BG = "#FDF6EC";
const INK = "#2C1810";
const GOLD = "#C8893C";
const MUTED = "rgba(44,24,16,0.65)";
const LINE = "rgba(44,24,16,0.10)";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]!));
}

function shell(innerHtml: string, preheader: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"></head>
<body style="margin:0;padding:0;background:${BG};font-family:${SANS};color:${INK};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
      <tr><td style="background:#ffffff;border-radius:16px;padding:32px;">
        ${innerHtml}
      </td></tr>
      <tr><td style="padding:24px 8px 8px;text-align:center;font-size:12px;color:rgba(44,24,16,0.5);font-family:${SANS};">
        Made in Bangkok · orders@gingerbrosshop.com
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function brandMark(): string {
  return `<div style="font-family:${SERIF};font-weight:700;font-size:26px;color:${INK};letter-spacing:-0.01em;">Ginger<span style="color:${GOLD};">bros</span></div>`;
}

function itemRowsHtml(items: EmailItem[]): string {
  return items.map((i, idx) => {
    const last = idx === items.length - 1;
    const border = last ? "" : `border-bottom:1px solid ${LINE};`;
    return `<tr>
      <td style="padding:12px 0;font-size:14px;color:${INK};line-height:1.45;${border}">
        <strong style="font-weight:700;">${escapeHtml(i.title)}</strong>
        <span style="color:${MUTED};"> · ${escapeHtml(i.variant)} × ${i.qty}</span>
      </td>
      <td align="right" style="padding:12px 0 12px 16px;font-size:14px;color:${INK};white-space:nowrap;${border}">
        ฿${i.price * i.qty}
      </td>
    </tr>`;
  }).join("");
}

function totalsRowsHtml(d: OrderEmailData): string {
  const shippingLabel = d.isCOD ? "COD fee" : "Shipping";
  const shippingValue = d.shipping === 0 ? "Free" : `฿${d.shipping}`;
  return `<tr>
      <td style="padding:10px 0;font-size:14px;color:${MUTED};border-top:1px solid ${LINE};">Subtotal</td>
      <td align="right" style="padding:10px 0 10px 16px;font-size:14px;color:${INK};border-top:1px solid ${LINE};white-space:nowrap;">฿${d.subtotal}</td>
    </tr>
    <tr>
      <td style="padding:10px 0;font-size:14px;color:${MUTED};">${shippingLabel}</td>
      <td align="right" style="padding:10px 0 10px 16px;font-size:14px;color:${INK};white-space:nowrap;">${shippingValue}</td>
    </tr>
    <tr>
      <td style="padding:14px 0 4px;font-family:${SERIF};font-size:20px;font-weight:700;color:${GOLD};border-top:1px solid ${LINE};">Total</td>
      <td align="right" style="padding:14px 0 4px 16px;font-family:${SERIF};font-size:20px;font-weight:700;color:${GOLD};border-top:1px solid ${LINE};white-space:nowrap;">฿${d.total}</td>
    </tr>`;
}

function buttonHtml(href: string, label: string): string {
  const safeHref = escapeHtml(href);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
    <tr><td align="center" bgcolor="${GOLD}" style="border-radius:9999px;mso-padding-alt:14px 28px;">
      <a href="${safeHref}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:9999px;letter-spacing:0.01em;">${escapeHtml(label)}</a>
    </td></tr>
  </table>`;
}

function customerHtml(d: OrderEmailData): string {
  const preheader = d.isCOD
    ? `Order #${d.orderId} confirmed. Have ฿${d.total} ready for our driver.`
    : `Order #${d.orderId} confirmed. Packing and shipping in 24–48 hours.`;

  const codNote = d.isCOD
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;background:#FFF4EC;border-radius:12px;">
        <tr><td style="padding:14px 16px;font-size:14px;color:#8B3A1A;line-height:1.5;">
          <strong style="font-weight:700;">Cash on delivery:</strong> please have <strong style="font-weight:700;">฿${d.total}</strong> ready when our driver arrives.
        </td></tr>
      </table>`
    : "";

  const subBlock = d.isSubscription && d.portalUrl
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;background:${BG};border-radius:12px;">
        <tr><td style="padding:18px 18px 20px;">
          <div style="font-family:${SANS};font-size:15px;font-weight:700;color:${INK};margin-bottom:6px;">Manage your subscription</div>
          <p style="margin:0 0 14px;font-size:14px;color:${MUTED};line-height:1.55;">Skip a month, change flavors, or cancel — all self-serve via your customer portal.</p>
          ${buttonHtml(d.portalUrl, "Open customer portal")}
        </td></tr>
      </table>`
    : "";

  const inner = `
    ${brandMark()}
    <h1 style="margin:18px 0 6px;font-family:${SERIF};font-weight:700;font-size:30px;line-height:1.15;color:${INK};letter-spacing:-0.01em;">
      Thank you. <span style="color:${GOLD};font-style:italic;">It's on the way.</span>
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:${MUTED};line-height:1.55;">
      Order <strong style="color:${INK};font-weight:700;">#${escapeHtml(d.orderId)}</strong>${d.isCOD ? " (COD)" : ""}. Packing and shipping take 24&ndash;48 hours.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
      ${itemRowsHtml(d.items)}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 4px;">
      ${totalsRowsHtml(d)}
    </table>

    ${codNote}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 4px;">
      <tr><td align="center">${buttonHtml(d.trackUrl, "Track your order")}</td></tr>
    </table>

    ${subBlock}
  `;

  return shell(inner, preheader);
}

function ownerHtml(d: OrderEmailData): string {
  const preheader = `${d.isCOD ? "COD " : ""}order ${d.orderId} · ฿${d.total} · ${d.email}`;
  const flag = d.isCOD
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;background:#FCE8E0;border-radius:10px;">
        <tr><td style="padding:12px 14px;font-size:14px;color:#8B3A1A;font-weight:700;">⚠ Driver collects ฿${d.total}</td></tr>
      </table>`
    : "";

  const inner = `
    ${brandMark()}
    <h1 style="margin:14px 0 4px;font-family:${SERIF};font-weight:700;font-size:24px;line-height:1.2;color:${INK};">
      New order · #${escapeHtml(d.orderId)}
    </h1>
    <p style="margin:0 0 18px;font-size:14px;color:${MUTED};">
      Buyer: <strong style="color:${INK};font-weight:700;">${escapeHtml(d.email)}</strong>${d.isSubscription ? " · subscription" : ""}
    </p>

    ${flag}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
      ${itemRowsHtml(d.items)}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">
      ${totalsRowsHtml(d)}
    </table>

    <p style="margin:0;font-size:14px;">
      <a href="${escapeHtml(d.trackUrl)}" style="color:${GOLD};font-weight:700;text-decoration:none;">View tracking page →</a>
    </p>
  `;

  return shell(inner, preheader);
}

function customerText(d: OrderEmailData): string {
  const lines: string[] = [];
  lines.push(`Gingerbros — Order #${d.orderId}${d.isCOD ? " (COD)" : ""}`);
  lines.push("");
  lines.push("Thank you. It's on the way.");
  lines.push("Packing and shipping take 24-48 hours.");
  lines.push("");
  lines.push("Items:");
  for (const i of d.items) {
    lines.push(`  - ${i.title} (${i.variant}) x ${i.qty}    THB ${i.price * i.qty}`);
  }
  lines.push("");
  lines.push(`Subtotal:  THB ${d.subtotal}`);
  lines.push(`${d.isCOD ? "COD fee:  " : "Shipping: "} ${d.shipping === 0 ? "Free" : `THB ${d.shipping}`}`);
  lines.push(`Total:     THB ${d.total}`);
  lines.push("");
  if (d.isCOD) {
    lines.push(`Cash on delivery: please have THB ${d.total} ready when our driver arrives.`);
    lines.push("");
  }
  lines.push(`Track your order: ${d.trackUrl}`);
  if (d.isSubscription && d.portalUrl) {
    lines.push("");
    lines.push(`Manage subscription: ${d.portalUrl}`);
  }
  lines.push("");
  lines.push("Made in Bangkok · orders@gingerbrosshop.com");
  return lines.join("\n");
}

function ownerText(d: OrderEmailData): string {
  const lines: string[] = [];
  lines.push(`New order #${d.orderId}${d.isCOD ? " (COD)" : ""}`);
  if (d.isCOD) lines.push(`*** DRIVER COLLECTS THB ${d.total} ***`);
  lines.push(`Buyer: ${d.email}${d.isSubscription ? " (subscription)" : ""}`);
  lines.push("");
  for (const i of d.items) {
    lines.push(`  - ${i.title} (${i.variant}) x ${i.qty}    THB ${i.price * i.qty}`);
  }
  lines.push("");
  lines.push(`Subtotal:  THB ${d.subtotal}`);
  lines.push(`${d.isCOD ? "COD fee:  " : "Shipping: "} ${d.shipping === 0 ? "Free" : `THB ${d.shipping}`}`);
  lines.push(`Total:     THB ${d.total}`);
  lines.push("");
  lines.push(`Tracking: ${d.trackUrl}`);
  return lines.join("\n");
}

export async function sendOrderEmails(data: OrderEmailData) {
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY not set — skipping email send");
    return;
  }
  const subject = data.isSubscription
    ? `Your Gingerbros subscription · #${data.orderId}`
    : `Your Gingerbros order · #${data.orderId}`;
  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject,
    html: customerHtml(data),
    text: customerText(data),
  });
  await resend.emails.send({
    from: FROM,
    to: OWNER,
    replyTo: data.email,
    subject: `[GB] New order #${data.orderId}${data.isCOD ? " (COD)" : ""} — ฿${data.total}`,
    html: ownerHtml(data),
    text: ownerText(data),
  });
}
