import {ownedOrder} from '@/lib/server-database';
const types=new Map([['image/jpeg','jpg'],['image/png','png'],['image/webp','webp'],['image/gif','gif']]);
const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function POST(request) {
 try {
  const form=await request.formData();
  const slug=form.get('slug');const file=form.get('file');
  if(typeof slug!=='string'||!slug)return reply({error:'Wedding is required.'},400);
  const access=await ownedOrder(request,slug);
  if(access.error)return reply({error:access.error},access.status);
  if(!(file instanceof File)||!types.has(file.type)||!file.size||file.size>3*1024*1024)return reply({error:'Please choose a JPG, PNG, WebP or GIF image smaller than 3 MB.'},400);
  const path=`weddings/${access.order.id}/${crypto.randomUUID()}.${types.get(file.type)}`;
  const {data,error}=await access.db.storage.from('media').upload(path,Buffer.from(await file.arrayBuffer()),{upsert:false,contentType:file.type,cacheControl:'31536000'});
  if(error||!data?.path)return reply({error:'The image could not be uploaded. Please try again.'},503);
  const {data:publicData}=access.db.storage.from('media').getPublicUrl(path);
  if(!publicData?.publicUrl)return reply({error:'The image was uploaded but its address could not be loaded. Please try again.'},503);
  return reply({success:true,url:publicData.publicUrl});
 }catch(error){console.error('Wedding media upload failed:',error?.message || 'Storage unavailable');return reply({error:'The image could not be uploaded. Please try again.'},503);}
}
