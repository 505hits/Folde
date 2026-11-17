import { protectRequest } from '@/lib/request-security';
import { matchesImageType } from '@/lib/image-file.mjs';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const dynamic = 'force-dynamic';

const BUCKET = 'guest-photos';
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/heic', 'heic'],
  ['image/heif', 'heif'],
]);

const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

function response(body, status = 200) {
  return NextResponse.json(body, { status, headers: privateHeaders });
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

function cleanSlug(value) {
  const slug = String(value || '').trim();
  return /^[a-z0-9-]{1,200}$/i.test(slug) ? slug : '';
}

async function findWedding(supabase, slug) {
  const { data, error } = await supabase
    .from('orders')
    .select('id,slug,couple,status,details,paid')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data?.paid && data.status !== 'Cancelled' ? data : null;
}

export async function GET(request) {
  try {
    const supabase = getAdminClient();
    if (!supabase) return response({ error: 'Photo sharing is not configured yet.' }, 503);

    const slug = cleanSlug(new URL(request.url).searchParams.get('slug'));
    if (!slug) return response({ error: 'Invalid wedding gallery.' }, 400);

    const wedding = await findWedding(supabase, slug);
    if (!wedding) return response({ error: 'This wedding gallery was not found.' }, 404);

    const offset = Math.floor(Math.max(0, Math.min(100000, Number(new URL(request.url).searchParams.get('offset')) || 0)));
    const pageSize = 60;

    const { data: rows, error } = await supabase
      .from('guest_photos')
      .select('id,storage_path,guest_name,caption,created_at')
      .eq('order_id', wedding.id)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(offset, offset + pageSize);
    if (error) throw error;

    const page = (rows || []).slice(0, pageSize);
    const paths = page.map((photo) => photo.storage_path);
    let signed = [];
    if (paths.length) {
      const { data, error: signingError } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60);
      if (signingError) throw signingError;
      signed = data || [];
    }

    const urls = new Map(signed.map((item) => [item.path, item.signedUrl]));
    const photos = page.map((photo) => {
      const signedUrl = urls.get(photo.storage_path);
      if (!signedUrl) throw new Error('A saved photo preview is temporarily unavailable');
      return {
        id: photo.id,
        url: signedUrl,
        guestName: photo.guest_name || '',
        caption: photo.caption || '',
        createdAt: photo.created_at,
      };
    });

    const published = wedding.details?.publishedData || wedding.details || {};
    return response({ success: true, wedding: { slug: wedding.slug, couple: wedding.couple, language: published.language || 'en' }, photos, nextOffset: rows.length > pageSize ? offset + pageSize : null });
  } catch (error) {
    console.error('Guest gallery load error:', error?.message || 'Database or storage request failed');
    return response({ error: 'We could not load this private gallery.' }, 500);
  }
}

// Photos go straight from the guest's phone to Supabase Storage with a
// short-lived signed upload URL, so their bytes never pass through a Vercel
// Function (Fast Origin Transfer). This route only issues the upload ticket,
// then checks the stored file and records it.
const TICKET_TTL = 30 * 60 * 1000;

function ticketSignature(payload) {
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY || '').update('guest-upload:' + payload).digest();
}

function signTicket(data) {
  const payload = Buffer.from(JSON.stringify({ ...data, expires: Date.now() + TICKET_TTL })).toString('base64url');
  return payload + '.' + ticketSignature(payload).toString('base64url');
}

function readTicket(value) {
  if (typeof value !== 'string' || value.length > 4096 || !/^[\w-]+\.[\w-]+$/.test(value)) return null;
  try {
    const [payload, signature] = value.split('.');
    const supplied = Buffer.from(signature, 'base64url');
    const expected = ticketSignature(payload);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.expires > Date.now() ? data : null;
  } catch {
    return null;
  }
}

async function readStoredStart(supabase, path) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60);
  if (error || !data?.signedUrl) return null;
  const result = await fetch(data.signedUrl, { headers: { Range: 'bytes=0-31' }, cache: 'no-store' });
  if (!result.ok) return null;
  return Buffer.from(await result.arrayBuffer()).subarray(0, 32);
}

async function prepareUpload(supabase, body) {
  const slug = cleanSlug(body.slug);
  const type = String(body.type || '');
  const size = Number(body.size);
  const guestName = String(body.guestName || '').trim().slice(0, 80);
  const caption = String(body.caption || '').trim().slice(0, 240);
  const originalName = String(body.name || '').slice(0, 180);
  if (!slug) return response({ error: 'Invalid wedding gallery.' }, 400);
  if (!ALLOWED_TYPES.has(type)) return response({ error: 'Please choose a JPG, PNG, WebP, HEIC or HEIF image.' }, 400);
  if (!Number.isInteger(size) || size <= 0 || size > MAX_FILE_SIZE) return response({ error: 'Please choose an image smaller than 8 MB.' }, 400);

  const wedding = await findWedding(supabase, slug);
  if (!wedding) return response({ error: 'This wedding gallery was not found.' }, 404);

  const extension = ALLOWED_TYPES.get(type);
  const path = `${slug}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data?.token) throw error || new Error('Upload URL was not created');
  return response({
    success: true,
    upload: { bucket: BUCKET, path, token: data.token },
    ticket: signTicket({ path, slug, orderId: wedding.id, type, size, guestName, caption, originalName: originalName || `guest-photo.${extension}` }),
  });
}

async function confirmUpload(supabase, body) {
  const ticket = readTicket(body.ticket);
  if (!ticket) return response({ error: 'This upload expired. Please choose the photo again.' }, 400);
  const discard = () => supabase.storage.from(BUCKET).remove([ticket.path]).catch(() => {});

  const { data: existing } = await supabase.from('guest_photos').select('id,created_at').eq('storage_path', ticket.path).maybeSingle();
  let photo = existing;
  if (!photo) {
    const { data: info, error: infoError } = await supabase.storage.from(BUCKET).info(ticket.path);
    if (infoError || !info) return response({ error: 'We could not find this photo. Please try again.' }, 400);
    const storedSize = Number(info.size ?? info.metadata?.size);
    const start = await readStoredStart(supabase, ticket.path);
    if (!storedSize || storedSize > MAX_FILE_SIZE || !start || !matchesImageType(start, ticket.type)) {
      await discard();
      return response({ error: 'The file content must match its image format.' }, 400);
    }
    const { data: inserted, error: insertError } = await supabase
      .from('guest_photos')
      .insert({
        order_id: ticket.orderId,
        storage_path: ticket.path,
        original_name: ticket.originalName,
        content_type: ticket.type,
        file_size: storedSize,
        guest_name: ticket.guestName || null,
        caption: ticket.caption || null,
      })
      .select('id,created_at')
      .single();
    if (insertError || !inserted) {
      await discard();
      throw insertError || new Error('Photo record was not saved');
    }
    photo = inserted;
  }

  let signedUrl = null;
  try {
    const result = await supabase.storage.from(BUCKET).createSignedUrl(ticket.path, 60 * 60);
    if (result.error) throw result.error;
    signedUrl = result.data?.signedUrl || null;
  } catch {
    console.warn('Photo is saved; its preview will be available after refresh.');
  }
  return response({
    success: true,
    photo: { id: photo.id, url: signedUrl, guestName: ticket.guestName, caption: ticket.caption, createdAt: photo.created_at },
    galleryUrl: `/guest-gallery/${encodeURIComponent(ticket.slug)}`,
  });
}

export async function POST(request) {
  const isJson = (request.headers.get('content-type') || '').includes('application/json');
  const blocked = await protectRequest(request, isJson ? { limit: 120, maxBytes: 16384 } : { limit: 80, maxBytes: 9437184 });
  if (blocked) return blocked;
  // Older open pages may still send the file itself; keep accepting them.
  if (!isJson) return legacyUpload(request);
  try {
    const supabase = getAdminClient();
    if (!supabase) return response({ error: 'Photo sharing is not configured yet.' }, 503);
    const body = await request.json().catch(() => ({}));
    if (body.step === 'prepare') return await prepareUpload(supabase, body);
    if (body.step === 'confirm') return await confirmUpload(supabase, body);
    return response({ error: 'Unknown upload step.' }, 400);
  } catch (error) {
    console.error('Guest upload error:', error?.message || 'Database or storage request failed');
    return response({ error: 'We could not save this photo. Please try again.' }, 500);
  }
}


async function legacyUpload(request) {
  let uploadedPath = '';
  let supabase = null;
  let persisted = false;
  try {
    supabase = getAdminClient();
    if (!supabase) return response({ error: 'Photo sharing is not configured yet.' }, 503);

    const formData = await request.formData();
    const slug = cleanSlug(formData.get('slug'));
    const file = formData.get('file');
    const guestName = String(formData.get('guestName') || '').trim().slice(0, 80);
    const caption = String(formData.get('caption') || '').trim().slice(0, 240);

    if (!slug) return response({ error: 'Invalid wedding gallery.' }, 400);
    if (!(file instanceof File) || !ALLOWED_TYPES.has(file.type)) {
      return response({ error: 'Please choose a JPG, PNG, WebP, HEIC or HEIF image.' }, 400);
    }
    if (!file.size || file.size > MAX_FILE_SIZE) {
      return response({ error: 'Please choose an image smaller than 8 MB.' }, 400);
    }

    const wedding = await findWedding(supabase, slug);
    if (!wedding) return response({ error: 'This wedding gallery was not found.' }, 404);

    const extension = ALLOWED_TYPES.get(file.type);
    uploadedPath = `${slug}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!matchesImageType(bytes, file.type)) return response({ error: 'The file content must match its image format.' }, 400);
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(uploadedPath, bytes, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (uploadError) throw uploadError;

    const { data: photo, error: insertError } = await supabase
      .from('guest_photos')
      .insert({
        order_id: wedding.id,
        storage_path: uploadedPath,
        original_name: String(file.name || `guest-photo.${extension}`).slice(0, 180),
        content_type: file.type,
        file_size: file.size,
        guest_name: guestName || null,
        caption: caption || null,
      })
      .select('id,created_at')
      .single();
    if (insertError || !photo) throw insertError || new Error('Photo record was not saved');
    persisted = true;

    let signed = null;
    try {
      const result = await supabase.storage.from(BUCKET).createSignedUrl(uploadedPath, 60 * 60);
      if (result.error) throw result.error;
      signed = result.data;
    } catch {
      console.warn('Photo is saved; its preview will be available after refresh.');
    }

    return response({
      success: true,
      photo: {
        id: photo.id,
        url: signed?.signedUrl || null,
        guestName,
        caption,
        createdAt: photo.created_at,
      },
      galleryUrl: `/guest-gallery/${encodeURIComponent(slug)}`,
    });
  } catch (error) {
    if (uploadedPath && supabase && !persisted) {
      await supabase.storage.from(BUCKET).remove([uploadedPath]).catch(() => {});
    }
    console.error('Guest upload error:', error?.message || 'Database or storage request failed');
    return response({ error: 'We could not save this photo. Please try again.' }, 500);
  }
}
