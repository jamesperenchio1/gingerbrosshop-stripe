import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

export const FROM = process.env.RESEND_FROM ?? "Gingerbros <onboarding@resend.dev>";
export const OWNER = process.env.OWNER_EMAIL ?? "gingerbros.brew@gmail.com";
export const REPLY_TO = process.env.OWNER_EMAIL ?? "gingerbros.brew@gmail.com";

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
};

const baseStyles = `
  body { margin:0; padding:0; background:#FDF6EC; font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#2C1810; }
  .wrap { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
  .card { background:#fff; border-radius:16px; padding:32px; }
  .brand { font-family: 'Playfair Display', Georgia, serif; font-weight:700; font-size:28px; color:#2C1810; }
  .brand .accent { color:#C8893C; }
  h1 { font-family: 'Playfair Display', Georgia, serif; font-weight:700; font-size:32px; line-height:1.1; margin: 16px 0 12px; letter-spacing:-0.01em; }
  .muted { color: rgba(44,24,16,0.65); font-size:14px; line-height:1.55; }
  .btn { display:inline-block; padding:14px 28px; background:#C8893C; color:#fff !important; border-radius:9999px; font-weight:600; text-decoration:none; font-size:14px; }
  .row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(44,24,16,0.08); font-size:14px; }
  .total { font-family: 'Playfair Display', Georgia, serif; font-size:22px; font-weight:700; color:#C8893C; }
  .footer { color: rgba(44,24,16,0.5); font-size: 12px; text-align:center; margin-top: 24px; }
`;

function customerHtml(d: OrderEmailData): string {
  const itemRows = d.items.map(i => `
    <div class="row">
      <span><strong>${escapeHtml(i.title)}</strong> · ${escapeHtml(i.variant)} × ${i.qty}</span>
      <span>฿${i.price * i.qty}</span>
    </div>
  `).join("");
  const subBlock = d.isSubscription && d.portalUrl
    ? `<div style="margin-top:24px; padding:18px; background:#FDF6EC; border-radius:12px;">
         <div style="font-weight:700; margin-bottom:8px;">Manage your subscription</div>
         <p class="muted" style="margin: 0 0 14px">Skip a month, change flavors, or cancel — all self-serve via your Gingerbros customer portal.</p>
         <a class="btn" href="${d.portalUrl}">Open customer portal</a>
       </div>`
    : "";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyles}</style></head><body>
    <div class="wrap">
      <div class="card">
        <div class="brand">Ginger<span class="accent">bros</span></div>
        <h1>Thank you. <span style="color:#C8893C; font-style:italic;">It's on the way.</span></h1>
        <p class="muted">Order <strong>#${escapeHtml(d.orderId)}</strong>. Bottling, packing, and shipping take 24–48 hours.</p>
        <div style="margin: 24px 0;">${itemRows}
          <div class="row"><span>Subtotal</span><span>฿${d.subtotal}</span></div>
          <div class="row"><span>Shipping</span><span>${d.shipping === 0 ? "Free" : `฿${d.shipping}`}</span></div>
          <div class="row"><span class="total">Total</span><span class="total">฿${d.total}</span></div>
        </div>
        <div style="text-align:center; margin: 24px 0 8px;">
          <a class="btn" href="${d.trackUrl}">Track your order</a>
        </div>
        ${subBlock}
      </div>
      <div class="footer">Made in Bangkok · ginger@gingerbrosshop.com</div>
    </div>
  </body></html>`;
}

function ownerHtml(d: OrderEmailData): string {
  const itemRows = d.items.map(i => `<div class="row"><span>${escapeHtml(i.title)} · ${escapeHtml(i.variant)} × ${i.qty}</span><span>฿${i.price * i.qty}</span></div>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyles}</style></head><body>
    <div class="wrap">
      <div class="card">
        <div class="brand">Ginger<span class="accent">bros</span></div>
        <h1>New order · #${escapeHtml(d.orderId)}</h1>
        <p class="muted">Buyer: ${escapeHtml(d.email)}${d.isSubscription ? " · subscription" : ""}</p>
        <div style="margin: 16px 0;">${itemRows}
          <div class="row"><span class="total">Total</span><span class="total">฿${d.total}</span></div>
        </div>
        <p class="muted"><a href="${d.trackUrl}">View tracking page</a></p>
      </div>
    </div>
  </body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]!));
}

export async function sendPortalMagicLink({ email, url }: { email: string; url: string }) {
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY not set — skipping portal magic-link send");
    return;
  }
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyles}</style></head><body>
    <div class="wrap"><div class="card">
      <div class="brand">Ginger<span class="accent">bros</span></div>
      <h1>Manage your <span style="color:#C8893C; font-style:italic;">subscription.</span></h1>
      <p class="muted">Click below to open your customer portal. You can change card, update address, swap flavors, change quantity, pause, or cancel — all in one place. The link works once and expires in 15 minutes.</p>
      <div style="text-align:center; margin: 28px 0;">
        <a class="btn" href="${url}">Open customer portal</a>
      </div>
      <p class="muted" style="font-size:12px">If you didn&rsquo;t request this, you can safely ignore this email — the link won&rsquo;t do anything without you clicking it.</p>
    </div>
    <div class="footer">Made in Bangkok · ginger@gingerbrosshop.com</div></div>
  </body></html>`;
  await resend.emails.send({
    from: FROM,
    to: email,
    replyTo: REPLY_TO,
    subject: "Your Gingerbros customer portal link",
    html,
  });
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
    replyTo: REPLY_TO,
    subject,
    html: customerHtml(data),
  });
  await resend.emails.send({
    from: FROM,
    to: OWNER,
    replyTo: data.email,
    subject: `[GB] New order #${data.orderId} — ฿${data.total}`,
    html: ownerHtml(data),
  });
}
