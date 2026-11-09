// One write at a time per wedding, shared by autosave and publication.
export function createWeddingWriter(request) {
 const pending = new Map();
 const versions = new Map();
 function write(slug, action, details) {
  const patch = details ? {...details} : undefined;
  if(patch){delete patch.publishedData;delete patch._seatingPlan;delete patch._draftVersion;}
  const previous = pending.get(slug) || Promise.resolve();
  const result = previous.catch(() => {}).then(async () => {
   const response = await request('/api/wedding', {
    method:'PATCH',body:JSON.stringify({slug,action,details:patch,expectedVersion:versions.get(slug) ?? 0})
   });
   versions.set(slug,response.order?.details?._draftVersion ?? 0);
   return response;
  });
  pending.set(slug,result);
  result.then(() => {if(pending.get(slug) === result)pending.delete(slug);},() => {if(pending.get(slug) === result)pending.delete(slug);});
  return result;
 }
 return {seed:(slug,version)=>versions.set(slug,version || 0),save:(slug,details)=>write(slug,'details',details),publish:(slug,details)=>write(slug,'publish',details)};
}
