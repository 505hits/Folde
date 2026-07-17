"use client";

import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';

export default function TemplateHeroPreview({ partner1 = "Emma", partner2 = "Liam", date = "MAY 27, 2026", videoSrc, envelopeSrc, showEnvelope = false, isImage = false }) {
  const [envelopeDismissed, setEnvelopeDismissed] = useState(!showEnvelope);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const envelopeVideoRef = useRef(null);

  useEffect(() => {
    if (showEnvelope && envelopeSrc && !envelopeDismissed) {
      const video = envelopeVideoRef.current;
      if (!video) return;

      let hls;
      if (envelopeSrc.endsWith('.m3u8') && Hls.isSupported()) {
        hls = new Hls({ startLevel: -1, capLevelToPlayerSize: true });
        hls.loadSource(envelopeSrc);
        hls.attachMedia(video);
      } else {
        video.src = envelopeSrc;
      }

      const timer = setTimeout(() => {
        setEnvelopeOpen(true);
        video.play().catch(e => console.log("Video play failed", e));
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        if (hls) hls.destroy();
      };
    }
  }, [showEnvelope, envelopeSrc, envelopeDismissed]);

  const handleVideoEnded = () => {
    setEnvelopeDismissed(true);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#111', containerType: 'inline-size' }}>
      {/* ENVELOPE OVERLAY */}
      {!envelopeDismissed && envelopeSrc && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: '#F7F5F0', zIndex: 100, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          transition: 'opacity 1s ease-in-out, visibility 1s',
          opacity: envelopeDismissed ? 0 : 1,
          visibility: envelopeDismissed ? 'hidden' : 'visible'
        }}>
          <video 
            ref={envelopeVideoRef}
            muted
            playsInline
            onEnded={handleVideoEnded}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {isImage ? (
        <img src={videoSrc} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <video src={videoSrc} autoPlay loop={videoSrc !== envelopeSrc} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }} />
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', paddingTop: '3em', fontSize: '3.8cqw' }}>
        <h3 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.6em', letterSpacing: '0.1em', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          {partner1.toUpperCase()}<br/>
          <span style={{ fontSize: '1.2em', fontStyle: 'italic', fontWeight: 300 }}>&amp;</span><br/>
          {partner2.toUpperCase()}
        </h3>
        <div style={{ marginTop: '1.5em' }}>
          <p style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '0.85em', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Wedding Day</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em', margin: '0.5em 0' }}>
            <div style={{ height: '1px', width: '2em', backgroundColor: '#fff', opacity: 0.8 }}></div>
            <div style={{ width: '0.3em', height: '0.3em', backgroundColor: '#fff', transform: 'rotate(45deg)', opacity: 0.8 }}></div>
            <div style={{ height: '1px', width: '2em', backgroundColor: '#fff', opacity: 0.8 }}></div>
          </div>
          <p style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '0.75em', letterSpacing: '0.2em', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{date.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
