import { supabase } from '@/lib/supabase';

async function step(body) {
  const response = await fetch('/api/guest-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) throw new Error(data.error || 'We could not upload this photo.');
  return data;
}

// Sends one photo straight to Supabase Storage. The server only signs the
// upload and records it, so photo bytes never pass through Vercel Functions.
export async function uploadGuestPhoto({ slug, file, name, guestName, caption }) {
  const type = file.type || 'image/jpeg';
  const prepared = await step({ step: 'prepare', slug, type, size: file.size, name, guestName, caption });
  const { bucket, path, token } = prepared.upload;
  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file, { contentType: type, upsert: false });
  if (error) throw new Error('We could not upload this photo.');
  const confirmed = await step({ step: 'confirm', ticket: prepared.ticket });
  if (!confirmed.photo?.id) throw new Error('We could not upload this photo.');
  return confirmed.photo;
}
