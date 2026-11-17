import { NextResponse } from 'next/server';
import { aiAccess } from '@/lib/ai-access';
import { matchesImageType } from '@/lib/image-file.mjs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
  try {
    const access = await aiAccess(request);
    if (access.error) return NextResponse.json({ error: access.error }, { status: access.status });

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file.arrayBuffer !== 'function' || file.type !== 'image/jpeg') {
      return NextResponse.json({ error: 'Please select a JPG, PNG, or WebP image.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Please choose an image smaller than 5 MB.' }, { status: 400 });
    }

    const supabase = access.db;
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!matchesImageType(bytes, file.type)) return NextResponse.json({ error: 'Please choose a valid JPEG image.' }, { status: 400 });
    const path = `ai-references/${Date.now()}-${crypto.randomUUID()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, bytes, { cacheControl: '3600', contentType: 'image/jpeg', upsert: false });
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
