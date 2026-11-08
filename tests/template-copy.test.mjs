import test from 'node:test';import assert from 'node:assert/strict';
import {localizedSignature,templateCopy,weddingDateLabel,weddingDateParts,localizedStockLabel} from '../src/lib/template-copy.mjs';
import {TRANSLATIONS} from '../src/lib/translations.js';
import {guestPhotoCopy} from '../src/lib/guest-photo-copy.mjs';
import {readFileSync} from 'node:fs';
test('every signature design uses the chosen default language without changing custom data',()=>{
 for(const mode of ['dark','lined','sun','editorial','arched'])for(const language of ['fr','es','it','de','pt','nl','ar','ru']){
  const result=localizedSignature({mode,storyTitle:'English title',eyebrow:'Atelier de mariage'},language);
  for(const key of ['storyTitle','storyText','introTitle','introText','venueTitle','scheduleTitle','menuTitle','galleryTitle','giftTitle','giftText'])assert.equal(result[key],templateCopy[language][key]);assert.equal(result.mode,mode);
 }
 assert.equal(localizedSignature({eyebrow:'Atelier de mariage'},'en').eyebrow,'Wedding atelier');
 assert.match(weddingDateLabel('MAY 23, 2027','fr'),/mai/);
});
test('every invitation UI label and gallery message exists in every supported language',()=>{
 const source=readFileSync(new URL('../src/components/templates/BordeauxTemplate.js',import.meta.url),'utf8');
 const keys=[...new Set([...source.matchAll(/copy\.([A-Za-z]+)/g)].map(m=>m[1]))].filter(key=>key!=='mjs');
 for(const [language,copy] of Object.entries(TRANSLATIONS)){
  for(const key of keys)assert.ok(copy[key],`${language}: ${key}`);
  for(const key of Object.keys(guestPhotoCopy.en))assert.ok(guestPhotoCopy[language][key],`${language}: gallery ${key}`);
  for(const key of Object.keys(templateCopy.en))assert.ok(templateCopy[language][key],`${language}: template ${key}`);
 }
});
test('dates accept ISO values and stock translations never change custom text',()=>{
 assert.equal(weddingDateParts('2027-05-23','fr').month,'mai');
 assert.equal(weddingDateParts('not a date','fr').day,'—');
 assert.equal(localizedStockLabel('Ceremony','fr','event'),'Cérémonie');
 assert.equal(localizedStockLabel('Our beach ceremony','fr','event'),'Our beach ceremony');
 assert.equal(localizedStockLabel('Starter','es','course'),'Entrante');
});
