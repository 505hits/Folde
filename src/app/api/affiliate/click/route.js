import { NextResponse } from 'next/server';
import { protectRequest } from '@/lib/request-security';
import { database } from '@/lib/server-database';
import { normalizeCode } from '@/lib/affiliate.mjs';

// Counts one visit from an affiliate link. The browser calls it once per
// visitor and code (the cookie prevents repeats), so this stays a tiny write.
export async function POST(request) {
  const blocked = await protectRequest(request, { limit: 20, maxBytes: 1000 });
  if (blocked) return blocked;
  const { code } = await request.json().catch(() => ({}));
  const ref = normalizeCode(code);
  if (!ref) return NextResponse.json({ ok: false }, { status: 400 });
  const { error } = await database().rpc('increment_affiliate_click', { p_code: ref });
  if (error) return NextResponse.json({ ok: false }, { status: 503 });
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
