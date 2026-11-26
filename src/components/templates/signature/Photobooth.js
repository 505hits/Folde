"use client";

/* eslint-disable @next/next/no-img-element */
// Ivory Photobooth — theme `photobooth`. A gilded frame hangs from a satin
// bow; when it comes into view a photo strip of the couple prints out of the
// slot, frame by frame.

import React from 'react';
import SignatureBody from './SignatureBody';
import { Reveal, mergeStyles, goToSection, paperCopy } from './kit';
import { weddingDateParts } from '@/lib/template-copy.mjs';
import base from './base.module.css';
import theme from './Photobooth.module.css';

const s = mergeStyles(base, theme);
const dir = '/images/signature/booth/';

function BoothOpening({ ctx }) {
  const { lang, partner1, partner2, showPartner2, dateStr, gallery } = ctx;
  const c = paperCopy(lang);
  const parts = weddingDateParts(dateStr, lang);
  const shots = [0, 1, 2].map((i) => gallery[i % Math.max(1, gallery.length)]).filter(Boolean);

  return (
    <section className={s.booth}>
      <Reveal variant="fade"><p className={s.boothKicker}>{c.married}</p></Reveal>
      <Reveal variant="write" delay={150} className={s.boothNames}>
        <span>{partner1}{showPartner2 && <> <em>&amp;</em> {partner2}</>}</span>
      </Reveal>

      <Reveal variant="fade" threshold={0.3} className={s.frameWrap}>
        <img className={s.bow} src={`${dir}bow.webp`} alt="" />
        <span className={s.ribbon} aria-hidden="true" />
        <div className={s.frame}>
          <div className={s.backing} />
          <span className={s.slot} aria-hidden="true" />
          <div className={s.printer}>
            <button type="button" className={s.strip} onClick={() => goToSection('gallery')}>
              {shots.map((src, i) => (
                <span key={i} className={s.frameShot} style={{ "--i": i }}><img src={src} alt="" /></span>
              ))}
              <span className={s.stripCaption}>{partner1}{showPartner2 ? ` & ${partner2}` : ''}<small>{parts.day} · {parts.month} · {parts.year}</small></span>
            </button>
          </div>
          <img className={s.frameImg} src={`${dir}frame.webp`} alt="" />
        </div>
      </Reveal>

      <Reveal variant="rise" delay={200}>
        <button type="button" className={s.openBtn} onClick={() => goToSection('sig-story')}>{c.open}</button>
      </Reveal>
    </section>
  );
}

const options = {
  fonts: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&display=swap',
  burst: ['#b79b6b', '#f4efe6', '#d9c7a4', '#ffffff'],
  creditAccent: '#9C7E4E',
};

export default function Photobooth({ ctx }) {
  return <SignatureBody ctx={ctx} s={s} art={{}} options={options} opening={<BoothOpening ctx={ctx} />} />;
}
