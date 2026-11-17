import { protectRequest } from '@/lib/request-security';
import { NextResponse } from 'next/server';

import { ownedOrder } from '@/lib/server-database';

const escapeHtml = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

export async function POST(request) {
  try {
    const data = await request.json();
    const { slug, revisionNumber, comment } = data;
    if (typeof slug !== 'string' || ![1, 2].includes(revisionNumber)) return NextResponse.json({error:'Invalid revision.'},{status:400});
    const access = await ownedOrder(request, slug);
    if (access.error) return NextResponse.json({error:access.error},{status:access.status});
    if (!access.order.paid) return NextResponse.json({error:'An active order is required.'},{status:403});
    const blocked = await protectRequest(request, { limit: 5, maxBytes: 20000 });
    if (blocked) return blocked;
    const userEmail = access.user.email;
    const coupleName = access.order.couple;

    if (typeof comment !== 'string' || !comment.trim() || comment.length > 5000) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const siteLink = `https://folde-wedding.com/invite/${encodeURIComponent(slug)}`;
    const subject = `[REVISION REQUEST ${revisionNumber}/2] — ${coupleName} (${userEmail})`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Georgia', serif; color: #1a1a1a; background: #faf8f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #e8e5e0; }
    .header { background: linear-gradient(135deg, #5C3A1E, #8b5a62); padding: 2.5rem; text-align: center; color: #fff; }
    .header h1 { margin: 0; font-size: 1.6rem; font-weight: 400; letter-spacing: 1px; }
    .header p { margin: 0.5rem 0 0; opacity: 0.85; font-size: 0.95rem; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 0.4rem 1.2rem; border-radius: 20px; font-size: 0.85rem; letter-spacing: 1px; margin-top: 1rem; font-weight: 600; }
    .content { padding: 2.5rem; }
    .info-box { background: #faf8f5; border-radius: 12px; padding: 1.2rem 1.5rem; margin-bottom: 1.5rem; border: 1px solid #f0ede9; }
    .info-row { display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.95rem; }
    .info-label { color: #888; }
    .info-value { font-weight: 600; color: #1a1a1a; }
    .comment-title { font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; color: #5C3A1E; margin-bottom: 0.75rem; font-weight: 600; }
    .comment-box { background: #fff8f0; border-left: 4px solid #5C3A1E; padding: 1.2rem; border-radius: 0 12px 12px 0; font-size: 1rem; color: #333; line-height: 1.6; white-space: pre-wrap; }
    .link-btn { display: inline-block; background: #5C3A1E; color: #fff; text-decoration: none; padding: 0.8rem 1.8rem; border-radius: 10px; font-weight: 600; margin-top: 1.5rem; font-size: 0.95rem; }
    .footer { text-align: center; padding: 1.5rem; color: #888; font-size: 0.8rem; border-top: 1px solid #f0ede9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✂️ Revision Request Received</h1>
      <p>FOLDÈ Studio — Revision ${revisionNumber} of 2</p>
      <div class="badge">REVISION #${revisionNumber}</div>
    </div>
    <div class="content">
      <div class="info-box">
        <div class="info-row"><span class="info-label">Couple:</span><span class="info-value">${escapeHtml(coupleName)}</span></div>
        <div class="info-row"><span class="info-label">Client Email:</span><span class="info-value">${escapeHtml(userEmail)}</span></div>
        <div class="info-row"><span class="info-label">Slug:</span><span class="info-value">${escapeHtml(slug)}</span></div>
        <div class="info-row"><span class="info-label">Revision #:</span><span class="info-value">${revisionNumber} / 2</span></div>
      </div>

      <div class="comment-title">📝 Requested Changes / Comments</div>
      <div class="comment-box">${escapeHtml(comment.trim())}</div>

      <div style="text-align: center;">
        <a href="${siteLink}" class="link-btn" target="_blank">View Client Website →</a>
      </div>
    </div>
    <div class="footer">
      FOLDÈ Design Studio · ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </div>
  </div>
</body>
</html>
    `.trim();

    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'FOLDÈ Studio <onboarding@resend.dev>',
          to: ['folde.wedding@gmail.com'],
          subject: subject,
          html: emailHtml,
          reply_to: userEmail,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Resend revision error:', errorText);
      } else {
        return NextResponse.json({ success: true, method: 'resend' });
      }
    }

    return NextResponse.json({ error: 'Unable to send the revision request.' }, { status: 503 });

  } catch (error) {
    console.error('Error processing revision request:', error);
    return NextResponse.json({ error: 'Failed to send revision request' }, { status: 500 });
  }
}
