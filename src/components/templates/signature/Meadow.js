"use client";

// Twilight Meadow — theme `twilightmeadow`. An oil-painted wildflower meadow
// at golden hour, soft sage ink and an italic serif.

import SignatureBody from './SignatureBody';
import { mergeStyles } from './kit';
import base from './base.module.css';
import theme from './Meadow.module.css';

const s = mergeStyles(base, theme);
const dir = '/images/signature/meadow/';
const art = {
  opening: `${dir}scene.webp`,
  count: `${dir}vignette.webp`,
  scheduleTop: `${dir}strip.webp`,
  rsvpTop: `${dir}strip.webp`,
};
const options = {
  fonts: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@400;500;600&display=swap',
  particles: { kind: 'dust', colors: ['#fff6d8', '#f2dc9b', '#ffffff'], density: 0.6 },
  burst: ['#6f7a4b', '#f2dc9b', '#b8a6d9', '#ffffff'],
  creditAccent: '#6F7A4B',
};

export default function Meadow({ ctx }) {
  return <SignatureBody ctx={ctx} s={s} art={art} options={options} />;
}
