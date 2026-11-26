import { protectRequest } from '@/lib/request-security';
import { NextResponse } from 'next/server';
import { ownedOrder } from '@/lib/server-database';

// Dashboard satisfaction prompt: the star rating, and the comment when there is one,
// are emailed to the team so low ratings can be followed up personally.
const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export async function POST(request) {
  try {
    const blocked = await protectRequest(request, { limit: 5, maxBytes: 12000 });
    if (blocked) return blocked;
    const { slug, rating, comment = '' } = await request.json();
    if (typeof slug !== 'string' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating.' }, { status: 400 });
    }
    if (typeof comment !== 'string' || comment.length > 3000) {
      return NextResponse.json({ error: 'Invalid comment.' }, { status: 400 });
    }
    const access = await ownedOrder(request, slug);
    if (access.error) return NextResponse.json({ error: access.error }, { status: access.status });
    if (!access.order.paid) return NextResponse.json({ error: 'An active order is required.' }, { status: 403 });

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return NextResponse.json({ error: 'Feedback is unavailable.' }, { status: 503 });
    const userEmail = access.user.email;
    const couple = access.order.couple || slug;
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const text = comment.trim();
    const html = `<div style="font-family:Georgia,serif;max-width:560px;margin:auto;color:#2a211d">
  <h2 style="font-weight:400">${rating < 4 ? 'Feedback to follow up' : 'Happy couple'} · ${stars}</h2>
  <p><strong>Couple:</strong> ${escapeHtml(couple)}<br><strong>Email:</strong> ${escapeHtml(userEmail)}<br><strong>Slug:</strong> ${escapeHtml(slug)}<br><strong>Rating:</strong> ${rating}/5</p>
  ${text ? `<div style="background:#fff8f0;border-left:4px solid #5C3A1E;padding:1rem;white-space:pre-wrap">${escapeHtml(text)}</div>` : '<p style="color:#888">No comment.</p>'}
</div>`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'FOLDÈ Studio <onboarding@resend.dev>',
        to: ['folde.wedding@gmail.com'],
        subject: `[FEEDBACK ${rating}/5] ${couple} (${userEmail})`,
        html,
        reply_to: userEmail,
      }),
    });
    if (!res.ok) {
      console.error('Resend feedback error:', await res.text());
      return NextResponse.json({ error: 'Unable to send feedback.' }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Unable to send feedback.' }, { status: 500 });
  }
}
