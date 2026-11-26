"use client";

// Shared motion toolkit for the "signature" (design v2) invitation bodies.
// Everything here is dependency-free and works both full-page and inside the
// scrollable phone previews (dashboard, checkout), where the scroller is an
// inner element rather than the window.

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import k from './kit.module.css';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function findScroller(node) {
  let el = node?.parentElement;
  while (el && el !== document.body && el !== document.documentElement) {
    const overflowY = getComputedStyle(el).overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) return el;
    el = el.parentElement;
  }
  return null;
}

function viewportOf(scroller) {
  if (!scroller) return { top: 0, height: window.innerHeight };
  const rect = scroller.getBoundingClientRect();
  return { top: rect.top, height: rect.height };
}

// One shared scroll/resize listener drives every scroll-linked element.
const trackers = new Set();
let frame = 0;
function flush() {
  frame = 0;
  trackers.forEach((run) => run());
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}
function subscribe(run) {
  if (trackers.size === 0) {
    document.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }
  trackers.add(run);
  schedule();
  return () => {
    trackers.delete(run);
    if (trackers.size === 0) {
      document.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', schedule);
    }
  };
}

/**
 * Writes scroll progress onto the element as CSS variables (no re-render):
 *   --p    0 → 1 while the element travels between the `from` and `to`
 *          viewport lines (fractions of the viewport height, 1 = bottom).
 *   --pin  0 → 1 while a tall element is pinned (top reached → bottom reached).
 */
export function useScrollProgress(ref, { from = 1, to = 0, onChange } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let scroller = findScroller(el);
    const rescan = () => { scroller = findScroller(el); };
    window.addEventListener('resize', rescan);
    const lateScan = window.setTimeout(rescan, 600);
    let last = -1;
    let lastPin = -1;
    const run = () => {
      const rect = el.getBoundingClientRect();
      const view = viewportOf(scroller);
      const span = rect.height + (from - to) * view.height;
      const p = span > 0 ? clamp((view.top + from * view.height - rect.top) / span) : 0;
      const pinSpan = rect.height - view.height;
      const pin = pinSpan > 0 ? clamp((view.top - rect.top) / pinSpan) : 0;
      if (Math.abs(p - last) > 0.0005) { last = p; el.style.setProperty('--p', p.toFixed(4)); }
      if (Math.abs(pin - lastPin) > 0.0005) { lastPin = pin; el.style.setProperty('--pin', pin.toFixed(4)); }
      onChange?.(p, pin);
    };
    const unsubscribe = subscribe(run);
    return () => { unsubscribe(); window.removeEventListener('resize', rescan); window.clearTimeout(lateScan); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);
}

export function Scrolly({ as: Tag = 'div', from, to, onChange, children, ...rest }) {
  const ref = useRef(null);
  useScrollProgress(ref, { from, to, onChange });
  return <Tag ref={ref} {...rest}>{children}</Tag>;
}

/** Exposes the height of the real scroll viewport as --svh (1% in px). */
export function useViewportVars(ref) {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const apply = () => {
      const view = viewportOf(findScroller(el));
      el.style.setProperty('--svh', `${(view.height / 100).toFixed(3)}px`);
    };
    apply();
    const late = window.setTimeout(apply, 600);
    window.addEventListener('resize', apply);
    return () => { window.removeEventListener('resize', apply); window.clearTimeout(late); };
  }, [ref]);
}

export function useInView({ once = true, threshold = 0.18, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); if (once) observer.disconnect(); }
      else if (!once) setInView(false);
    }, { threshold, rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);
  return [ref, inView];
}

/** Scroll-triggered entrance. `variant`: rise | fade | blur | scale | wipe | curtain | left | right. */
export function Reveal({ as: Tag = 'div', variant = 'rise', delay = 0, className = '', style, children, threshold, ...rest }) {
  const [ref, inView] = useInView({ threshold });
  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-in={inView ? 'true' : 'false'}
      className={`${k.reveal} ${className}`}
      style={{ ...style, '--d': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Headline whose letters (or words) rise in one after another. */
export function SplitText({ as: Tag = 'h2', text = '', by = 'char', variant = 'rise', className = '', unitClassName = '', style, delay = 0, stagger = 38 }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const words = useMemo(() => String(text).split(/(\s+)/), [text]);
  let index = 0;
  const unit = `${k.splitUnit} ${unitClassName}`;
  return (
    <Tag ref={ref} className={`${k.split} ${className}`} data-split={variant} data-in={inView ? 'true' : 'false'} aria-label={String(text)} style={{ ...style, '--d': `${delay}ms`, '--stagger': `${stagger}ms` }}>
      {words.map((word, w) => {
        if (/^\s+$/.test(word)) return <span key={w} aria-hidden="true"> </span>;
        if (by === 'word') {
          const i = index++;
          return <span key={w} aria-hidden="true" className={k.splitMask}><span className={unit} style={{ '--i': i }}>{word}</span></span>;
        }
        return (
          <span key={w} aria-hidden="true" className={k.splitWord}>
            {Array.from(word).map((char, c) => {
              const i = index++;
              return <span key={c} className={unit} style={{ '--i': i }}>{char}</span>;
            })}
          </span>
        );
      })}
    </Tag>
  );
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrollWords({ as: Tag = 'p', text = '', className = '' }) {
  const ref = useRef(null);
  useScrollProgress(ref, { from: 0.92, to: 0.42 });
  const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text]);
  return (
    <Tag ref={ref} className={`${k.scrollWords} ${className}`} style={{ '--n': words.length }} aria-label={String(text)}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" style={{ '--i': i }}>{word}{' '}</span>
      ))}
    </Tag>
  );
}

/** Pointer-driven 3D tilt with a light glare; floats gently on touch screens. */
export function Tilt({ className = '', max = 9, children, ...rest }) {
  const ref = useRef(null);
  const onMove = (event) => {
    const el = ref.current;
    if (!el || event.pointerType === 'touch') return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty('--ry', `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
    el.dataset.live = 'true';
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.dataset.live = 'false';
  };
  return (
    <div ref={ref} className={`${k.tilt} ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
      <span className={k.tiltGlare} aria-hidden="true" />
    </div>
  );
}

const TAU = Math.PI * 2;

/**
 * Ambient canvas layer. kind: dust (rising gold sparks) | leaves (falling,
 * swaying leaves) | pearls (slow iridescent orbs). Only animates while visible.
 */
export function Particles({ kind = 'dust', colors = ['#d8b97a'], density = 1, className = '' }) {
  const canvasRef = useRef(null);
  const colorKey = colors.join(',');
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return undefined;
    const ctx = canvas.getContext('2d');
    const palette = colorKey.split(',');
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let items = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rand = (a, b) => a + Math.random() * (b - a);

    const make = (initial) => {
      const color = palette[Math.floor(Math.random() * palette.length)];
      if (kind === 'leaves') {
        return { x: rand(0, width), y: initial ? rand(0, height) : -20, size: rand(7, 15), vy: rand(0.25, 0.7), sway: rand(0.4, 1.3), phase: rand(0, TAU), rot: rand(0, TAU), vr: rand(-0.012, 0.012), color, alpha: rand(0.35, 0.8) };
      }
      if (kind === 'pearls') {
        return { x: rand(0, width), y: rand(0, height), size: rand(26, 90), vx: rand(-0.12, 0.12), vy: rand(-0.1, 0.1), phase: rand(0, TAU), color, alpha: rand(0.1, 0.26) };
      }
      return { x: rand(0, width), y: initial ? rand(0, height) : height + 10, size: rand(0.5, 2.1), vy: rand(0.12, 0.5), drift: rand(-0.15, 0.15), phase: rand(0, TAU), speed: rand(0.008, 0.03), color, alpha: rand(0.25, 0.95) };
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const base = kind === 'leaves' ? 16 : kind === 'pearls' ? 9 : 60;
      const count = Math.round(base * density * clamp((width * height) / (420 * 700), 0.5, 2.2));
      items = Array.from({ length: count }, () => make(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const item of items) {
        item.phase += item.speed || 0.012;
        if (kind === 'leaves') {
          item.y += item.vy;
          item.x += Math.sin(item.phase) * item.sway * 0.5;
          item.rot += item.vr + Math.cos(item.phase) * 0.004;
          if (item.y > height + 24) Object.assign(item, make(false));
          ctx.save();
          ctx.translate(item.x, item.y);
          ctx.rotate(item.rot);
          ctx.scale(1, 0.55 + Math.abs(Math.sin(item.phase * 0.7)) * 0.45);
          ctx.globalAlpha = item.alpha;
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.moveTo(-item.size, 0);
          ctx.quadraticCurveTo(0, -item.size * 0.62, item.size, 0);
          ctx.quadraticCurveTo(0, item.size * 0.62, -item.size, 0);
          ctx.fill();
          ctx.restore();
        } else if (kind === 'pearls') {
          item.x += item.vx + Math.sin(item.phase) * 0.06;
          item.y += item.vy + Math.cos(item.phase * 0.8) * 0.06;
          if (item.x < -item.size) item.x = width + item.size;
          if (item.x > width + item.size) item.x = -item.size;
          if (item.y < -item.size) item.y = height + item.size;
          if (item.y > height + item.size) item.y = -item.size;
          const gradient = ctx.createRadialGradient(item.x - item.size * 0.3, item.y - item.size * 0.3, 0, item.x, item.y, item.size);
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.35, item.color);
          gradient.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.globalAlpha = item.alpha * (0.75 + Math.sin(item.phase) * 0.25);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.size, 0, TAU);
          ctx.fill();
        } else {
          item.y -= item.vy;
          item.x += item.drift + Math.sin(item.phase) * 0.12;
          if (item.y < -10) Object.assign(item, make(false));
          const twinkle = 0.35 + (Math.sin(item.phase * 2.2) + 1) * 0.325;
          ctx.globalAlpha = item.alpha * twinkle;
          ctx.fillStyle = item.color;
          ctx.shadowColor = item.color;
          ctx.shadowBlur = item.size * 5;
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.size, 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      if (running) raf = requestAnimationFrame(draw);
    };

    resize();
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      const next = entry.isIntersecting;
      if (next && !running) { running = true; raf = requestAnimationFrame(draw); }
      if (!next) { running = false; cancelAnimationFrame(raf); }
    });
    visibility.observe(canvas);
    return () => { running = false; cancelAnimationFrame(raf); resizeObserver?.disconnect(); visibility.disconnect(); };
  }, [kind, colorKey, density]);
  return <canvas ref={canvasRef} className={`${k.particles} ${className}`} aria-hidden="true" />;
}

/** One-shot celebratory burst, fired when `active` flips to true. */
export function Burst({ active, colors = ['#d8b97a', '#fff'] }) {
  const canvasRef = useRef(null);
  const colorKey = colors.join(',');
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!active || !canvas || prefersReducedMotion()) return undefined;
    const ctx = canvas.getContext('2d');
    const palette = colorKey.split(',');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pieces = Array.from({ length: 110 }, () => {
      const angle = Math.random() * TAU;
      const speed = 3 + Math.random() * 8;
      return { x: width / 2, y: height * 0.42, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 4, size: 3 + Math.random() * 5, rot: Math.random() * TAU, vr: (Math.random() - 0.5) * 0.4, color: palette[Math.floor(Math.random() * palette.length)], life: 1 };
    });
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;
      for (const piece of pieces) {
        piece.vy += 0.22;
        piece.vx *= 0.985;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rot += piece.vr;
        piece.life -= 0.009;
        if (piece.life <= 0) continue;
        alive = true;
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rot);
        ctx.globalAlpha = clamp(piece.life * 1.4);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, colorKey]);
  return <canvas ref={canvasRef} className={k.burst} aria-hidden="true" />;
}

/** Live countdown. `ready` is false until mounted so SSR and client agree. */
export function useCountdown(targetDate, targetTime) {
  const [state, setState] = useState({ ready: false, past: false, days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const time = /^\d{1,2}:\d{2}$/.test(targetTime || '') ? targetTime.padStart(5, '0') : '16:00';
    const target = targetDate ? new Date(`${targetDate}T${time}:00`) : new Date(NaN);
    const update = () => {
      const diff = target - new Date();
      if (!Number.isFinite(diff) || diff <= 0) { setState({ ready: true, past: true, days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setState({
        ready: true, past: false,
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [targetDate, targetTime]);
  return state;
}

/** Odometer-style number: each digit rolls to its new value. */
export function RollingNumber({ value = 0, pad = 2, className = '' }) {
  const digits = String(Math.max(0, value)).padStart(pad, '0').split('');
  return (
    <span className={`${k.roll} ${className}`} role="img" aria-label={String(value)}>
      {digits.map((digit, i) => (
        <span key={digits.length - i} className={k.rollCol} aria-hidden="true">
          <span className={k.rollStrip} style={{ transform: `translateY(-${Number(digit) * 10}%)` }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <span key={n}>{n}</span>)}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Progress ring used by the Pearl countdown. */
export function Ring({ value, max, className = '' }) {
  const r = 46;
  const circumference = TAU * r;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="0.8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - clamp(value / max))} transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)' }} />
    </svg>
  );
}

export function initialsOf(a, b) {
  const first = Array.from(String(a || '').trim())[0] || '';
  const second = Array.from(String(b || '').trim())[0] || '';
  return [first.toUpperCase(), second.toUpperCase()];
}

export const mapSrc = (address) => `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
export const directionsHref = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

function Choice({ s, label, value, current, onPick, options }) {
  return (
    <div className={s.field}>
      <span className={s.label} id={`rsvp-${value}`}>{label}</span>
      <div className={s.choices} role="radiogroup" aria-labelledby={`rsvp-${value}`}>
        {options.map(([optionValue, optionLabel]) => (
          <button key={optionValue} type="button" role="radio" aria-checked={current === optionValue} data-on={current === optionValue ? 'true' : 'false'} className={s.choice} onClick={() => onPick(optionValue)}>
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * RSVP form shared by every signature design. The state and submit handler
 * come from the host template, so answers are stored exactly as before; only
 * the presentation changes (`s` is the design's own CSS module).
 */
export function RsvpForm({ ctx, s, burstColors }) {
  const { copy, rsvp } = ctx;
  const clean = (label) => String(label || '').replace(' *', '');
  if (rsvp.submitted) {
    return (
      <div className={s.rsvpDone} role="status">
        <Burst active colors={burstColors} />
        <svg className={s.rsvpCheck} viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M20 33.5l8.5 8.5L45 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className={s.rsvpDoneTitle}>{copy.rsvpThankYou}, {rsvp.firstName}!</h3>
        <p className={s.rsvpDoneNote}>{copy.rsvpSubmitted}</p>
        <p className={s.rsvpDoneText}>{rsvp.attending === 'yes' ? copy.rsvpSuccessYes : copy.rsvpSuccessNo}</p>
      </div>
    );
  }

  const accompanied = rsvp.accompanied === 'plusOne' || rsvp.accompanied === 'family';
  return (
    <form className={s.form} onSubmit={rsvp.onSubmit} noValidate>
      <div className={s.fieldRow}>
        <label className={s.field}>
          <span className={s.label}>{copy.rsvpFirstName}</span>
          <input className={s.input} type="text" autoComplete="given-name" placeholder={clean(copy.rsvpFirstName)} value={rsvp.firstName} onChange={(e) => rsvp.setFirstName(e.target.value)} required />
        </label>
        <label className={s.field}>
          <span className={s.label}>{copy.rsvpLastName}</span>
          <input className={s.input} type="text" autoComplete="family-name" placeholder={clean(copy.rsvpLastName)} value={rsvp.lastName} onChange={(e) => rsvp.setLastName(e.target.value)} required />
        </label>
      </div>
      <label className={s.field}>
        <span className={s.label}>{copy.rsvpEmail}</span>
        <input className={s.input} type="email" autoComplete="email" placeholder="your@email.com" value={rsvp.email} onChange={(e) => rsvp.setEmail(e.target.value)} />
      </label>
      <Choice s={s} label={`${copy.rsvpAttendingQuestion} *`} value="attending" current={rsvp.attending} onPick={rsvp.setAttending} options={[['yes', copy.rsvpYes], ['no', copy.rsvpNo]]} />
      <Choice s={s} label={copy.rsvpFamilyQuestion} value="accompanied" current={rsvp.accompanied} onPick={rsvp.setAccompanied} options={[['alone', copy.rsvpAlone], ['plusOne', copy.rsvpPlusOneShort], ['family', copy.rsvpFamilyYes]]} />
      {accompanied && (
        <label className={`${s.field} ${s.fieldIn}`}>
          <span className={s.label}>{rsvp.accompanied === 'plusOne' ? `${copy.rsvpPlusOneName} *` : copy.rsvpFamilyNames}</span>
          <input className={s.input} type="text" placeholder={copy.rsvpPlusOneName} value={rsvp.plusOneName} onChange={(e) => rsvp.setPlusOneName(e.target.value)} />
        </label>
      )}
      <label className={s.field}>
        <span className={s.label}>{copy.allergiesLabel}</span>
        <input className={s.input} type="text" placeholder={copy.allergiesPlaceholder} value={rsvp.meal} onChange={(e) => rsvp.setMeal(e.target.value)} />
      </label>
      {rsvp.error && <p className={s.formError} role="alert">{rsvp.error}</p>}
      <button type="submit" className={s.submit} disabled={rsvp.submitting}>
        <span>{rsvp.submitting ? copy.rsvpSubmitting : copy.rsvpSubmitBtn}</span>
      </button>
    </form>
  );
}

/** Guest photo block: upload / gallery links, QR code and the shared photos. */
export function GuestPhotos({ ctx, s }) {
  const { copy, guestGallery, guestUploadUrl, guestGalleryUrl } = ctx;
  return (
    <div className={s.guest}>
      <div className={s.guestActions}>
        <a className={s.btnSolid} href={guestUploadUrl}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" /><circle cx="12" cy="13" r="3" /></svg>
          <span>{String(copy.addPhotosBtn || '').replace(/^\+\s*/, '')}</span>
        </a>
        <a className={s.btnGhost} href={guestGalleryUrl}><span>{copy.viewGalleryBtn || 'View the private gallery'}</span></a>
      </div>
      <Reveal variant="scale" className={s.qr}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${encodeURIComponent(guestUploadUrl)}`} alt={copy.qrCodeTitle} loading="lazy" />
        <p>{copy.galleryScan}</p>
      </Reveal>
      {guestGallery.length > 0 && (
        <div className={s.guestGrid}>
          {guestGallery.map((src, i) => (
            <Reveal key={src + i} variant="scale" delay={i * 70} className={s.guestShot}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${copy.guestGalleryTitle} ${i + 1}`} loading="lazy" />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

export function FoldeBadge({ className }) {
  return (
    <a className={className} href="https://folde-wedding.com" target="_blank" rel="noopener noreferrer">
      <i aria-hidden="true" /><span>FOLDÈ Design</span><i aria-hidden="true" />
    </a>
  );
}

/** Combines the shared stylesheet with a design's own (both CSS modules). */
export function mergeStyles(base, theme) {
  const merged = { ...base };
  for (const key of Object.keys(theme)) merged[key] = base[key] ? `${base[key]} ${theme[key]}` : theme[key];
  // A class neither stylesheet defines resolves to '' rather than "undefined".
  return new Proxy(merged, { get: (target, key) => (typeof key === 'string' && !(key in target) ? '' : target[key]) });
}

/** Smoothly brings a section of the invitation into view (works inside phone previews too). */
export function goToSection(id) {
  if (typeof document === 'undefined') return;
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

const PAPER_COPY = {
  en: { celebrating: 'Celebrating the love of', and: 'and', details: 'Details', tap: 'Tap here', rsvp: 'RSVP', kindly: 'Kindly', here: 'here', story: 'Our story', view: 'Tap to view', withLove: 'With love', saveDate: 'Save our date', until: 'Until forever…', follow: 'Formal invitation to follow…', listen: 'Tap to listen', pause: 'Tap to pause', married: 'We’re getting married!', open: 'Open invitation', loveLetter: 'A love letter from', weddingOf: 'The wedding of', saidYes: 'We said yes', at: 'at', join: 'Join us' },
  fr: { celebrating: 'Nous célébrons l’amour de', and: 'et', details: 'Infos', tap: 'Touchez ici', rsvp: 'RSVP', kindly: 'Répondez', here: 'ici', story: 'Notre histoire', view: 'Touchez pour voir', withLove: 'Avec amour', saveDate: 'Réservez la date', until: 'Pour toujours…', follow: 'Le faire-part suivra…', listen: 'Touchez pour écouter', pause: 'Touchez pour couper', married: 'On se marie !', open: 'Ouvrir l’invitation', loveLetter: 'Une lettre d’amour de', weddingOf: 'Le mariage de', saidYes: 'Nous avons dit oui', at: 'à', join: 'Rejoignez-nous' },
  es: { celebrating: 'Celebramos el amor de', and: 'y', details: 'Detalles', tap: 'Toca aquí', rsvp: 'RSVP', kindly: 'Confirma', here: 'aquí', story: 'Nuestra historia', view: 'Toca para ver', withLove: 'Con amor', saveDate: 'Reserva la fecha', until: 'Para siempre…', follow: 'La invitación formal llegará…', listen: 'Toca para escuchar', pause: 'Toca para pausar', married: '¡Nos casamos!', open: 'Abrir invitación', loveLetter: 'Una carta de amor de', weddingOf: 'La boda de', saidYes: 'Dijimos que sí', at: 'a las', join: 'Acompáñanos' },
};
export const paperCopy = (lang) => PAPER_COPY[lang] || PAPER_COPY.en;

/** Month grid (weeks starting Monday) for the calendar cards. */
export function monthGrid(targetDate) {
  const date = targetDate ? new Date(`${targetDate}T12:00:00Z`) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const first = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return { cells, day: date.getUTCDate() };
}
