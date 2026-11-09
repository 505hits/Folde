import { supabase } from '@/lib/supabase';

export async function weddingRequest(url, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const isUpload = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(url, { ...options, cache: 'no-store', headers: { ...(!isUpload ? {'Content-Type': 'application/json'} : {}), ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}), ...options.headers } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Your changes could not be saved.');
  return result;
}
