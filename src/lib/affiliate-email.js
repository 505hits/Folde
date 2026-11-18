import { formatMoney, COMMISSION_RATE } from '@/lib/affiliate.mjs';

const SITE = 'https://folde-wedding.com';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const fromAddress = () => {
  const configured = String(process.env.RESEND_FROM_EMAIL || '').trim();
  const address = configured.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  return address ? `FOLDÈ Wedding <${address}>` : 'FOLDÈ Wedding <onboarding@resend.dev>';
};

const dashboardUrl = (locale) => `${SITE}${['fr', 'es'].includes(locale) ? `/${locale}` : ''}/affiliate-dashboard`;

// Same card layout as the preview email, so every FOLDÈ email feels like one brand.
export function emailLayout({ eyebrow, title, text, rows = [], button, href, footer }) {
  const table = rows.length
    ? `<table role="presentation" style="width:100%;max-width:420px;margin:0 auto 28px;border-collapse:collapse">${rows.map(([label, value]) => `<tr><td style="padding:10px 0;border-bottom:1px solid #eee3d6;color:#75665b;font-size:14px;text-align:left">${escapeHtml(label)}</td><td style="padding:10px 0;border-bottom:1px solid #eee3d6;color:#3d2b1f;font-size:15px;font-weight:700;text-align:right">${escapeHtml(value)}</td></tr>`).join('')}</table>`
    : '';
  return `<!doctype html><html><body style="margin:0;background:#f6f0e8;color:#3d2b1f;font-family:Arial,sans-serif"><div style="padding:32px 16px"><div style="max-width:560px;margin:auto;padding:42px 30px;border:1px solid #e2d5c6;border-radius:24px;background:#fffdf9;text-align:center"><div style="font-family:Georgia,serif;font-size:24px;letter-spacing:5px">FOLDÈ</div><p style="margin:28px 0 8px;color:#a1744d;font-size:12px;letter-spacing:2px;text-transform:uppercase">${escapeHtml(eyebrow)}</p><h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:32px;font-weight:400">${escapeHtml(title)}</h1><p style="margin:0 auto 28px;max-width:430px;color:#75665b;line-height:1.6">${escapeHtml(text)}</p>${table}<a href="${href}" style="display:inline-block;padding:16px 26px;border-radius:999px;background:#4b2f20;color:#fff;text-decoration:none;font-weight:700">${escapeHtml(button)} →</a><p style="margin:28px 0 0;color:#9b8d81;font-size:12px">${escapeHtml(footer)}</p></div></div></body></html>`;
}

async function send(to, subject, html) {
  if (!process.env.RESEND_API_KEY || !to) return false;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromAddress(), to: [to], subject, html }),
    });
    if (!response.ok) console.error('Affiliate email refused:', response.status);
    return response.ok;
  } catch {
    console.error('Affiliate email failed');
    return false;
  }
}

// Sent once per sale. Contains amounts only: never the buyer's name or email.
export function saleEmail({ locale = 'en', code, amountCents, commissionCents, totalCommissionCents, salesCount, currency = 'usd' }) {
  const money = (cents) => formatMoney(cents, locale, currency);
  const copy = {
    fr: { subject: `Nouvelle vente : +${money(commissionCents)} de commission`, eyebrow: `Lien ${code}`, title: 'Une vente grâce à vous !', text: `Un couple vient de commander FOLDÈ via votre lien. Votre commission de ${Math.round(COMMISSION_RATE * 100)} % est enregistrée et sera payable après 30 jours.`, sale: 'Montant de la vente', commission: 'Votre commission', total: 'Total de vos commissions', count: 'Ventes générées', button: 'VOIR MON TABLEAU DE BORD', footer: 'Programme d\'affiliation FOLDÈ Wedding' },
    es: { subject: `Nueva venta: +${money(commissionCents)} de comisión`, eyebrow: `Enlace ${code}`, title: '¡Una venta gracias a ti!', text: `Una pareja acaba de comprar FOLDÈ con tu enlace. Tu comisión del ${Math.round(COMMISSION_RATE * 100)} % está registrada y se podrá pagar a los 30 días.`, sale: 'Importe de la venta', commission: 'Tu comisión', total: 'Total de comisiones', count: 'Ventas generadas', button: 'VER MI PANEL', footer: 'Programa de afiliados de FOLDÈ Wedding' },
    en: { subject: `New sale: +${money(commissionCents)} commission`, eyebrow: `Link ${code}`, title: 'You just made a sale!', text: `A couple just ordered FOLDÈ through your link. Your ${Math.round(COMMISSION_RATE * 100)}% commission is recorded and becomes payable after 30 days.`, sale: 'Sale amount', commission: 'Your commission', total: 'Total commissions', count: 'Sales generated', button: 'OPEN MY DASHBOARD', footer: 'FOLDÈ Wedding affiliate program' },
  }[['fr', 'es'].includes(locale) ? locale : 'en'];
  return {
    subject: copy.subject,
    html: emailLayout({
      eyebrow: copy.eyebrow, title: copy.title, text: copy.text, button: copy.button, href: dashboardUrl(locale), footer: copy.footer,
      rows: [[copy.sale, money(amountCents)], [copy.commission, money(commissionCents)], [copy.total, money(totalCommissionCents)], [copy.count, String(salesCount)]],
    }),
  };
}

export function welcomeEmail({ locale = 'en', code }) {
  const link = `${SITE}/?ref=${code}`;
  const copy = {
    fr: { subject: 'Bienvenue dans le programme d\'affiliation FOLDÈ', eyebrow: 'Programme d\'affiliation', title: 'Votre lien est prêt', text: `Partagez ${link} : vous touchez 30 % de chaque commande passée dans les 60 jours. Vous recevrez un email à chaque vente.`, button: 'OUVRIR MON TABLEAU DE BORD', footer: 'FOLDÈ Wedding' },
    es: { subject: 'Bienvenida al programa de afiliados de FOLDÈ', eyebrow: 'Programa de afiliados', title: 'Tu enlace está listo', text: `Comparte ${link}: ganas el 30 % de cada pedido realizado en los 60 días siguientes. Recibirás un email con cada venta.`, button: 'ABRIR MI PANEL', footer: 'FOLDÈ Wedding' },
    en: { subject: 'Welcome to the FOLDÈ affiliate program', eyebrow: 'Affiliate program', title: 'Your link is ready', text: `Share ${link}: you earn 30% of every order placed within 60 days. You will get an email for every sale.`, button: 'OPEN MY DASHBOARD', footer: 'FOLDÈ Wedding' },
  }[['fr', 'es'].includes(locale) ? locale : 'en'];
  return { subject: copy.subject, html: emailLayout({ ...copy, href: dashboardUrl(locale) }) };
}

// The FOLDÈ team's copy of each sale, to follow what will be owed at month end.
export const TEAM_EMAIL = 'folde.wedding@gmail.com';

export function teamSaleEmail({ name, code, affiliateEmail, amountCents, commissionCents, totalCommissionCents, salesCount, plan, currency = 'usd' }) {
  const money = (cents) => formatMoney(cents, 'en', currency);
  return {
    subject: `Affiliate sale: ${code} earned ${money(commissionCents)}`,
    html: emailLayout({
      eyebrow: 'Affiliate program',
      title: 'New affiliate sale',
      text: `${name} (${affiliateEmail}) brought a ${/custom|expert/i.test(plan || '') ? 'Expert' : 'Standard'} order. The commission becomes payable after the 30-day refund window.`,
      rows: [['Affiliate code', code], ['Sale amount', money(amountCents)], ['Commission (30%)', money(commissionCents)], ['Affiliate total earned', money(totalCommissionCents)], ['Affiliate sales', String(salesCount)]],
      button: 'OPEN AFFILIATE PAYOUTS',
      href: `${SITE}/admin/affiliates`,
      footer: 'FOLDÈ Wedding · internal notification',
    }),
  };
}

export async function sendTeamSaleEmail(details) {
  const { subject, html } = teamSaleEmail(details);
  return send(process.env.AFFILIATE_TEAM_EMAIL || TEAM_EMAIL, subject, html);
}

export async function sendAffiliateSaleEmail(to, details) {
  const { subject, html } = saleEmail(details);
  return send(to, subject, html);
}

export async function sendAffiliateWelcomeEmail(to, details) {
  const { subject, html } = welcomeEmail(details);
  return send(to, subject, html);
}
