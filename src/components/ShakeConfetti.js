"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

const Particle = ({ x, y, color, size, delay }) => (
  <div style={{
    position: 'absolute',
    left: x + '%',
    top: y + '%',
    width: size,
    height: size,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    backgroundColor: color,
    animation: `confettiFall ${1.5 + Math.random()}s ease-out ${delay}s forwards`,
    opacity: 0,
    transform: `rotate(${Math.random() * 360}deg)`,
  }} />
);

export default function ShakeConfetti({ 
  message = "You're Invited! 💍",
  subMessage = "We can't wait to celebrate with you",
  shakeTitle = "Shake Your Phone",
  shakePrompt = "A little surprise awaits",
  accentColor = '#c5975b', 
  bgColor = '#0f0f0f', 
  textColor = '#fff',
  children
}) {
  const [shaken, setShaken] = useState(false);
  const [particles, setParticles] = useState([]);
  const [shakeHint, setShakeHint] = useState(true);
  const lastAccRef = useRef({ x: 0, y: 0, z: 0 });
  const shakeThreshold = 15;

  const colors = [accentColor, '#e8d5b7', '#f0e6d3', '#d4a574', '#fff', '#ffd700', '#ff69b4'];

  const triggerConfetti = useCallback(() => {
    if (shaken) return;
    setShaken(true);
    setShakeHint(false);
    
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: -5 - Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: (4 + Math.random() * 8) + 'px',
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, [shaken, colors]);

  // Device motion (mobile shake)
  useEffect(() => {
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      
      const delta = Math.abs(acc.x - lastAccRef.current.x) +
                    Math.abs(acc.y - lastAccRef.current.y) +
                    Math.abs(acc.z - lastAccRef.current.z);
      
      lastAccRef.current = { x: acc.x, y: acc.y, z: acc.z };
      
      if (delta > shakeThreshold) {
        triggerConfetti();
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [triggerConfetti]);

  // Pulsing phone hint animation
  useEffect(() => {
    if (!shakeHint) return;
    const t = setTimeout(() => setShakeHint(true), 500);
    return () => clearTimeout(t);
  }, [shakeHint]);

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(400px) rotate(720deg) scale(0.3); }
        }
        @keyframes shakePhone {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-8deg); }
          20% { transform: rotate(8deg); }
          30% { transform: rotate(-8deg); }
          40% { transform: rotate(8deg); }
          50% { transform: rotate(-4deg); }
          60% { transform: rotate(4deg); }
          70% { transform: rotate(-2deg); }
          80% { transform: rotate(2deg); }
          90% { transform: rotate(0deg); }
        }
        @keyframes gentleBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes messageReveal {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          50% { transform: scale(1.05) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div 
        onClick={triggerConfetti}
        style={{
          background: bgColor,
          padding: children && shaken ? '0px' : '4rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: !shaken ? 'pointer' : 'default',
          minHeight: children && shaken ? 'auto' : '280px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        {/* Confetti */}
        {particles.map(p => <Particle key={p.id} {...p} />)}

        {!shaken ? (
          <>
            {/* Phone icon with shake animation */}
            <div style={{
              animation: 'shakePhone 1.5s ease-in-out infinite',
              marginBottom: '1.5rem',
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>

            <p style={{
              fontSize: '0.65rem',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: textColor,
              opacity: 0.4,
              marginBottom: '1rem',
              fontWeight: 500,
            }}>
              {shakePrompt}
            </p>

            <h2 style={{
              fontFamily: "'Harmond', 'Zen Old Mincho', serif",
              fontSize: '2rem',
              fontWeight: 400,
              fontStyle: 'italic',
              color: textColor,
              marginBottom: '0.8rem',
              letterSpacing: '1px',
            }}>
              {shakeTitle}
            </h2>

            <p style={{
              fontSize: '0.75rem',
              color: textColor,
              opacity: 0.4,
              animation: 'gentleBounce 2s ease-in-out infinite',
            }}>
              or tap here ✨
            </p>
          </>
        ) : (
          /* Revealed message */
          children ? (
            <div style={{
              animation: 'messageReveal 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards',
              width: '100%',
              textAlign: 'left'
            }}>
              {children}
            </div>
          ) : (
            <div style={{
              animation: 'messageReveal 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards',
            }}>
              <div style={{
                width: '60px', height: '60px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: `0 0 30px ${accentColor}33`,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              
              <h2 style={{
                fontFamily: "'Harmond', 'Zen Old Mincho', serif",
                fontSize: '2.2rem',
                fontWeight: 400,
                fontStyle: 'italic',
                color: textColor,
                marginBottom: '0.8rem',
              }}>
                {message}
              </h2>
              
              <p style={{
                fontSize: '0.85rem',
                color: textColor,
                opacity: 0.6,
                fontStyle: 'italic',
              }}>
                {subMessage}
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}
