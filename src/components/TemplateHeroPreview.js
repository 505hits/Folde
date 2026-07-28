"use client";

import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';

export default function TemplateHeroPreview({ partner1 = "Emma", partner2 = "Liam", date = "MAY 27, 2026", videoSrc, envelopeSrc, showEnvelope = false, isImage = false }) {
  const [envelopeDismissed, setEnvelopeDismissed] = useState(!showEnvelope);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(showEnvelope);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const containerRef = useRef(null);
  const envelopeVideoRef = useRef(null);

  // Lazy loading observer: Only start downloading video when card is near viewport
  useEffect(() => {
    if (showEnvelope) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '300px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [showEnvelope]);

  useEffect(() => {
    if (showEnvelope && envelopeSrc && !envelopeDismissed && isVisible) {
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
        if (video) {
          video.play().catch(e => {
            console.log("Autoplay blocked, auto-dismissing envelope", e);
            setEnvelopeDismissed(true);
          });
        }
      }, 1000);
      
      const safetyTimer = setTimeout(() => {
        setEnvelopeDismissed(true);
      }, 4500);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(safetyTimer);
        if (hls) hls.destroy();
      };
    }
  }, [showEnvelope, envelopeSrc, envelopeDismissed, isVisible]);

  const handleVideoEnded = () => {
    setEnvelopeDismissed(true);
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden', 
        backgroundColor: '#1c1714', 
        containerType: 'inline-size' 
      }}
    >
      {/* ENVELOPE OVERLAY */}
      {!envelopeDismissed && envelopeSrc && showEnvelope && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: '#F7F5F0', zIndex: 100, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          transition: 'opacity 1s ease-in-out, visibility 1s',
          opacity: envelopeDismissed ? 0 : 1,
          visibility: envelopeDismissed ? 'hidden' : 'visible'
        }}>
          {envelopeSrc.match(/\.(jpeg|jpg|gif|png)$/i) ? (
            <img 
              src={envelopeSrc} 
              alt="Envelope" 
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
      {isImage ? (
        <img 
          src={isVisible ? videoSrc : undefined} 
          alt="Preview" 
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease' }} 
        />
      ) : (
        isVisible && (
          <video 
            src={videoSrc} 
            autoPlay 
            muted 
            playsInline 
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime >= 10) {
                e.currentTarget.pause();
              }
            }}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              opacity: videoLoaded ? 1 : 0.8,
              transition: 'opacity 0.4s ease'
            }} 
          />
        )
      )}

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 1 }} />
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', paddingTop: '3em', fontSize: '3.8cqw', zIndex: 2 }}>
        <h3 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '1.6em', letterSpacing: '0.1em', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
          {partner1.toUpperCase()}<br/>
          <span style={{ fontSize: '1.2em', fontStyle: 'italic', fontWeight: 300 }}>&amp;</span><br/>
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
