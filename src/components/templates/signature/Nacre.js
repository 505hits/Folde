"use client";

// Nacre — signature design for the `ivory` theme ("Pearl").
// Sculpted plaster relief, mother-of-pearl and a champagne wax seal.

import SignatureBody from './SignatureBody';
import { mergeStyles } from './kit';
import base from './base.module.css';
import theme from './Nacre.module.css';

const s = mergeStyles(base, theme);
const dir = '/images/signature/nacre/';
const art = {
  opening: `${dir}relief-portrait.webp`,
  shell: `${dir}shell.webp`,
  count: `${dir}plaque.webp`,
  scheduleTop: `${dir}swag.webp`,
  dress: `${dir}attire.webp`,
  finale: `${dir}seal.webp`,
};
const options = {
  fonts: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400&family=Monsieur+La+Doulaise&display=swap',
  particles: { kind: 'pearls', colors: ['#f4dcd6', '#d9e6ee', '#f1e6c8', '#ffffff'], density: 0.8 },
  burst: ['#c7a56e', '#f3ead9', '#8fa0b3', '#ffffff'],
};

export default function Nacre({ ctx }) {
  return <SignatureBody ctx={ctx} s={s} art={art} options={options} />;
}
