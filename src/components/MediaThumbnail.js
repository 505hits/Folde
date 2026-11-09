'use client';
import {useState} from 'react';
import {mediaPosters} from '@/lib/media-posters.mjs';

// This stable component never mounts a video in the selection grids. Typing in
// the form therefore cannot restart dozens of downloads and blank their frames.
export default function MediaThumbnail({url,name,color='#eee7dc',kind='hero'}) {
 const [failed,setFailed]=useState(null);
 if(!url || url==='custom') return <span style={{display:'grid',placeItems:'center',width:'100%',height:'100%',background:color,fontSize:'1.5rem'}} aria-label={name}>＋</span>;
 const image=/^(data:image\/)|\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(url);
 const fallback=kind==='envelope'?'/images/envelope-posters/ivory.webp':'/images/hero-posters/kissing-couple.webp';
 const src=failed===url ? fallback : mediaPosters[url] || (image?url:fallback);
 return <img src={src} alt={name} loading="lazy" decoding="async" onError={()=>setFailed(url)} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',background:color}} />;
}
