"use client";

/* eslint-disable @next/next/no-img-element */
// Suite — a wedding stationery flat-lay (themes `mochamousse` and
// `classicburgundy`). Every paper object drops onto the table as you scroll
// and opens the matching part of the invitation when tapped.

import React from 'react';
import SignatureBody from './SignatureBody';
import { Reveal, mergeStyles, goToSection, paperCopy, monthGrid, initialsOf } from './kit';
import { weddingDateParts } from '@/lib/template-copy.mjs';
import base from './base.module.css';
import theme from './Suite.module.css';

const s = mergeStyles(base, theme);
const dir = '/images/signature/';

const PALETTES = {
  mochamousse: {
    palette: 'mocha',
    envelope: `${dir}suite/mocha-envelope.webp`, flowers: `${dir}suite/mocha-flowers.webp`, bow: `${dir}suite/mocha-bow.webp`,
    seal: `${dir}props/seal-gold.webp`, rsvp: `${dir}suite/mocha-coaster.webp`, line: `${dir}suite/mocha-champagne.webp`, paper: `${dir}suite/mocha-paper.webp`,
    burst: ['#c9a46a', '#5a3d2b', '#efe6d8', '#a9714a'], accent: '#5A3D2B',
  },
  classicburgundy: {
    palette: 'burgundy',
    envelope: `${dir}suite/burgundy-envelope.webp`, flowers: `${dir}suite/burgundy-flowers.webp`, bow: `${dir}suite/burgundy-bow.webp`,
    seal: `${dir}props/seal-burgundy.webp`, frame: `${dir}suite/burgundy-frame.webp`, tray: `${dir}suite/burgundy-tray.webp`, line: `${dir}suite/burgundy-cake.webp`,
    burst: ['#6b1626', '#f3e9e4', '#c9a6a0', '#ffffff'], accent: '#6B1626',
  },
};

function Calendar({ targetDate, parts, lang }) {
  const grid = monthGrid(targetDate);
  const heads = { en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], fr: ['L', 'M', 'M', 'J', 'V', 'S', 'D'], es: ['L', 'M', 'X', 'J', 'V', 'S', 'D'] }[lang] || ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div className={s.calendar}>
      <p className={s.calTitle}>{parts.month} {parts.year}</p>
      {grid && (
        <div className={s.calGrid}>
          {heads.map((h, i) => <b key={`h${i}`}>{h}</b>)}
          {grid.cells.map((d, i) => (
            <span key={i} data-on={d === grid.day ? 'true' : 'false'}>
              {d || ''}
              {d === grid.day && <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4C30 4 36 10 36 20S29 36 19 36 4 29 4 19 11 5 22 5" /></svg>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SuiteOpening({ ctx, kit }) {
  const { lang, partner1, partner2, showPartner2, dateStr, targetDate, ceremonyVenue, gallery, t } = ctx;
  const c = paperCopy(lang);
  const parts = weddingDateParts(dateStr, lang);
  const [a, b] = initialsOf(partner1, showPartner2 ? partner2 : '');
  const burgundy = kit.palette === 'burgundy';
  const photo1 = gallery[0];
  const photo2 = gallery[1] || gallery[0];

  return (
    <section className={s.table} data-palette={kit.palette} style={kit.paper ? { '--paper': `url(${kit.paper})` } : undefined}>
      {/* 1 — the open envelope, its card slides up out of the pocket */}
      <Reveal variant="place" className={s.envelope} style={{ '--rot': '-2deg' }}>
        <img className={s.envelopeImg} src={kit.envelope} alt="" />
        <div className={s.pocketClip}>
          <div className={s.letter}>
            <p className={s.letterKicker}>{burgundy ? c.weddingOf : c.saidYes}</p>
            <p className={s.letterNames}>{partner1}{showPartner2 && <><em>&amp;</em>{partner2}</>}</p>
          </div>
        </div>
        <span className={s.envelopeSeal} style={{ backgroundImage: `url(${kit.seal})` }}><i>{a}{b && <em>&amp;</em>}{b}</i></span>
        <img className={`${s.flowers} ${s.flowersEnvelope}`} src={kit.flowers} alt="" />
      </Reveal>

      {/* 2 — names card + date card */}
      <div className={s.row}>
        <Reveal variant="place" delay={120} className={s.namesCard} style={{ '--rot': '-4deg' }}>
          <button type="button" onClick={() => goToSection('sig-story')}>
            <small>{c.celebrating}</small>
            <strong>{partner1}</strong>
            {showPartner2 && <><em>{c.and}</em><strong>{partner2}</strong></>}
          </button>
        </Reveal>
        <Reveal variant="place" delay={240} className={s.dateCard} style={{ '--rot': '3deg' }}>
          <button type="button" onClick={() => goToSection('sig-count')}>
            {burgundy ? <Calendar targetDate={targetDate} parts={parts} lang={lang} /> : (
              <span className={s.bigDate}><strong>{parts.day}</strong><span>{parts.month}</span><small>{parts.year}</small></span>
            )}
            <span className={s.twine} aria-hidden="true" />
            <span className={s.dateSeal} style={{ backgroundImage: `url(${kit.seal})` }}><i>{a}</i></span>
            <span className={s.dateMeta}>{t.time ? `${t.time} · ` : ''}{ceremonyVenue}</span>
          </button>
        </Reveal>
      </div>

      {/* 3 — details card with a bow + RSVP */}
      <div className={s.row}>
        <Reveal variant="place" delay={120} className={s.detailsCard} style={{ '--rot': '2deg' }}>
          <button type="button" onClick={() => goToSection('sig-venue')}>
            <strong>{c.details}</strong>
            <small>{c.tap}</small>
            <img className={s.bow} src={kit.bow} alt="" />
          </button>
        </Reveal>
        <Reveal variant="place" delay={260} className={burgundy ? s.trayRsvp : s.coasterRsvp} style={{ '--rot': burgundy ? '-3deg' : '-6deg' }}>
          <button type="button" onClick={() => goToSection('rsvp')}>
            {burgundy ? <img className={s.tray} src={kit.tray} alt="" /> : <img className={s.coaster} src={kit.rsvp} alt="" />}
            <span className={s.rsvpText}>
              <small>{c.kindly}</small>
              <strong>{c.rsvp}</strong>
              <small>{c.here}</small>
            </span>
          </button>
        </Reveal>
      </div>

      {/* 4 — photographs */}
      <div className={`${s.row} ${s.photoRow}`}>
        {burgundy ? (
          <Reveal variant="place" delay={100} className={s.ovalFrame} style={{ '--rot': '-3deg' }}>
            <button type="button" onClick={() => goToSection('gallery')}>
              {photo1 && <img className={s.ovalPhoto} src={photo1} alt="" />}
              <img className={s.ovalImg} src={kit.frame} alt="" />
            </button>
          </Reveal>
        ) : (
          <Reveal variant="place" delay={100} className={s.polaroid} style={{ '--rot': '-5deg' }}>
            <button type="button" onClick={() => goToSection('gallery')}>
              {photo1 && <img src={photo1} alt="" />}
              <small>{c.view}</small>
            </button>
          </Reveal>
        )}
        <Reveal variant="place" delay={240} className={s.polaroid} style={{ '--rot': '4deg' }}>
          <button type="button" onClick={() => goToSection('sig-story')}>
            {photo2 && <img src={photo2} alt="" />}
            <strong>{c.story}</strong>
          </button>
        </Reveal>
        <img className={`${s.flowers} ${s.flowersPhotos}`} src={kit.flowers} alt="" />
      </div>

      {/* 5 — the line drawing */}
      <div className={s.signoff}>
        <Reveal variant="wipe" className={s.lineArt}><img src={kit.line} alt="" /></Reveal>
        <Reveal variant="fade" delay={200}><p className={s.withLove}>{c.withLove}</p></Reveal>
        <Reveal variant="write" delay={300} className={s.signNames}><span>{partner1}{showPartner2 ? ` & ${partner2}` : ''}</span></Reveal>
      </div>
    </section>
  );
}

export function makeSuite(themeId) {
  const kit = PALETTES[themeId];
  const burgundy = kit.palette === 'burgundy';
  const options = {
    fonts: burgundy
      ? 'https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Montserrat:wght@400;500&display=swap'
      : 'https://fonts.googleapis.com/css2?family=Italiana&family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Montserrat:wght@400;500&display=swap',
    burst: kit.burst,
    creditAccent: kit.accent,
  };
  const art = { flowers: kit.flowers };
  function SuiteDesign({ ctx }) {
    return (
      <div className={s.paletteScope} data-palette={kit.palette}>
        <SignatureBody ctx={ctx} s={s} art={art} options={options} opening={<SuiteOpening ctx={ctx} kit={kit} />} />
      </div>
    );
  }
  SuiteDesign.displayName = `Suite(${themeId})`;
  return SuiteDesign;
}
