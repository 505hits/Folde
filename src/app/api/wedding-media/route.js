import { protectRequest } from '@/lib/request-security';
import { matchesImageType } from '@/lib/image-file.mjs';
import {ownedOrder} from '@/lib/server-database';
const types=new Map([['image/jpeg','jpg'],['image/png','png'],['image/webp','webp'],['image/gif','gif']]);
const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
// Couples' own videos, music and large images go straight from the browser
// to Supabase Storage with a signed upload URL. Storing them inside the
// wedding details made saves exceed the request size limit, so saving and
// publishing failed, and every invitation view re-downloaded the file.
const directTypes = new Map([
  ['video/mp4', ['mp4', 50]], ['video/quicktime', ['mov', 50]], ['video/webm', ['webm', 50]],
  ['audio/mpeg', ['mp3', 15]], ['audio/mp4', ['m4a', 15]], ['audio/x-m4a', ['m4a', 15]], ['audio/aac', ['aac', 15]], ['audio/wav', ['wav', 15]], ['audio/x-wav', ['wav', 15]], ['audio/ogg', ['ogg', 15]],
  ['image/jpeg', ['jpg', 10]], ['image/png', ['png', 10]], ['image/webp', ['webp', 10]], ['image/gif', ['gif', 10]],
]);
async function prepareDirectUpload(request) {
  const body = await request.json().catch(() => ({}));
  const slug = body.slug;
  if (typeof slug !== 'string' || !slug) return reply({ error: 'Wedding is required.' }, 400);
  const access = await ownedOrder(request, slug);
  if (access.error) return reply({ error: access.error }, access.status);
  const rule = directTypes.get(String(body.type || ''));
  const size = Number(body.size);
  if (!rule) return reply({ error: 'Please choose an MP4, MOV or WebM video, an MP3, M4A or WAV track, or a JPG, PNG or WebP image.' }, 400);
  if (!Number.isInteger(size) || size <= 0 || size > rule[1] * 1024 * 1024) return reply({ error: `Please choose a file smaller than ${rule[1]} MB.` }, 400);
  const path = `weddings/${access.order.id}/${crypto.randomUUID()}.${rule[0]}`;
  const { data, error } = await access.db.storage.from('media').createSignedUploadUrl(path);
  if (error || !data?.token) return reply({ error: 'The upload could not be prepared. Please try again.' }, 503);
  const { data: publicData } = access.db.storage.from('media').getPublicUrl(path);
  if (!publicData?.publicUrl) return reply({ error: 'The upload could not be prepared. Please try again.' }, 503);
  return reply({ success: true, upload: { bucket: 'media', path, token: data.token }, url: publicData.publicUrl });
}

export async function POST(request) {
  const isJson = (request.headers.get('content-type') || '').includes('application/json');
  const blocked = await protectRequest(request, isJson ? { limit: 60, maxBytes: 16384 } : { limit: 60, maxBytes: 4194304 });
  if (blocked) return blocked;
  if (isJson) {
    try { return await prepareDirectUpload(request); }
    catch { return reply({ error: 'The upload could not be prepared. Please try again.' }, 503); }
  }
 try {
  const form=await request.formData();
  const slug=form.get('slug');const file=form.get('file');
  if(typeof slug!=='string'||!slug)return reply({error:'Wedding is required.'},400);
  const access=await ownedOrder(request,slug);
  if(access.error)return reply({error:access.error},access.status);
  if(!(file instanceof File)||!types.has(file.type)||!file.size||file.size>3*1024*1024)return reply({error:'Please choose a JPG, PNG, WebP or GIF image smaller than 3 MB.'},400);
  const path=`weddings/${access.order.id}/${crypto.randomUUID()}.${types.get(file.type)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!matchesImageType(bytes, file.type)) return reply({ error: 'The file content must match its image format.' }, 400);
  const {data,error}=await access.db.storage.from('media').upload(path,bytes,{upsert:false,contentType:file.type,cacheControl:'31536000'});
  if(error||!data?.path)return reply({error:'The image could not be uploaded. Please try again.'},503);
  const {data:publicData}=access.db.storage.from('media').getPublicUrl(path);
  if(!publicData?.publicUrl)return reply({error:'The image was uploaded but its address could not be loaded. Please try again.'},503);
  return reply({success:true,url:publicData.publicUrl});
 }catch(error){console.error('Wedding media upload failed:',error?.message || 'Storage unavailable');return reply({error:'The image could not be uploaded. Please try again.'},503);}
}
