"use client";

// Guidance layer for the "My Invitation" tab: a progress overview, a sticky
// editor navigation and a visual design picker. It only adds navigation and
// presentation on top of the existing editor; every field stays where it was.

import React, { useEffect, useMemo, useState } from 'react';
import s from './dashboard-guide.module.css';

export const EDITOR_SECTIONS = [
  { id: 'edit-design', label: 'Design' },
  { id: 'edit-details', label: 'Names & date' },
  { id: 'edit-program', label: 'Programme' },
  { id: 'edit-photos', label: 'Photos' },
  { id: 'edit-media', label: 'Opening & music' },
  { id: 'edit-texts', label: 'Texts' },
  { id: 'edit-sections', label: 'Sections' },
];

export function jumpTo(id) {
  const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.remove(s.flash);
  // Restart the highlight so the client sees where they landed.
  void el.offsetWidth;
  el.classList.add(s.flash);
}

const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
);

/** Progress overview: what is done, what is left, and one-click access to each part. */
export function InvitationOverview({ local, templateName, thumb, previewHref, onShare }) {
  const steps = useMemo(() => {
    const isSet = (value, placeholder) => Boolean(value && String(value).trim() && String(value).trim() !== placeholder);
    return [
      { id: 'edit-design', label: 'Design chosen', done: Boolean(local.themeId) },
      { id: 'edit-details', label: 'Your names', done: isSet(local.partner1, 'Partner 1') && isSet(local.partner2, 'Partner 2') },
      { id: 'edit-details', label: 'Date & venue', done: isSet(local.date) && isSet(local.ceremonyVenue, 'Ocean front beach House') },
      { id: 'edit-program', label: 'Programme', done: Array.isArray(local.timeline) && local.timeline.length > 0 },
      { id: 'edit-photos', label: 'Your photos', done: Array.isArray(local.gallery) && local.gallery.length > 0 },
      { id: 'edit-media', label: 'Music', done: Boolean(local.sounds?.bgMusic || local.bgMusicUrl || local.musicUrl) },
      { id: 'edit-texts', label: 'Your story', done: isSet(local.storyText) },
    ];
  }, [local]);
  const done = steps.filter((step) => step.done).length;
  const percent = Math.round((done / steps.length) * 100);
  const next = steps.find((step) => !step.done);
  const circumference = 2 * Math.PI * 26;

  return (
    <section className={s.overview} aria-labelledby="overview-title">
      <div className={s.designCard}>
        <span className={s.designThumb}>{thumb}</span>
        <span className={s.designMeta}>
          <small>Current design</small>
          <strong>{templateName}</strong>
          <span className={s.designActions}>
            <button type="button" className={s.ghostBtn} onClick={() => jumpTo('edit-design')}>Change design</button>
            <a className={s.ghostBtn} href={previewHref} target="_blank" rel="noopener noreferrer">Preview</a>
          </span>
        </span>
      </div>

      <div className={s.progressCard}>
        <div className={s.progressHead}>
          <svg className={s.ring} viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="26" className={s.ringTrack} />
            <circle cx="32" cy="32" r="26" className={s.ringValue} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - percent / 100)} />
          </svg>
          <span className={s.ringLabel}><b>{percent}</b><i>%</i></span>
          <div>
            <h2 id="overview-title" className={s.progressTitle}>{percent === 100 ? 'Your invitation is ready' : 'Your invitation is taking shape'}</h2>
            <p className={s.progressText}>{percent === 100 ? 'Publish it and share the link with your guests.' : 'Complete the steps below. Every change is saved automatically.'}</p>
          </div>
        </div>
        <ol className={s.steps}>
          {steps.map((step, i) => (
            <li key={step.label}>
              <button type="button" className={s.step} data-done={step.done ? 'true' : 'false'} data-next={next === step ? 'true' : 'false'} onClick={() => jumpTo(step.id)}>
                <span className={s.stepDot}>{step.done ? <Check /> : i + 1}</span>
                <span>{step.label}</span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" className={`${s.step} ${s.stepShare}`} onClick={onShare}>
              <span className={s.stepDot}>↗</span>
              <span>Share with guests</span>
            </button>
          </li>
        </ol>
      </div>
    </section>
  );
}

/** Sticky chips that jump to each part of the editor and follow the scroll. */
export function EditorNav() {
  const [active, setActive] = useState(EDITOR_SECTIONS[0].id);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-20% 0px -65% 0px' });
    EDITOR_SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return (
    <nav className={s.editorNav} aria-label="Invitation editor">
      {EDITOR_SECTIONS.map((section, i) => (
        <button key={section.id} type="button" className={s.navChip} data-active={active === section.id ? 'true' : 'false'} onClick={() => jumpTo(section.id)}>
          <i>{i + 1}</i>{section.label}
        </button>
      ))}
    </nav>
  );
}

/** Visual design picker with filters, search and a reassuring confirmation. */
export function TemplatePicker({ templates, activeId, onApply, renderThumb }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  const filtered = templates.filter((template) => {
    if (filter === 'signature' && !template.signature) return false;
    if (filter === 'classic' && template.signature) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      return `${template.name} ${template.desc || ''}`.toLowerCase().includes(q);
    }
    return true;
  });
  const LIMIT = 8;
  let shown = expanded || query ? filtered : filtered.slice(0, LIMIT);
  const active = templates.find((template) => template.id === activeId);
  if (active && !shown.includes(active) && filtered.includes(active)) shown = [active, ...shown.slice(0, LIMIT - 1)];

  const apply = (template) => {
    if (template.id === activeId) return;
    onApply(template);
    setToast(template.name);
  };

  return (
    <div className={s.picker}>
      <div className={s.pickerHead}>
        <div>
          <h2 className={s.pickerTitle}>Invitation Design</h2>
          <p className={s.pickerText}>Switch design at any time: your names, texts, photos and guest answers are kept.</p>
        </div>
        <div className={s.pickerTools}>
          <div className={s.segmented} role="tablist" aria-label="Design family">
            {[['all', 'All designs'], ['signature', 'Signature'], ['classic', 'Classic']].map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={filter === id} data-on={filter === id ? 'true' : 'false'} onClick={() => { setFilter(id); setExpanded(false); }}>{label}</button>
            ))}
          </div>
          <label className={s.search}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a design" aria-label="Search a design" />
          </label>
        </div>
      </div>

      <div className={s.grid}>
        {shown.map((template) => {
          const isActive = template.id === activeId;
          return (
            <div key={template.id} className={s.tplCard} data-active={isActive ? 'true' : 'false'}>
              <button type="button" className={s.tplMain} onClick={() => apply(template)} aria-pressed={isActive}>
                <span className={s.tplThumb} style={{ background: `linear-gradient(145deg, ${template.color || '#E9DFD4'}, #FFF8F0)` }}>
                  {renderThumb(template)}
                  {template.signature && <span className={s.tplBadge}>✦ Signature</span>}
                  {isActive && <span className={s.tplCurrent}><Check /> Current</span>}
                </span>
                <strong className={s.tplName}>{template.name}</strong>
                <span className={s.tplDesc}>{template.desc}</span>
              </button>
              <span className={s.tplFoot}>
                {isActive ? <span className={s.tplInUse}>In use</span> : <button type="button" className={s.tplUse} onClick={() => apply(template)}>Use this design</button>}
                <a className={s.tplDemo} href={`/collections/${template.id}`} target="_blank" rel="noopener noreferrer">Demo ↗</a>
              </span>
            </div>
          );
        })}
      </div>
      {!filtered.length && <p className={s.pickerText}>No design matches this search.</p>}
      {!expanded && !query && filtered.length > LIMIT && (
        <button type="button" className={s.moreBtn} onClick={() => setExpanded(true)}>
          <span>Show all designs</span> <b>{filtered.length}</b>
        </button>
      )}

      {toast && (
        <div className={s.toast} role="status">
          <Check />
          <span><strong>Design applied</strong> <span>{toast}</span></span>
          <small>Your texts, photos and guests are kept.</small>
        </div>
      )}
    </div>
  );
}
