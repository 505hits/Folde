"use client";

import Image from "next/image";
import Link from "next/link";
import TemplateHeroPreview from "../../components/TemplateHeroPreview";
import BordeauxTemplate from "../../components/templates/BordeauxTemplate";
import { useState } from "react";
import { useRouter } from "next/navigation";

const templates = [
  { id: 'champagne', name: 'Luxe Gold', tag: 'ROMANTIC', desc: 'Opulent and golden.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', envelope: '/videos/golden-palace.mp4', partner1: 'Gabriel', partner2: 'Mathilde', date: 'MAY 27, 2026', popular: false },
  { id: 'ivory', name: 'Pearl', tag: 'MINIMAL', desc: 'Luminous and serene.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', envelope: '/videos/ivory-veil.mp4', partner1: 'Arthur', partner2: 'Chloé', date: 'MAY 27, 2026', popular: false },
  { id: 'bordeaux', name: 'Velvet Noir', tag: 'ELEGANT', desc: 'Bold and timeless.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', envelope: '/videos/bordeaux.mp4', partner1: 'Alexandre', partner2: 'Éléonore', date: 'MAY 27, 2026', popular: true, link: '/kissing-couple-wedding-invitation' },
  { id: 'sage', name: 'Olive Grove', tag: 'NATURAL', desc: 'Botanical and fresh.', video: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', partner1: 'Lucas', partner2: 'Margaux', date: 'MAY 27, 2026', popular: false },
  { id: 'terracotta', name: 'Amber', tag: 'WARM', desc: 'Earthy and radiant.', video: 'https://www.wooowinvites.com/assets/just-married-car-theme-BhahCrzF.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', partner1: 'Hugo', partner2: 'Inès', date: 'MAY 27, 2026', popular: true },
  { id: 'chocolate', name: 'Mocha', tag: 'WARM', desc: 'Rich and soulful.', video: 'https://www.wooowinvites.com/assets/seaview-balcony-theme-X8-zUaoe.mp4', envelope: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', partner1: 'Louis', partner2: 'Camille', date: 'MAY 27, 2026', popular: true },
  { id: 'royalbordeaux', name: 'Crimson Royal', tag: 'DRAMATIC', desc: 'Regal and distinguished.', video: 'https://www.wooowinvites.com/assets/castle-theme-DW5muDbc.mp4', envelope: '/videos/horizon-bordeaux.mp4', partner1: 'Antoine', partner2: 'Victoire', date: 'MAY 27, 2026', popular: false },
  { id: 'royalblue', name: 'Sapphire', tag: 'ELEGANT', desc: 'Oceanic and refined.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: '/videos/celestial-veil.mp4', partner1: 'Maxime', partner2: 'Charlotte', date: 'MAY 27, 2026', popular: false },
  { id: 'rosebow', name: 'Blush Ribbon', tag: 'ROMANTIC', desc: 'Romantic ribbon reveal.', video: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', envelope: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', partner1: 'Paul', partner2: 'Juliette', date: 'MAY 27, 2026', popular: true },
  { id: 'majestic', name: 'Grand Heritage', tag: 'ELEGANT', desc: 'A grand ceremonial debut.', video: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4', envelope: 'https://majestic-template.thedigitalyes.com/assets/intro-video-Dhn3t98e.mp4', partner1: 'Charles', partner2: 'Valentine', date: 'MAY 27, 2026', popular: false },
  { id: 'thelaceedit', name: 'The Lace Edit', tag: 'ELEGANT', desc: 'Delicate lace and timeless romance.', video: 'https://savethedate-thelaceedit.thedigitalyes.com/assets/hero-scratch-cover-CwPyg4DV.png', isImage: true, envelope: 'https://savethedate-thelaceedit.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Emma', partner2: 'Liam', date: 'MAY 27, 2026', popular: true },
  { id: 'lejardin', name: 'Le Jardin', tag: 'NATURAL', desc: 'A lush garden romance.', video: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/0d44b575-21a3-498b-856a-eaf9614d23c6/hero-video-compressed.mp4', isImage: false, envelope: 'https://savethedate-lejardin.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Sophie', partner2: 'Lucas', date: 'MAY 27, 2026', popular: true },
  { id: 'lacephotoscratch', name: 'Lace Photo Scratch', tag: 'ELEGANT', desc: 'Interactive elegant scratch reveal.', video: 'https://savethedate-lacephotoscratch.thedigitalyes.com/assets/hero-scratch-cover-reference-CIK32eF4.png', isImage: true, envelope: 'https://savethedate-lacephotoscratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Chloe', partner2: 'Noah', date: 'MAY 27, 2026', popular: false },
  { id: 'oasisroyale', name: 'Oasis Royale', tag: 'ELEGANT', desc: 'A grand desert oasis celebration.', video: 'https://savethedate-oasisroyale.thedigitalyes.com/__l5e/assets-v1/775de535-0300-4a62-ae3b-dceee4b22ab7/hero-video-compressed.mp4', isImage: false, envelope: 'https://savethedate-oasisroyale.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Mia', partner2: 'Leo', date: 'MAY 27, 2026', popular: false },
  { id: 'tropical', name: 'Tropical', tag: 'NATURAL', desc: 'Vibrant tropical paradise.', video: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/4689b4cd-298d-4b59-b560-7d443345b459/hero-bg.mp4', isImage: false, envelope: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/276cb847-0eab-41c6-9ad6-30c90ab5ec34/envelope-open.mp4', partner1: 'Ava', partner2: 'Oliver', date: 'MAY 27, 2026', popular: true },
  { id: 'photoscratch', name: 'Photo Scratch', tag: 'ROMANTIC', desc: 'Reveal your memory.', video: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4', isImage: false, scratchCover: 'https://savethedate-photo-scratch.thedigitalyes.com/assets/hero-scratch-cover-BPeuVyTP.png', envelope: 'https://savethedate-photo-scratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Elena', partner2: 'Mark', date: 'AUG 12, 2026' },
  { id: 'softscratch', name: 'Soft Scratch', tag: 'MINIMAL', desc: 'A soft reveal.', video: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4', isImage: false, scratchCover: 'https://soft-scratch.thedigitalyes.com/assets/hero-scratch-cover-CIK32eF4.png', envelope: 'https://soft-scratch.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Anna', partner2: 'Tom', date: 'SEP 05, 2026' },
  { id: 'cisnes', name: 'Cisnes', tag: 'ELEGANT', desc: 'Elegant swans romance.', video: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4', isImage: false, scratchCover: 'https://savethedate-cisnes.thedigitalyes.com/assets/hero-scratch-cover-BPeuVyTP.png', envelope: 'https://savethedate-cisnes.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Clara', partner2: 'Hugo', date: 'OCT 18, 2026' },
  { id: 'bloom', name: 'Bloom', tag: 'NATURAL', desc: 'Blossoming love.', video: 'https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4', isImage: false, scratchCover: 'https://savethedate-bloom.thedigitalyes.com/assets/hero-scratch-cover-CwPyg4DV.png', envelope: 'https://savethedate-bloom.thedigitalyes.com/video/envelope-open.mp4', partner1: 'Lily', partner2: 'James', date: 'JUN 21, 2026' },
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

export default function Templates() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [playingTemplate, setPlayingTemplate] = useState(null);

  const PreviewIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '-2px' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
  const SelectIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '-2px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>;
  const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

  const tags = ['All', 'Popular', 'Elegant', 'Romantic', 'Warm', 'New'];

  const filtered = filter === 'All' ? templates
    : filter === 'Popular' ? templates.filter(t => t.popular)
      : templates.filter(t => t.tag.toLowerCase() === filter.toLowerCase());

  const handleSelectAndContinue = (id) => {
    localStorage.setItem('selectedTemplate', id);
    router.push('/checkout');
  };

  const openPreview = (e, t) => {
    e.stopPropagation();
    router.push(`/collections/${t.id}`);
  };

  return (
    <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', fontFamily: 'var(--font-body)', color: '#3D2B1F' }}>
      <style>{`
        .tpl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .tpl-card { border-radius: 16px; overflow: hidden; background: #fff; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 2px 12px rgba(0,0,0,0.03); transition: transform 0.25s, box-shadow 0.25s; cursor: pointer; }
        .tpl-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .tpl-img-wrap { position: relative; aspect-ratio: 3/4; overflow: hidden; background: #f0ede9; }
        .tpl-phone { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 55%; height: 75%; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.15); border: 3px solid #222; }
        .tpl-info { padding: 1.25rem 1.5rem; }
        .tpl-actions { display: flex; gap: 0; border-top: 1px solid #f0ede9; }
        .tpl-actions button { flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; font-size: 0.85rem; font-weight: 500; font-family: inherit; color: #555; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: background 0.15s; }
        .tpl-actions button:hover { background: #faf8f5; }
        .tpl-actions button:first-child { border-right: 1px solid #f0ede9; }
        .tpl-badge { display: inline-block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.5px; padding: 0.15rem 0.5rem; border-radius: 4px; background: rgba(176,137,104,0.12); color: #b08968; margin-left: 0.5rem; vertical-align: middle; }
        .tpl-popular { position: absolute; top: 12px; right: 12px; background: #b08968; color: #fff; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 6px; z-index: 2; letter-spacing: 0.5px; }
        .tpl-preview-btn { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; z-index: 2; }
        @media (max-width: 900px) { .tpl-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; } }
        @media (max-width: 550px) { .tpl-grid { grid-template-columns: 1fr; gap: 1rem; } }
        .back-btn { position: absolute; top: 1.5rem; left: 1.5rem; display: flex; align-items: center; gap: 0.5rem; color: #5C3A1E; text-decoration: none; font-weight: 600; font-size: 0.95rem; background: #fff; padding: 0.6rem 1.25rem; border-radius: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: all 0.2s ease; z-index: 10; border: 1px solid rgba(0,0,0,0.03); }
        .back-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      `}</style>

      {/* Navigation / Back Button */}
      <Link href="/" className="back-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back
      </Link>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 400, marginBottom: '0.75rem' }}>
          Explore Our Design Collections
        </h1>
        <p style={{ color: '#888', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
          Find the universe that matches your story. Every collection can be fully personalized.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0 2rem 2.5rem', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <button key={tag} onClick={() => setFilter(tag)}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '30px', border: 'none',
              backgroundColor: filter === tag ? '#5C3A1E' : '#eee',
              color: filter === tag ? '#fff' : '#555',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'inherit',
              transition: 'all 0.15s'
            }}>
            {tag}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        <div className="tpl-grid">
          {filtered.map(t => (
            <div key={t.id} className="tpl-card" onClick={() => handleSelectAndContinue(t.id)} style={{
              borderColor: 'rgba(0,0,0,0.05)',
              borderWidth: '1px'
            }}>
              <div className="tpl-img-wrap">
                {t.popular && <div className="tpl-popular">⭐ POPULAR</div>}
                <button className="tpl-preview-btn" onClick={(e) => openPreview(e, t)}><PreviewIcon /></button>
                <div className="tpl-phone" onClick={(e) => { e.stopPropagation(); setPlayingTemplate(t.id); }}>
                  <div className="tpl-notch"></div>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', WebkitMaskImage: '-webkit-radial-gradient(white, black)', maskImage: 'radial-gradient(white, black)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
                    <TemplateHeroPreview
                      partner1={t.partner1}
                      partner2={t.partner2}
                      videoSrc={t.video}
                      envelopeSrc={t.envelope}
                      showEnvelope={!!t.envelope}
                      isImage={t.isImage || false}
                      previewImage={t.image}
                      active={playingTemplate === t.id}
                    />
                  </div>
                </div>
              </div>
              <div className="tpl-info">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{t.name}</span>
                  <span className="tpl-badge">{t.tag}</span>
                </div>
                <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: 1.5 }}>{t.desc}</p>
              </div>
              <div className="tpl-actions">
                <button onClick={(e) => { e.stopPropagation(); openPreview(e, t); }}>
                  <PreviewIcon /> Preview
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleSelectAndContinue(t.id); }} style={{ color: '#555', fontWeight: 500 }}>
                  <SelectIcon /> Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>



    </div>
  );
}
