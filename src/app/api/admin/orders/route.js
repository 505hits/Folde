import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getAdminClient = async (request) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const allowedEmails = String(process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
  if (!url || !anonKey || !serviceKey || !allowedEmails.length) return { error: 'Admin access is not configured.', status: 503 };
  if (!token) return { error: 'Please sign in to access the studio.', status: 401 };
  const auth = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data: { user }, error } = await auth.auth.getUser(token);
  if (error || !user || !allowedEmails.includes(String(user.email || '').toLowerCase())) return { error: 'You are not authorized to access the studio.', status: 403 };
  return { supabase: createClient(url, serviceKey, { auth: { persistSession: false } }) };
};

export async function GET(request) {
  const access = await getAdminClient(request);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.status });
  const { data, error } = await access.supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: 'We could not load the orders.' }, { status: 502 });
  return NextResponse.json({ orders: data || [] });
}

export async function PATCH(request) {
  const access = await getAdminClient(request);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.status });
  const { orderId, action, status } = await request.json();
  if (!orderId) return NextResponse.json({ error: 'An order is required.' }, { status: 400 });
  if (action === 'publish') {
    const { data: order, error: findError } = await access.supabase.from('orders').select('details').eq('id', orderId).single();
    if (findError || !order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    const draft = { ...(order.details || {}) }; delete draft.publishedData;
    const { data, error } = await access.supabase.from('orders').update({ status: 'Live', details: { ...draft, publishedData: draft } }).eq('id', orderId).select().single();
    if (error) return NextResponse.json({ error: 'The invitation could not be published.' }, { status: 502 });
    return NextResponse.json({ order: data });
  }
  const allowedStatuses = ['In Creation', 'Awaiting Validation', 'Changes Requested'];
  if (!allowedStatuses.includes(status)) return NextResponse.json({ error: 'Invalid production status.' }, { status: 400 });
  const { data, error } = await access.supabase.from('orders').update({ status }).eq('id', orderId).select().single();
  if (error) return NextResponse.json({ error: 'The status could not be updated.' }, { status: 502 });
  return NextResponse.json({ order: data });
}
