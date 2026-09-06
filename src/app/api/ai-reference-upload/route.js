import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !anonKey || !serviceKey) {
      return NextResponse.json({ error: 'Image uploads are not configured yet.' }, { status: 503 });
    }

    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ error: 'Please sign in to upload an AI reference image.' }, { status: 401 });
    const authClient = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file.arrayBuffer !== 'function' || !String(file.type || '').startsWith('image/')) {
      return NextResponse.json({ error: 'Please select a JPG, PNG, or WebP image.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Please choose an image smaller than 5 MB.' }, { status: 400 });
    }

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
    const path = `ai-references/${Date.now()}-${crypto.randomUUID()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, await file.arrayBuffer(), { cacheControl: '3600', contentType: 'image/jpeg', upsert: false });
    if (uploadError) {
      console.error('AI reference upload error:', uploadError.message);
      return NextResponse.json({ error: 'We could not save this image. Please try again.' }, { status: 502 });
    }

    // The media bucket is private in this project. Return an hour-long signed
    // URL so the preview and KIE can both access the source image.
    const { data: signed, error: signedError } = await supabase.storage
      .from('media')
      .createSignedUrl(path, 60 * 60);
    if (signedError || !signed?.signedUrl) {
      console.error('AI reference signing error:', signedError?.message);
      return NextResponse.json({ error: 'We could not prepare this image for AI generation.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, url: signed.signedUrl });
  } catch (error) {
    console.error('AI reference upload exception:', error);
    return NextResponse.json({ error: 'We could not upload this image. Please try again.' }, { status: 500 });
  }
}
