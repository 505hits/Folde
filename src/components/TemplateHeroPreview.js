"use client";

import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { getTranslation } from '@/lib/translations';

export const getFirstFramePoster = (url, useEnvelopePoster = false) => {
  if (!url) return undefined;
  if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)) return url;
  if (url.includes('cloudflarestream')) {
    return url.replace('manifest/video.m3u8', 'thumbnails/thumbnail.jpg?time=0s');
  }
  if (!useEnvelopePoster) return undefined;
  const posterFile = [
    ['horizon-bordeaux', 'horizon-bordeaux'], ['golden-palace', 'golden-palace'],
    ['imperial-light', 'imperial-light'], ['celestial-veil', 'celestial-veil'],
    ['royal-doves', 'royal-doves'], ['royal-bordeaux', 'royal-bordeaux'],
    ['royal-blue', 'royal-blue'], ['oriental-palace', 'oriental-palace'],
    ['ivory-veil', 'ivory-veil'], ['rose-veil', 'rose-veil'],
    ['1777314873141', 'seaview'], ['1777312876430', 'floral'], ['1777287974328', 'royal'],
    ['rs-bow-v2', 'rose-bow'], ['majestic-template', 'majestic'],
    ['savethedate-lejardin', 'lejardin'],
    ['savethedate-lacephotoscratch', 'lacephotoscratch'], ['savethedate-oasisroyale', 'oasisroyale'],
    ['savethedate-photo-scratch', 'photoscratch'], ['pressed-love-envelope', 'pressed-love'],
    ['wax-seal-yellow', 'big-entrance-gold'],
    ['como/blue', 'como-blue-seal'], ['wax-seal-blue', 'como-blue-seal'],
    ['romantic-garden', 'romanticgarden'], ['floral-garden-intro', 'romanticgarden'],
    ['soft-scratch', 'soft-scratch'], ['cisnes', 'cisnes'], ['bloom', 'bloom'],
    ['tropical', 'tropical'], ['terracotta', 'terracotta'], ['chocolate', 'chocolate'],
    ['champagne', 'champagne'], ['ivory', 'ivory'], ['sage', 'sage'], ['bordeaux', 'bordeaux']
  ].find(([needle]) => url.toLowerCase().includes(needle));
  if (posterFile) return `/images/envelope-posters/${posterFile[1]}.webp`;
  return undefined;
};

export const getFirstFrameVideoSrc = (url) => {
  if (!url) return '';
  if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)) return url;
  if (url.includes('#t=')) return url;
  return `${url}#t=0.001`;
};

export default function TemplateHeroPreview({
  partner1 = "Emma",
  partner2 = "Liam",
  date = "MAY 27, 2026",
  videoSrc,
  envelopeSrc,
  showEnvelope = false,
  isImage = false,
  previewImage,
  active = false,
  preloadEnvelopeFrame = false,
  language = 'en'
}) {
  const copy = getTranslation(language);
  const [envelopeDismissed, setEnvelopeDismissed] = useState(!showEnvelope);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const envelopeVideoRef = useRef(null);
  const heroVideoRef = useRef(null);

  const heroPoster = previewImage || getFirstFramePoster(videoSrc);
  const envelopePoster = getFirstFramePoster(envelopeSrc, true);
  const isHeroImg = isImage || (videoSrc && videoSrc.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i));
  const isEnvImg = envelopeSrc && envelopeSrc.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i);

  const handleActivateVideo = (e) => {
    if (!videoActive) {
      e.preventDefault();
      e.stopPropagation();
      setVideoActive(true);
    }
  };

  useEffect(() => {
    if (active) {
      setVideoActive(true);
    } else {
      setVideoActive(false);
      setEnvelopeOpen(false);
      if (showEnvelope) {
        setEnvelopeDismissed(false);
      }
    }
  }, [active, showEnvelope]);

  useEffect(() => {
    const video = envelopeVideoRef.current;
    if (!video || isEnvImg || !envelopeSrc) return;

    let hls;
    const cleanEnvelopeSrc = envelopeSrc.replace(/#t=.*$/, '');
    const firstFrameSrc = getFirstFrameVideoSrc(envelopeSrc);
    // basic check avoiding fully qualified URL mismatch issues
    const srcBase = cleanEnvelopeSrc.split('?')[0].split('#')[0].split('/').pop();

    if (videoActive && showEnvelope && !envelopeDismissed) {
      if (cleanEnvelopeSrc.endsWith('.m3u8') && Hls.isSupported()) {
        hls = new Hls({ startLevel: -1, capLevelToPlayerSize: true });
        hls.loadSource(cleanEnvelopeSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.log("HLS play on click error:", e));
        });
      } else {
        if (!video.src || !video.src.includes(srcBase)) {
          video.src = firstFrameSrc;
          video.preload = "auto";
          if (typeof video.load === 'function') video.load();
        }
        video.play().catch(e => console.log("Video play on click error:", e));
      }

      setEnvelopeOpen(true);
      const timer = setTimeout(() => setEnvelopeDismissed(true), 12000);

      return () => {
        clearTimeout(timer);
        if (hls) hls.destroy();
      };
    }
  }, [videoActive, showEnvelope, envelopeSrc, envelopeDismissed, isEnvImg]);

  const handleVideoEnded = () => {
    if (!envelopeOpen && !videoActive) return;
    setEnvelopeDismissed(true);
  };

  return (
    <div
      onClick={handleActivateVideo}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#1c1714',
        containerType: 'inline-size',
        cursor: 'pointer'
      }}
    >
      {/* ENVELOPE OVERLAY */}
      {!envelopeDismissed && envelopeSrc && showEnvelope && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: '#F7F5F0', zIndex: 100, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          transition: 'opacity 0.8s ease-in-out, visibility 0.8s',
          opacity: envelopeDismissed ? 0 : 1,
          visibility: envelopeDismissed ? 'hidden' : 'visible'
        }}>
          {isEnvImg ? (
            <img
              src={envelopeSrc}
              alt={language === 'es' ? 'Vista previa del sobre' : 'Envelope Preview'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <video
              ref={envelopeVideoRef}
              src={preloadEnvelopeFrame ? getFirstFrameVideoSrc(envelopeSrc) : undefined}
              muted
              playsInline
              poster={envelopePoster}
              preload={preloadEnvelopeFrame ? "auto" : "none"}
              fetchPriority={preloadEnvelopeFrame ? "high" : "auto"}
              onEnded={handleVideoEnded}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
      )}

      {/* HERO CONTENT */}
      {isHeroImg ? (
        <img
          src={videoSrc}
          alt={language === 'es' ? 'Vista previa de la invitación' : 'Hero Preview'}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }}
        />
      ) : !videoActive ? (
        <div
          aria-hidden="true"
          style={{
            width: '100%', height: '100%',
            background: heroPoster ? `center / cover no-repeat url("${heroPoster}")` : 'linear-gradient(145deg, #332720, #88745f)',
          }}
        />
      ) : (
        <video
          src={videoSrc ? videoSrc.replace(/#t=.*$/, '') : ''}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: videoLoaded ? 1 : 0.8,
            transition: 'opacity 0.4s ease'
          }}
        />
      )}

      {/* Click to play indicator overlay */}
      {!videoActive && !isHeroImg && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          backgroundColor: 'rgba(0,0,0,0.65)',
          color: '#fff',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backdropFilter: 'blur(4px)'
        }}>
          <span>▶</span> {language === 'es' ? 'Toca para reproducir' : 'Tap to play video'}
        </div>
      )}

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 1 }} />

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', paddingTop: '3em', fontSize: '3.8cqw', zIndex: 2 }}>
        <h3 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.6em', letterSpacing: '0.1em', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
          {partner1.toUpperCase()}<br />
          <span style={{ fontSize: '1.2em', fontStyle: 'italic', fontWeight: 300 }}>&amp;</span><br />
          {partner2.toUpperCase()}
        </h3>
        <div style={{ marginTop: '1.5em' }}>
          <p style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '0.85em', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{copy.weddingDay}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em', margin: '0.5em 0' }}>
            <div style={{ height: '1px', width: '2em', backgroundColor: '#fff', opacity: 0.8 }}></div>
            <div style={{ width: '0.3em', height: '0.3em', backgroundColor: '#fff', transform: 'rotate(45deg)', opacity: 0.8 }}></div>
            <div style={{ height: '1px', width: '2em', backgroundColor: '#fff', opacity: 0.8 }}></div>
          </div>
          <p style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '0.75em', letterSpacing: '0.2em', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{date.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}

