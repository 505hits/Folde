"use client";

/* eslint-disable @next/next/no-img-element */
// Love Letter — an open envelope spilling its contents: the save-the-date
// card, two polaroids and a vinyl that plays the couple's song.
// Four palettes: olivebordeaux, burgundyivory, brownfloral, noirfloral.

import React from 'react';
import SignatureBody from './SignatureBody';
import { Reveal, RollingNumber, mergeStyles, goToSection, paperCopy, initialsOf, useCountdown } from './kit';
import { weddingDateParts } from '@/lib/template-copy.mjs';
import base from './base.module.css';
import theme from './LoveLetter.module.css';

const s = mergeStyles(base, theme);
const dir = '/images/signature/';

const PALETTES = {
  olivebordeaux: { palette: 'olive', pocket: 'pocket-olive', seal: 'seal-burgundy', flowers: 'flowers-calla', accent: '#55602F', burst: ['#55602F', '#6b1626', '#f3efe6', '#ffffff'] },
  burgundyivory: { palette: 'burgundy', pocket: 'pocket-burgundy', seal: 'seal-burgundy', flowers: 'flowers-calla', accent: '#5A1420', burst: ['#5a1420', '#f6efe8', '#c99a9f', '#ffffff'] },
  brownfloral: { palette: 'brown', pocket: 'pocket-brown', seal: 'seal-gold', flowers: 'flowers-brown', accent: '#5B3B25', burst: ['#5b3b25', '#c9a46a', '#f5ede2', '#ffffff'] },
  noirfloral: { palette: 'noir', pocket: 'pocket-black', seal: 'seal-black', flowers: 'flowers-noir', accent: '#1C1C1C', burst: ['#1c1c1c', '#ffffff', '#9a9a9a', '#e9e5df'] },
};

const two = (n) => String(n).padStart(2, '0');

function LetterOpening({ ctx, kit }) {
  const { lang, partner1, partner2, showPartner2, dateStr, targetDate, ceremonyVenue, receptionVenue, gallery, t, music } = ctx; // eslint-disable-line no-unused-vars
  const c = paperCopy(lang);
  const parts = weddingDateParts(dateStr, lang);
  const countdown = useCountdown(targetDate, t.time);
  const [a, b] = initialsOf(partner1, showPartner2 ? partner2 : '');
  const shortDate = (() => {
    const d = targetDate ? new Date(`${targetDate}T12:00:00Z`) : null;
    return d && !Number.isNaN(d.getTime()) ? `${two(d.getUTCDate())}.${two(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}` : `${parts.day} ${parts.month} ${parts.year}`;
  })();
  const playing = Boolean(music?.playing);
  const place = ceremonyVenue || receptionVenue;

  return (
    <section className={s.letterScene} data-palette={kit.palette}>
      <Reveal variant="fade" className={s.sceneHead}>
        <p className={s.kickerSmall}>{c.loveLetter}</p>
        <p className={s.sceneNames}>{partner1}{showPartner2 && <> <em>&amp;</em> {partner2}</>}</p>
      </Reveal>

      <Reveal variant="fade" threshold={0.25} className={s.stage}>
        {/* contents rising out of the pocket */}
        <div className={s.contents}>
          <button type="button" className={s.saveCard} onClick={() => goToSection('sig-story')}>
            <span className={s.saveInner}>
              <small>{c.saveDate}</small>
              <strong>{partner1}</strong>
              {showPartner2 && <><em>&amp;</em><strong>{partner2}</strong></>}
              <b>{shortDate}</b>
            </span>
          </button>
          {gallery[0] && <button type="button" className={`${s.snap} ${s.snapOne}`} onClick={() => goToSection('gallery')}><img src={gallery[0]} alt="" /></button>}
          {gallery[1] && <button type="button" className={`${s.snap} ${s.snapTwo}`} onClick={() => goToSection('gallery')}><img src={gallery[1]} alt="" /></button>}
          <button
            type="button"
            className={s.vinyl}
            data-playing={playing ? 'true' : 'false'}
            onClick={() => (music?.available ? music.toggle() : goToSection('sig-schedule'))}
            aria-label={playing ? c.pause : c.listen}
          >
            <span className={s.disc}><span className={s.vinylLabel}><i>{a}{b && `·${b}`}</i></span></span>
            <span className={s.vinylText}>{playing ? c.pause : c.listen}</span>
          </button>
        </div>
        <img className={s.pocket} src={`${dir}letter/${kit.pocket}.webp`} alt="" />
        <span className={s.seal} style={{ backgroundImage: `url(${dir}props/${kit.seal}.webp)` }}><i>{a}{b && <em>&amp;</em>}{b}</i></span>
        <img className={`${s.flowers} ${s.flowersLeft}`} src={`${dir}letter/${kit.flowers}.webp`} alt="" />
        <img className={`${s.flowers} ${s.flowersRight}`} src={`${dir}letter/${kit.flowers}.webp`} alt="" />
      </Reveal>

      <div className={s.until}>
        <Reveal variant="fade"><p className={s.kickerSmall}>{c.until}</p></Reveal>
        {!countdown.past && (
          <Reveal variant="rise" delay={150} className={s.clock}>
            {['days', 'hours', 'minutes', 'seconds'].map((key, i) => (
              <React.Fragment key={key}>
                {i > 0 && <span className={s.colon}>:</span>}
                <span className={s.clockCell}>
                  <RollingNumber value={countdown[key]} pad={key === 'days' ? Math.max(2, String(countdown[key]).length) : 2} className={s.clockNum} />
                  <small>{ctx.labels[key]}</small>
                </span>
              </React.Fragment>
            ))}
          </Reveal>
        )}
        <Reveal variant="rise" delay={250}><p className={s.place}>{place}</p></Reveal>
        <Reveal variant="write" delay={350} className={s.follow}><span>{c.follow}</span></Reveal>
        <Reveal variant="rise" delay={450}>
          <button type="button" className={s.outline} onClick={() => goToSection('rsvp')}>{c.rsvp} · {c.join}</button>
        </Reveal>
      </div>

      <div className={s.monogramBand}>
        <Reveal variant="scale" className={s.monogram}><span>{a}</span><span>{b}</span></Reveal>
      </div>
    </section>
  );
}

export function makeLoveLetter(themeId) {
  const kit = PALETTES[themeId];
  const options = {
    fonts: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Courier+Prime&display=swap',
    burst: kit.burst,
    skipCount: true,
    creditAccent: kit.accent,
  };
  function LoveLetterDesign({ ctx }) {
    return (
      <div className={s.paletteScope} data-palette={kit.palette}>
        <SignatureBody ctx={ctx} s={s} art={{}} options={options} opening={<LetterOpening ctx={ctx} kit={kit} />} />
      </div>
    );
  }
  LoveLetterDesign.displayName = `LoveLetter(${themeId})`;
  return LoveLetterDesign;
}
