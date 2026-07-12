"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

const ScratchCircle = ({ size = 100, label, revealText, color = '#c5975b', onRevealed }) => {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef(null);

  const getPos = useCallback((e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const checkRevealPercent = useCallback((ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    const percent = (transparent / (pixels.length / 4)) * 100;
    if (percent > 45 && !isRevealed) {
      setIsRevealed(true);
      onRevealed?.();
      // Clear the rest with animation
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [isRevealed, onRevealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 4;

    // Draw beautiful gradient circle
    ctx.clearRect(0, 0, w, h);
    
    // Base circle with radial gradient
    const grad = ctx.createRadialGradient(cx * 0.75, cy * 0.6, r * 0.1, cx, cy, r);
    grad.addColorStop(0, lightenColor(color, 50));
    grad.addColorStop(0.4, lightenColor(color, 20));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 20));
    
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Add shine highlight
    const shineGrad = ctx.createRadialGradient(cx * 0.65, cy * 0.55, 0, cx * 0.65, cy * 0.55, r * 0.7);
    shineGrad.addColorStop(0, 'rgba(255,255,255,0.45)');
    shineGrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = shineGrad;
    ctx.fill();

    // Subtle outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [color, size]);

  const scratch = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawingRef.current) return;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    
    ctx.globalCompositeOperation = 'destination-out';
    
    if (lastPosRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.lineWidth = 40;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalCompositeOperation = 'source-over';
    lastPosRef.current = pos;
    
    checkRevealPercent(ctx, canvas);
  }, [getPos, checkRevealPercent]);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    lastPosRef.current = getPos(e, canvas);
  }, [getPos]);

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{
        width: size, height: size, position: 'relative',
        borderRadius: '50%', overflow: 'hidden',
      }}>
        {/* Reveal text underneath */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.28, fontWeight: 700,
          fontFamily: "'Harmond', 'Zen Old Mincho', serif",
          color: '#1a1a1a',
          letterSpacing: '1px',
          transition: 'transform 0.5s ease, opacity 0.5s ease',
          transform: isRevealed ? 'scale(1)' : 'scale(0.8)',
          opacity: isRevealed ? 1 : 0.7,
        }}>
          {revealText}
        </div>
        {/* Scratch canvas on top */}
        <canvas
          ref={canvasRef}
          width={size * 2}
          height={size * 2}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            cursor: 'pointer',
            touchAction: 'none',
            borderRadius: '50%',
            transition: isRevealed ? 'opacity 0.5s ease' : 'none',
            opacity: isRevealed ? 0 : 1,
          }}
          onMouseDown={startDrawing}
          onMouseMove={scratch}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={scratch}
          onTouchEnd={stopDrawing}
        />
      </div>
      <span style={{
        fontSize: '0.65rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        fontWeight: 600,
        opacity: 0.6,
      }}>
        {label}
      </span>
    </div>
  );
};

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000FF) + Math.round(2.55 * percent));
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000FF) - Math.round(2.55 * percent));
  return `rgb(${r},${g},${b})`;
}

export default function ScratchReveal({ dateStr = 'MAY 27, 2026', accentColor = '#c5975b', bgColor = '#1a1a1a', textColor = '#fff' }) {
  const [revealedCount, setRevealedCount] = useState(0);
  const allRevealed = revealedCount >= 3;

  // Parse date
  const parts = dateStr.match(/^(\w+)\s+(\d+),?\s+(\d{4})$/);
  const month = parts ? parts[1] : 'MAY';
  const day = parts ? parts[2] : '27';
  const year = parts ? parts[3] : '2026';

  return (
    <div style={{
      background: `linear-gradient(180deg, ${bgColor}, ${adjustAlpha(bgColor, 0.95)})`,
      padding: '4rem 1.5rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative dots */}
      <div style={{ position: 'absolute', top: '12%', left: '8%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accentColor, opacity: 0.3 }} />
      <div style={{ position: 'absolute', top: '20%', right: '12%', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: accentColor, opacity: 0.2 }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '15%', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: accentColor, opacity: 0.25 }} />
      <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: '3px', height: '3px', borderRadius: '50%', backgroundColor: accentColor, opacity: 0.2 }} />

      {/* Small instruction */}
      <p style={{
        fontSize: '0.7rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: textColor,
        opacity: 0.5,
        marginBottom: '1.5rem',
        fontWeight: 500,
      }}>
        Scratch all three circles to continue
      </p>

      {/* Title */}
      <h2 style={{
        fontFamily: "'Harmond', 'Zen Old Mincho', serif",
        fontSize: '2.8rem',
        fontWeight: 400,
        fontStyle: 'italic',
        color: textColor,
        marginBottom: '0.5rem',
        letterSpacing: '1px',
      }}>
        Reveal
      </h2>

      <p style={{
        fontSize: '0.65rem',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        color: textColor,
        opacity: 0.6,
        marginBottom: '2.5rem',
        fontWeight: 500,
      }}>
        Scratch to discover the date
      </p>

      {/* Scratch Circles */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1.25rem',
        marginBottom: '2rem',
        color: textColor,
      }}>
        <ScratchCircle
          size={90}
          label="Month"
          revealText={month}
          color={accentColor}
          onRevealed={() => setRevealedCount(c => c + 1)}
        />
        <ScratchCircle
          size={90}
          label="Day"
          revealText={day}
          color={accentColor}
          onRevealed={() => setRevealedCount(c => c + 1)}
        />
        <ScratchCircle
          size={90}
          label="Year"
          revealText={year}
          color={accentColor}
          onRevealed={() => setRevealedCount(c => c + 1)}
        />
      </div>

      {/* Revealed message */}
      <div style={{
        transition: 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)',
        opacity: allRevealed ? 1 : 0,
        transform: allRevealed ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents: allRevealed ? 'auto' : 'none',
      }}>
        <p style={{
          fontSize: '0.8rem',
          color: textColor,
          opacity: 0.7,
          fontStyle: 'italic',
          letterSpacing: '1px',
        }}>
          ✨ Save the date! ✨
        </p>
      </div>
    </div>
  );
}

function adjustAlpha(hex, alpha) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xFF;
  const g = (num >> 8) & 0xFF;
  const b = num & 0xFF;
  return `rgba(${r},${g},${b},${alpha})`;
}
