import { authenticated, ownedOrder, updateDetails } from '@/lib/server-database';
import { validateSeating } from '@/lib/seating.mjs';

const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(request) {
  try {
    const access = await authenticated(request);
    if (access.error) return reply({ error: access.error }, access.status);
    const { data, error } = await access.db.from('orders').select('*').eq('user_email', access.user.email).order('created_at', { ascending: false });
    if (error) return reply({ error: 'Unable to load your orders.' }, 503);
    return reply({ orders: data || [] });
  } catch { return reply({ error: 'Wedding service is unavailable.' }, 503); }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    if (typeof body.slug !== 'string') return reply({ error: 'Wedding is required.' }, 400);
    const access = await ownedOrder(request, body.slug);
    if (access.error) return reply({ error: access.error }, access.status);
    const { db, order } = access;
    const details = { ...(order.details || {}) };
    if (body.action === 'seating') {
      const current = details._seatingPlan || { version: 0, tables: [] };
      if (body.version !== current.version) return reply({ error: 'This plan changed on another device. Reload it before editing.', conflict: true }, 409);
      const { data: guests, error } = await db.from('guests').select('*').eq('slug', body.slug);
      if (error) return reply({ error: 'Unable to validate your guests.' }, 503);
      let tables;
      try { tables = validateSeating(body.tables, guests || []); }
      catch (error) { return reply({ error: error.message }, 400); }
      details._seatingPlan = { version: current.version + 1, tables, updatedAt: new Date().toISOString() };
    } else if (body.action === 'details') {
      if (!body.details || typeof body.details !== 'object' || Array.isArray(body.details) || JSON.stringify(body.details).length > 500000) return reply({ error: 'Invalid wedding details.' }, 400);
      const patch = { ...body.details };
      delete patch._seatingPlan;
      delete patch.publishedData;
      Object.assign(details, patch);
    } else if (body.action === 'publish') {
      const published = { ...details };
      delete published.publishedData;
      delete published._seatingPlan;
      details.publishedData = published;
    } else return reply({ error: 'Invalid action.' }, 400);
    const saved = await updateDetails(db, order, details);
    if (!saved) return reply({ error: 'Your wedding changed on another device. Please retry.', conflict: true }, 409);
    return reply({ order: saved, seatingPlan: saved.details?._seatingPlan || { version: 0, tables: [] } });
  } catch { return reply({ error: 'Your changes could not be saved. Please try again.' }, 503); }
}
