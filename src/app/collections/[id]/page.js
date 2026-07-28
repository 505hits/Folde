"use client";

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import BordeauxTemplate from '../../../components/templates/BordeauxTemplate';

const templates = [
  { id: 'champagne', name: 'Luxe Gold', tag: 'ROMANTIC', desc: 'Opulent and golden.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Gabriel', partner2: 'Mathilde' },
  { id: 'ivory', name: 'Pearl', tag: 'MINIMAL', desc: 'Luminous and serene.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Arthur', partner2: 'Chloé' },
  { id: 'bordeaux', name: 'Velvet Noir', tag: 'ELEGANT', desc: 'Bold and timeless.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', envelope: 'https://customer-u86xbpugorqyu327.cloudflarestream.com/dd56b19a36d2302d980bcafece0a9b05/manifest/video.m3u8', partner1: 'Alexandre', partner2: 'Éléonore' },
  { id: 'sage', name: 'Olive Grove', tag: 'NATURAL', desc: 'Botanical and fresh.', video: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', partner1: 'Lucas', partner2: 'Margaux' },
  { id: 'terracotta', name: 'Amber', tag: 'WARM', desc: 'Earthy and radiant.', video: 'https://www.wooowinvites.com/assets/just-married-car-theme-BhahCrzF.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', partner1: 'Hugo', partner2: 'Inès' },
  { id: 'chocolate', name: 'Mocha', tag: 'WARM', desc: 'Rich and soulful.', video: 'https://www.wooowinvites.com/assets/seaview-balcony-theme-X8-zUaoe.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Louis', partner2: 'Camille' },
  { id: 'royalbordeaux', name: 'Crimson Royal', tag: 'DRAMATIC', desc: 'Regal and distinguished.', video: 'https://www.wooowinvites.com/assets/castle-theme-DW5muDbc.mp4', envelope: 'https://customer-u86xbpugorqyu327.cloudflarestream.com/dd56b19a36d2302d980bcafece0a9b05/manifest/video.m3u8', partner1: 'Antoine', partner2: 'Victoire' },
  { id: 'royalblue', name: 'Sapphire', tag: 'ELEGANT', desc: 'Oceanic and refined.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Maxime', partner2: 'Charlotte' },
  { id: 'rosebow', name: 'Blush Ribbon', tag: 'ROMANTIC', desc: 'Romantic ribbon reveal.', video: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', envelope: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', partner1: 'Paul', partner2: 'Juliette', bgMusic: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/cbc31a31-f746-4167-a1a1-800f6bfbe346/autumn-wind.mp3' },
  { id: 'majestic', name: 'Grand Heritage', tag: 'ELEGANT', desc: 'A grand ceremonial debut.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: 'https://majestic-template.thedigitalyes.com/assets/intro-video-Dhn3t98e.mp4', partner1: 'Charles', partner2: 'Valentine', bgMusic: 'https://savethedate-lacephotoscratch.thedigitalyes.com/__l5e/assets-v1/7fabed49-0b68-47b7-b210-0dcc4eae3cb9/background-music.mp3' },
  { id: 'thelaceedit', name: 'The Lace Edit', tag: 'ELEGANT', desc: 'Delicate lace and timeless romance.', video: 'https://savethedate-oasisroyale.thedigitalyes.com/__l5e/assets-v1/775de535-0300-4a62-ae3b-dceee4b22ab7/hero-video-compressed.mp4', isImage: false, scratchCover: 'https://savethedate-thelaceedit.thedigitalyes.com/assets/hero-scratch-cover-CwPyg4DV.png', envelope: 'https://savethedate-thelaceedit.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Emma', partner2: 'Liam', date: 'MAY 27, 2026', popular: true, bgMusic: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/3d842fb0-cf11-4a32-adb8-a961c95045ac/background-music.mp3' },
  { id: 'lejardin', name: 'Le Jardin', tag: 'NATURAL', desc: 'A lush garden romance.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', isImage: false, envelope: 'https://savethedate-lejardin.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Sophie', partner2: 'Lucas', date: 'MAY 27, 2026', popular: true, bgMusic: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/cbc31a31-f746-4167-a1a1-800f6bfbe346/autumn-wind.mp3' },
  { id: 'lacephotoscratch', name: 'Lace Photo Scratch', tag: 'ELEGANT', desc: 'Interactive elegant scratch reveal.', video: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/4689b4cd-298d-4b59-b560-7d443345b459/hero-bg.mp4', isImage: false, scratchCover: 'https://savethedate-lacephotoscratch.thedigitalyes.com/assets/hero-scratch-cover-reference-CIK32eF4.png', envelope: 'https://savethedate-lacephotoscratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Chloe', partner2: 'Noah', date: 'MAY 27, 2026', popular: false, bgMusic: 'https://savethedate-lacephotoscratch.thedigitalyes.com/__l5e/assets-v1/7fabed49-0b68-47b7-b210-0dcc4eae3cb9/background-music.mp3' },
  { id: 'oasisroyale', name: 'Oasis Royale', tag: 'ELEGANT', desc: 'A grand desert oasis celebration.', video: 'https://savethedate-oasisroyale.thedigitalyes.com/__l5e/assets-v1/775de535-0300-4a62-ae3b-dceee4b22ab7/hero-video-compressed.mp4', isImage: false, envelope: 'https://savethedate-oasisroyale.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Mia', partner2: 'Leo', date: 'MAY 27, 2026', popular: false, bgMusic: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/3d842fb0-cf11-4a32-adb8-a961c95045ac/background-music.mp3' },
  { id: 'tropical', name: 'Tropical', tag: 'NATURAL', desc: 'Vibrant tropical paradise.', video: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/4689b4cd-298d-4b59-b560-7d443345b459/hero-bg.mp4', isImage: false, envelope: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/276cb847-0eab-41c6-9ad6-30c90ab5ec34/envelope-open.mp4', partner1: 'Ava', partner2: 'Oliver', date: 'MAY 27, 2026', popular: true, bgMusic: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/cbc31a31-f746-4167-a1a1-800f6bfbe346/autumn-wind.mp3' },
  { id: 'photoscratch', name: 'Photo Scratch', tag: 'ROMANTIC', desc: 'Reveal your memory.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', isImage: false, scratchCover: 'https://savethedate-photo-scratch.thedigitalyes.com/assets/hero-scratch-cover-BPeuVyTP.png', envelope: 'https://savethedate-photo-scratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Elena', partner2: 'Mark', date: 'AUG 12, 2026' },
  { id: 'softscratch', name: 'Soft Scratch', tag: 'MINIMAL', desc: 'A soft reveal.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', isImage: false, scratchCover: 'https://soft-scratch.thedigitalyes.com/assets/hero-scratch-cover-CIK32eF4.png', envelope: 'https://soft-scratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Anna', partner2: 'Tom', date: 'SEP 05, 2026' },
  { id: 'cisnes', name: 'Cisnes', tag: 'ELEGANT', desc: 'Elegant swans romance.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', isImage: false, scratchCover: 'https://savethedate-cisnes.thedigitalyes.com/assets/hero-scratch-cover-BPeuVyTP.png', envelope: 'https://savethedate-cisnes.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Clara', partner2: 'Hugo', date: 'OCT 18, 2026' },
  { id: 'bloom', name: 'Bloom', tag: 'NATURAL', desc: 'Blossoming love.', video: 'https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4', isImage: false, scratchCover: 'https://savethedate-bloom.thedigitalyes.com/assets/hero-scratch-cover-CwPyg4DV.png', envelope: 'https://savethedate-bloom.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Lily', partner2: 'James', date: 'JUN 21, 2026', bgMusic: 'https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/cbc31a31-f746-4167-a1a1-800f6bfbe346/autumn-wind.mp3' },
  { id: 'floral', name: 'Floral', tag: 'NATURAL', desc: 'A bed of flowers.', video: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', isImage: false, scratchCover: 'https://savethedate-floral.thedigitalyes.com/assets/hero-scratch-cover-CwPyg4DV.png', envelope: 'https://savethedate-floral.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Rose', partner2: 'Jack', date: 'MAY 15, 2026' },
  { id: 'dolcevita', name: 'Dolce Vita', tag: 'ROMANTIC', desc: 'Italian coast & sun-drenched romance.', video: 'https://static.tildacdn.net/tild3733-3133-4232-b033-623736623262/romantic-moments-bea.png', isImage: true, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', partner1: 'Matteo', partner2: 'Chiara', date: 'AUG 20, 2026', popular: true },
  { id: 'webgencytemplate5', name: 'Velvet Garden', tag: 'ELEGANT', desc: 'Sleek modern luxury with botanical details.', video: 'https://static.tildacdn.net/tild3338-6332-4463-b639-623665353237/300592484d1f31590325.png', isImage: true, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Enzo', partner2: 'Manon', date: 'SEP 14, 2026', popular: false },
  { id: 'tildatemplate2', name: 'Noir Gold', tag: 'MINIMAL', desc: 'Minimalist dark luxury with gold accents.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', isImage: false, envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', partner1: 'Lucas', partner2: 'Inès', date: 'OCT 02, 2026', popular: false },
  { id: 'pressedlovecomo', name: 'Como', tag: 'ELEGANT', desc: 'Lake Como villa elegance.', video: 'https://pressedlove.com/demo-media/como/hero-video.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/wax-seal-blue-e30ba1e0.mp4', partner1: 'Lorenzo', partner2: 'Sophia', date: 'JUN 05, 2026', popular: true },
  { id: 'pressedloveteatro', name: 'Teatro', tag: 'DRAMATIC', desc: 'Theatrical curtain reveal and opulent gold.', video: 'https://pressedlove.com/demo-media/template-teatro/curtain-video-BAKLj3Y5.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Dante', partner2: 'Beatrice', date: 'JUL 18, 2026', popular: true },
  { id: 'pressedlovethevenue', name: 'The Venue', tag: 'WARM', desc: 'Destination villa & estate celebration.', video: 'https://pressedlove.com/demo-media/boda-mar-jaume/intro-video-BSNlV4m4.webm', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Jaume', partner2: 'Mar', date: 'AUG 28, 2026', popular: false },
  { id: 'pressedlovesweetlove', name: 'Sweet Love', tag: 'ROMANTIC', desc: 'Warm peach, cream & tender romance.', video: 'https://pressedlove.com/demo-media/boda-laura-javier/hero-video-new-G6oopIOA.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Javier', partner2: 'Laura', date: 'SEP 10, 2026', popular: true },
  { id: 'pressedlovefloral', name: 'Botanical Floral', tag: 'NATURAL', desc: 'Soft floral petals and garden blooming.', video: 'https://pressedlove.com/demo-media/boda-maria-carlos/hero-video-1230-C27srnl9.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', partner1: 'Carlos', partner2: 'María', date: 'OCT 15, 2026', popular: false },
  { id: 'pressedlovebigentrance', name: 'Big Entrance', tag: 'DRAMATIC', desc: 'Cinematic debut and regal golden seal.', video: 'https://pressedlove.com/demo-media/theme-previews/theme-big-entrance.mp4', isImage: false, envelope: 'https://pressedlove.com/demo-media/shared/wax-seal-yellow-dc798fa1.mp4', partner1: 'Raphaël', partner2: 'Victoria', date: 'NOV 08, 2026', popular: true },
];

export default function TemplateDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const tpl = templates.find(t => t.id === id);

  if (!tpl) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Design template not found</h2>
        <button onClick={() => router.push('/collections')} style={{ padding: '0.8rem 1.5rem', marginTop: '1rem', cursor: 'pointer' }}>
          Back to Catalog
        </button>
      </div>
    );
  }

  const handleSelect = () => {
    localStorage.setItem('selectedTemplate', tpl.id);
    router.push('/checkout');
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#FAF9F6' }}>

      {/* Main Template Content rendering full screen */}
      <BordeauxTemplate 
        editMode={false}
        heroHeight="100vh"
        data={{
          themeId: tpl.id,
          partner1: tpl.partner1,
          partner2: tpl.partner2,
          videos: {
            envelope: tpl.envelope,
            hero: tpl.isImage ? null : tpl.video
          },
          images: {
            hero: tpl.isImage ? tpl.video : null,
            scratchCover: tpl.scratchCover || null
          },
          sounds: {
            bgMusic: tpl.bgMusic || null
          },
          sections: { showIntro: true, showVenue: true, showSchedule: true, showBoardingPass: false, showRSVP: true, showGallery: true }
        }}
      />
    </div>
  );
}
