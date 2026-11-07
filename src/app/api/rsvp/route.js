import { randomUUID } from 'node:crypto';
import { database, ownedOrder } from '@/lib/server-database';

const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const mapGuest = g => ({ id: g.id, name: g.name, email: g.email || '', status: g.status, side: g.side || 'Both', meal: g.meal || '-', hasPlusOne: !!g.has_plus_one, plusOneName: g.plus_one_name || '', accompaniedStatus: g.accompanied_status || 'alone', message: g.message || '' });

export async function GET(request) {
  try {
    const slug = new URL(request.url).searchParams.get('slug');
    if (!slug) return reply({ success: false, error: 'Wedding is required.' }, 400);
    const access = await ownedOrder(request, slug);
    if (access.error) return reply({ success: false, error: access.error }, access.status);
    const { data, error } = await access.db.from('guests').select('*').eq('slug', slug).order('created_at', { ascending: false });
    if (error) return reply({ success: false, error: 'Unable to load guests.' }, 503);
    return reply({ success: true, guests: (data || []).map(mapGuest) });
  } catch { return reply({ success: false, error: 'Unable to load guests.' }, 503); }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, name } = body;
    if (typeof slug !== 'string' || !/^[a-zA-Z0-9_-]{1,200}$/.test(slug) || typeof name !== 'string' || !name.trim() || name.length > 200) return reply({ success: false, error: 'Invalid wedding or name.' }, 400);
    for (const key of ['email', 'meal', 'plusOneName', 'message', 'side', 'accompaniedStatus']) if (body[key] != null && (typeof body[key] !== 'string' || body[key].length > 2000)) return reply({ success: false, error: 'Invalid response.' }, 400);
    const status = { yes: 'Attending', no: 'Declined', Attending: 'Attending', Declined: 'Declined', Pending: 'Pending' }[body.status || 'Attending'];
    if (!status) return reply({ success: false, error: 'Invalid attendance.' }, 400);
    const db = database();
    const { data: order, error: orderError } = await db.from('orders').select('id,paid,status').eq('slug', slug).maybeSingle();
    if (orderError) return reply({ success: false, error: 'Invitation is unavailable.' }, 503);
    if (!order?.paid) return reply({ success: false, error: 'Invitation not found.' }, 404);
    if (status === 'Pending' || order.status !== 'Live') {
      const access = await ownedOrder(request, slug, db);
      if (access.error) return reply({ success: false, error: 'This invitation is not accepting responses.' }, 403);
    }
    // Names are not identities. An unguessable response ID makes retries safe.
    const id = body.responseId || randomUUID();
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return reply({ success: false, error: 'Invalid response identifier.' }, 400);
    const { data: existing, error: lookupError } = await db.from('guests').select('id,slug').eq('id', id).maybeSingle();
    if (lookupError) return reply({ success: false, error: 'Unable to save your response.' }, 503);
    if (existing && existing.slug !== slug) return reply({ success: false, error: 'Invalid response.' }, 403);
    const hasPlusOne = status === 'Attending' && body.hasPlusOne === true;
    const values = { name: name.trim(), email: body.email?.trim() || null, status, meal: status === 'Attending' ? body.meal || '-' : '-', has_plus_one: hasPlusOne, plus_one_name: hasPlusOne ? body.plusOneName?.trim() || null : null, accompanied_status: hasPlusOne ? body.accompaniedStatus || 'plusOne' : 'alone', message: body.message || null, side: ['Bride', 'Groom', 'Both'].includes(body.side) ? body.side : 'Both' };
    let query;
    if (existing) query = db.from('guests').update(values).eq('id', id).eq('slug', slug);
    else {
      const { data: invitation } = await db.from('invitations').select('id').eq('slug', slug).maybeSingle();
      query = db.from('guests').insert({ ...values, id, slug, ...(invitation?.id ? { invitation_id: invitation.id } : {}) });
    }
    let { data, error } = await query.select('*').single();
    if (error?.code === '23505' && !existing) ({ data, error } = await db.from('guests').select('*').eq('id', id).eq('slug', slug).single());
    if (error || !data) return reply({ success: false, error: 'Your response could not be saved. Please try again.' }, 503);
    return reply({ success: true, guest: mapGuest(data) });
  } catch { return reply({ success: false, error: 'Your response could not be saved. Please try again.' }, 503); }
}

export async function DELETE(request) {
  try {
    const params = new URL(request.url).searchParams;
    const slug = params.get('slug'), id = params.get('id');
    if (!slug || !id) return reply({ success: false, error: 'Wedding and guest are required.' }, 400);
    const access = await ownedOrder(request, slug);
    if (access.error) return reply({ success: false, error: access.error }, access.status);
    const { data, error } = await access.db.from('guests').delete().eq('slug', slug).eq('id', id).select('id').maybeSingle();
    if (error || !data) return reply({ success: false, error: 'Unable to delete this guest.' }, 503);
    return reply({ success: true });
  } catch { return reply({ success: false, error: 'Unable to delete this guest.' }, 503); }
}
