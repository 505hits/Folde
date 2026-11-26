"use client";

// Riviera — signature design for the `royalblue` theme ("Sapphire").
// Palette-knife Mediterranean: cobalt sea, lemons, olive groves, painted tiles.

import SignatureBody from './SignatureBody';
import { mergeStyles } from './kit';
import base from './base.module.css';
import theme from './Riviera.module.css';

const s = mergeStyles(base, theme);
const dir = '/images/signature/riviera/';
const art = {
  opening: `${dir}coast.webp`,
  story: `${dir}branch.webp`,
  count: `${dir}tiles.webp`,
  icons: `${dir}icons.webp`,
  menuTop: `${dir}branch.webp`,
  finaleTop: `${dir}arch.webp`,
  finale: `${dir}grove.webp`,
};
const options = {
  fonts: 'https://fonts.googleapis.com/css2?family=Antic+Didone&family=Italianno&family=Reenie+Beanie&display=swap',
  particles: { kind: 'leaves', colors: ['#f2b8c0', '#fbe9ec', '#e98fa0', '#ffffff'], density: 0.7 },
  icons: { cols: 3, rows: 2, order: [0, 1, 3, 4, 5, 2] },
  burst: ['#2f5f9e', '#f2c94c', '#d0566e', '#ffffff'],
};

export default function Riviera({ ctx }) {
  return <SignatureBody ctx={ctx} s={s} art={art} options={options} />;
}
