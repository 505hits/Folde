import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
  return /^[a-z0-9-]{3,120}$/i.test(slug) ? slug : '';
}

async function findWedding(supabase, slug) {
  const { data, error } = await supabase
    .from('orders')
    .select('id,slug,couple,status')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function GET(request) {
  try {
    const supabase = getAdminClient();
    if (!supabase) return response({ error: 'Photo sharing is not configured yet.' }, 503);

    const slug = cleanSlug(new URL(request.url).searchParams.get('slug'));
    if (!slug) return response({ error: 'Invalid wedding gallery.' }, 400);

    const wedding = await findWedding(supabase, slug);
    if (!wedding) return response({ error: 'This wedding gallery was not found.' }, 404);

    const { data: rows, error } = await supabase
      .from('guest_photos')
      .select('id,storage_path,guest_name,caption,created_at')
      .eq('order_id', wedding.id)
      .order('created_at', { ascending: false })
      .limit(300);
    if (error) throw error;

    const paths = (rows || []).map((photo) => photo.storage_path);
    let signed = [];
    if (paths.length) {
      const { data, error: signingError } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60);
      if (signingError) throw signingError;
      signed = data || [];
    }

    const photos = (rows || []).flatMap((photo, index) => {
      const signedUrl = signed[index]?.signedUrl;
      return signedUrl ? [{
        id: photo.id,
        url: signedUrl,
        guestName: photo.guest_name || '',
        caption: photo.caption || '',
        createdAt: photo.created_at,
      }] : [];
    });

    return response({ success: true, wedding: { slug: wedding.slug, couple: wedding.couple }, photos });
  } catch (error) {
    console.error('Guest gallery load error:', error);
    return response({ error: 'We could not load this private gallery.' }, 500);
  }
}

export async function POST(request) {
  let uploadedPath = '';
  let supabase = null;
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
    if (insertError) throw insertError;

    const { data: signed, error: signingError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(uploadedPath, 60 * 60);
    if (signingError) throw signingError;

    return response({
      success: true,
      photo: {
        id: photo.id,
        url: signed.signedUrl,
        guestName,
        caption,
        createdAt: photo.created_at,
      },
      galleryUrl: `/guest-gallery/${encodeURIComponent(slug)}`,
    });
  } catch (error) {
    if (uploadedPath && supabase) {
      await supabase.storage.from(BUCKET).remove([uploadedPath]).catch(() => {});
    }
    console.error('Guest upload error:', error);
    return response({ error: 'We could not save this photo. Please try again.' }, 500);
  }
}
