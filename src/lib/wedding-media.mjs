export function selectHero(details,url) {
 const isImage=/^(data:image\/)|\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(url || '');
 return {...details,customHeroImage:null,
  images:{...(details.images || {}),hero:isImage?url:null,scratchCover:null},
  videos:{...(details.videos || {}),hero:isImage?null:url}};
}
