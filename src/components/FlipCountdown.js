"use client";

import React, { useState, useEffect } from 'react';

const FlipCard = ({ value, label, accentColor }) => {
  const display = String(value).padStart(2, '0');
  const [prev, setPrev] = useState(display);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (display !== prev) {
      setFlipping(true);
      const t = setTimeout(() => {
        setPrev(display);
        setFlipping(false);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [display, prev]);

  const cardStyle = {
    position: 'relative',
    width: '56px',
    height: '70px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  };

  const digitStyle = {
    fontSize: '2.6rem',
    fontWeight: 700,
    fontFamily: "'Inter', 'SF Mono', monospace",
    color: '#fff',
    lineHeight: '70px',
    textAlign: 'center',
    width: '100%',
    position: 'absolute',
    left: 0,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={cardStyle}>
        {/* Top half */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(180deg, #2a2a2a, #222)',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(0,0,0,0.3)',
        }}>
          <span style={{ ...digitStyle, top: 0 }}>{display}</span>
        </div>
        {/* Bottom half */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(180deg, #1e1e1e, #1a1a1a)',
          overflow: 'hidden',
        }}>
          <span style={{ ...digitStyle, bottom: 0 }}>{display}</span>
        </div>

        {/* Flip animation overlay */}
        {flipping && (
          <>
            {/* Top flap falling (shows old number) */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
              background: 'linear-gradient(180deg, #2a2a2a, #222)',
              overflow: 'hidden',
              transformOrigin: 'bottom center',
              animation: 'flipTop 0.5s ease-in forwards',
              zIndex: 2,
              borderRadius: '8px 8px 0 0',
            }}>
              <span style={{ ...digitStyle, top: 0 }}>{prev}</span>
            </div>
            {/* Bottom flap rising (shows new number) */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
              background: 'linear-gradient(180deg, #1e1e1e, #1a1a1a)',
              overflow: 'hidden',
              transformOrigin: 'top center',
              animation: 'flipBottom 0.5s ease-out 0.25s forwards',
              zIndex: 2,
              borderRadius: '0 0 8px 8px',
              transform: 'rotateX(90deg)',
            }}>
              <span style={{ ...digitStyle, bottom: 0 }}>{display}</span>
            </div>
          </>
        )}

        {/* Center line */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: '1px',
          background: 'rgba(0,0,0,0.5)', zIndex: 3, transform: 'translateY(-0.5px)',
        }} />
      </div>
      <span style={{
        fontSize: '0.55rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        fontWeight: 600,
        opacity: 0.5,
        color: accentColor || '#c5975b',
      }}>{label}</span>
    </div>
  );
};

export default function FlipCountdown({ targetDate = '2026-05-27', accentColor = '#c5975b', bgColor = '#0f0f0f', textColor = '#fff' }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate + 'T14:00:00');

    const update = () => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        setIsPast(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setIsPast(false);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <>
      <style>{`
        @keyframes flipTop {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        @keyframes flipBottom {
          0% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
        @keyframes countdownPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      <div style={{
        background: bgColor,
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative line */}
        <div style={{
          width: '40px', height: '1px',
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          margin: '0 auto 1.5rem',
        }} />

        <p style={{
          fontSize: '0.65rem',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: textColor,
          opacity: 0.5,
          marginBottom: '0.8rem',
          fontWeight: 500,
        }}>
          {isPast ? 'The day has arrived' : 'Counting down to'}
        </p>

        <h2 style={{
          fontFamily: "'Harmond', 'Zen Old Mincho', serif",
          fontSize: '2.2rem',
          fontWeight: 400,
          fontStyle: 'italic',
          color: textColor,
          marginBottom: '2rem',
          letterSpacing: '1px',
        }}>
          {isPast ? '✨ Today is the Day ✨' : 'Our Forever'}
        </h2>

        {!isPast && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            alignItems: 'flex-start',
            color: textColor,
          }}>
            <FlipCard value={timeLeft.days} label="Days" accentColor={accentColor} />
            <div style={{
              display: 'flex', alignItems: 'center', height: '70px',
              fontSize: '1.5rem', color: accentColor, fontWeight: 700,
              animation: 'countdownPulse 1s ease-in-out infinite',
            }}>:</div>
            <FlipCard value={timeLeft.hours} label="Hours" accentColor={accentColor} />
            <div style={{
              display: 'flex', alignItems: 'center', height: '70px',
              fontSize: '1.5rem', color: accentColor, fontWeight: 700,
              animation: 'countdownPulse 1s ease-in-out infinite',
            }}>:</div>
            <FlipCard value={timeLeft.minutes} label="Min" accentColor={accentColor} />
            <div style={{
              display: 'flex', alignItems: 'center', height: '70px',
              fontSize: '1.5rem', color: accentColor, fontWeight: 700,
              animation: 'countdownPulse 1s ease-in-out infinite',
            }}>:</div>
            <FlipCard value={timeLeft.seconds} label="Sec" accentColor={accentColor} />
          </div>
        )}

        {isPast && (
          <p style={{
            fontSize: '1rem',
            color: accentColor,
            fontStyle: 'italic',
            fontFamily: "'Harmond', 'Zen Old Mincho', serif",
          }}>
            Let the celebration begin 🥂
          </p>
        )}

        {/* Bottom decorative line */}
        <div style={{
          width: '40px', height: '1px',
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          margin: '2rem auto 0',
        }} />
      </div>
    </>
  );
}
