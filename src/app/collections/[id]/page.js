"use client";

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import BordeauxTemplate from '../../../components/templates/BordeauxTemplate';

const templates = [
  { id: 'champagne', name: 'Luxe Gold', tag: 'ROMANTIC', desc: 'Opulent and golden.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', envelope: '/videos/champagne.mp4', partner1: 'Gabriel', partner2: 'Mathilde' },
  { id: 'ivory', name: 'Pearl', tag: 'MINIMAL', desc: 'Luminous and serene.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', envelope: '/videos/ivory.mp4', partner1: 'Arthur', partner2: 'Chloé' },
  { id: 'bordeaux', name: 'Velvet Noir', tag: 'ELEGANT', desc: 'Bold and timeless.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', envelope: '/videos/bordeaux.mp4', partner1: 'Alexandre', partner2: 'Éléonore' },
  { id: 'sage', name: 'Olive Grove', tag: 'NATURAL', desc: 'Botanical and fresh.', video: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', envelope: '/videos/sage.mp4', partner1: 'Lucas', partner2: 'Margaux' },
  { id: 'terracotta', name: 'Amber', tag: 'WARM', desc: 'Earthy and radiant.', video: 'https://www.wooowinvites.com/assets/just-married-car-theme-BhahCrzF.mp4', envelope: '/videos/terracotta.mp4', partner1: 'Hugo', partner2: 'Inès' },
  { id: 'chocolate', name: 'Mocha', tag: 'WARM', desc: 'Rich and soulful.', video: 'https://www.wooowinvites.com/assets/seaview-balcony-theme-X8-zUaoe.mp4', envelope: '/videos/chocolate.mp4', partner1: 'Louis', partner2: 'Camille' },
  { id: 'royalbordeaux', name: 'Crimson Royal', tag: 'DRAMATIC', desc: 'Regal and distinguished.', video: 'https://www.wooowinvites.com/assets/castle-theme-DW5muDbc.mp4', envelope: '/videos/royal-bordeaux.mp4', partner1: 'Antoine', partner2: 'Victoire' },
  { id: 'royalblue', name: 'Sapphire', tag: 'ELEGANT', desc: 'Oceanic and refined.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: '/videos/royal-blue.mp4', partner1: 'Maxime', partner2: 'Charlotte' },
  { id: 'rosebow', name: 'Blush Ribbon', tag: 'ROMANTIC', desc: 'Romantic ribbon reveal.', video: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', envelope: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', partner1: 'Paul', partner2: 'Juliette' },
  { id: 'majestic', name: 'Grand Heritage', tag: 'ELEGANT', desc: 'A grand ceremonial debut.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: 'https://majestic-template.thedigitalyes.com/assets/intro-video-Dhn3t98e.mp4', partner1: 'Charles', partner2: 'Valentine' },
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
            hero: tpl.video
          },
          sections: { showIntro: true, showVenue: true, showSchedule: true, showBoardingPass: false, showRSVP: true, showGallery: true }
        }}
      />
    </div>
  );
}
