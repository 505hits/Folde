import dynamic from 'next/dynamic';

// Illustrated "signature" designs, keyed by their own themeId (see
// src/lib/signature-catalog.mjs). Invitations saved with a classic themeId
// never reach these components. Loaded on demand so the classic template's
// bundle is unchanged.
const suite = (id) => dynamic(() => import('./Suite').then((m) => m.makeSuite(id)));
const letter = (id) => dynamic(() => import('./LoveLetter').then((m) => m.makeLoveLetter(id)));

export const signatureDesigns = {
  mochamousse: suite('mochamousse'),
  classicburgundy: suite('classicburgundy'),
  olivebordeaux: letter('olivebordeaux'),
  burgundyivory: letter('burgundyivory'),
  brownfloral: letter('brownfloral'),
  noirfloral: letter('noirfloral'),
  photobooth: dynamic(() => import('./Photobooth')),
  twilightmeadow: dynamic(() => import('./Meadow')),
  nacre: dynamic(() => import('./Nacre')),
  jardinbrode: dynamic(() => import('./JardinBrode')),
  riviera: dynamic(() => import('./Riviera')),
};

export function resolveSignatureDesign(themeId) {
  return signatureDesigns[themeId] || null;
}
