"use client";

import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';

export const getFirstFramePoster = (url) => {
  if (!url) return undefined;
  if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)) return url;
  if (url.includes('cloudflarestream')) {
    return url.replace('manifest/video.m3u8', 'thumbnails/thumbnail.jpg?time=0s');
  }
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
  previewImage
}) {
  const [envelopeDismissed, setEnvelopeDismissed] = useState(!showEnvelope);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const envelopeVideoRef = useRef(null);
  const heroVideoRef = useRef(null);

  const heroPoster = previewImage || getFirstFramePoster(videoSrc);
  const envelopePoster = getFirstFramePoster(envelopeSrc);

  const handleActivateVideo = (e) => {
    e.stopPropagation();
    if (!videoActive) {
      setVideoActive(true);
    }
  };

  useEffect(() => {
    if (videoActive && showEnvelope && envelopeSrc && !envelopeDismissed) {
      const video = envelopeVideoRef.current;
      if (!video) return;

      let hls;
      const cleanEnvelopeSrc = envelopeSrc.replace(/#t=.*$/, '');
      if (cleanEnvelopeSrc.endsWith('.m3u8') && Hls.isSupported()) {
        hls = new Hls({ startLevel: -1, capLevelToPlayerSize: true });
        hls.loadSource(cleanEnvelopeSrc);
        hls.attachMedia(video);
      } else {
        video.src = cleanEnvelopeSrc;
      }

      setEnvelopeOpen(true);
      video.play().catch(e => console.log("Video play on click error:", e));
      const timer = setTimeout(() => setEnvelopeDismissed(true), 12000);

      return () => {
        clearTimeout(timer);
        if (hls) hls.destroy();
      };
    }
  }, [videoActive, showEnvelope, envelopeSrc, envelopeDismissed]);

  const handleVideoEnded = () => {
    setTimeout(() => {
      setEnvelopeDismissed(true);
    }, 2000);
  };

  const isHeroImg = isImage || (videoSrc && videoSrc.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i));
  const isEnvImg = envelopeSrc && envelopeSrc.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i);

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
              alt="Envelope Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : !videoActive ? (
            <video
              src={getFirstFrameVideoSrc(envelopeSrc)}
              poster={envelopePoster}
              preload="metadata"
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <video
              ref={envelopeVideoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
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
          alt="Hero Preview"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }}
        />
      ) : !videoActive ? (
        <video
          ref={heroVideoRef}
          src={getFirstFrameVideoSrc(videoSrc)}
          poster={heroPoster}
          preload="metadata"
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
          <span>▶</span> Click to play video
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
          <p style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '0.85em', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>Wedding Day</p>
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

