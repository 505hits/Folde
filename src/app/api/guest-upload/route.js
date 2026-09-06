import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function POST(request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Photo sharing is not configured yet.' }, { status: 503 });
    }

    const formData = await request.formData();
    const slug = String(formData.get('slug') || '').trim();
    const file = formData.get('file');
    if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
      return NextResponse.json({ error: 'Invalid wedding gallery.' }, { status: 400 });
    }
    if (!(file instanceof File) || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Please choose an image file.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Please choose an image smaller than 4 MB.' }, { status: 400 });
    }

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { data: order, error: orderError } = await supabase
      .from('orders').select('details').eq('slug', slug).maybeSingle();
    if (orderError || !order) {
      return NextResponse.json({ error: 'This wedding gallery was not found.' }, { status: 404 });
    }

    const filePath = `guest-uploads/${slug}/${Date.now()}-${crypto.randomUUID()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('media').upload(filePath, file, { cacheControl: '31536000', upsert: false, contentType: 'image/jpeg' });
    if (uploadError) {
      console.error('Guest gallery upload error:', uploadError.message);
      return NextResponse.json({ error: 'We could not save this photo. Please try again.' }, { status: 502 });
    }

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
    const photoUrl = urlData?.publicUrl;
    if (!photoUrl) throw new Error('Storage did not return a public URL.');

    const details = order.details || {};
    const guestGallery = Array.from(new Set([...(details.guestGallery || []), photoUrl]));
    const updatedDetails = {
      ...details,
      guestGallery,
      // Live invitations may render publishedData, so update it at the same time.
      publishedData: details.publishedData ? { ...details.publishedData, guestGallery } : details.publishedData
    };
    const { error: updateError } = await supabase.from('orders').update({ details: updatedDetails }).eq('slug', slug);
    if (updateError) {
      console.error('Guest gallery persistence error:', updateError.message);
      return NextResponse.json({ error: 'The photo was uploaded but could not be added to the gallery.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, photoUrl });
  } catch (error) {
    console.error('Guest upload error:', error);
    return NextResponse.json({ error: 'We could not upload this photo. Please try again.' }, { status: 500 });
  }
}
