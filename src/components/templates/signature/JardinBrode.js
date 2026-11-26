"use client";

// Jardin Brodé — signature design for the `sage` theme ("Olive Grove").
// Hand-embroidered linen: wisteria, doves, roses and strings of pearls.

import SignatureBody from './SignatureBody';
import { mergeStyles } from './kit';
import base from './base.module.css';
import theme from './JardinBrode.module.css';

const s = mergeStyles(base, theme);
const dir = '/images/signature/brode/';
const art = {
  opening: `${dir}curtain.webp`,
  story: `${dir}wisteria.webp`,
  countTop: `${dir}doves.webp`,
  count: `${dir}frame.webp`,
  scheduleTop: `${dir}garland.webp`,
  rsvpTop: `${dir}garland.webp`,
  finale: `${dir}manor.webp`,
};
const options = {
  fonts: 'https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;1,400&display=swap',
  burst: ['#c98b95', '#8a9a7b', '#a78bb5', '#f3ede2'],
};

export default function JardinBrode({ ctx }) {
  return <SignatureBody ctx={ctx} s={s} art={art} options={options} />;
}
