import test from 'node:test';import assert from 'node:assert/strict';
import {localizedSignature,templateCopy,weddingDateLabel} from '../src/lib/template-copy.mjs';
test('every signature design uses the chosen default language without changing custom data',()=>{
 for(const mode of ['dark','lined','sun','editorial','arched'])for(const language of ['fr','es']){
  const result=localizedSignature({mode,storyTitle:'English title',eyebrow:'Atelier de mariage'},language);
  for(const key of ['storyTitle','storyText','introTitle','introText','venueTitle','scheduleTitle','menuTitle','galleryTitle','giftTitle','giftText'])assert.equal(result[key],templateCopy[language][key]);assert.equal(result.mode,mode);
 }
 assert.equal(localizedSignature({eyebrow:'Atelier de mariage'},'en').eyebrow,'Wedding atelier');
 assert.match(weddingDateLabel('MAY 23, 2027','fr'),/mai/);
});
