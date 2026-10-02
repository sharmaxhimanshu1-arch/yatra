import { layoutRegion } from '../engine/layout.js';
import ganga from './regions/ganga.js';
import dandaka from './regions/dandaka.js';
import maru from './regions/maru.js';
import coast from './regions/coast.js';
import himalaya from './regions/himalaya.js';
import meru from './regions/meru.js';
import gangaCards from './cards/ganga.js';
import dandakaCards from './cards/dandaka.js';
import maruCards from './cards/maru.js';
import coastCards from './cards/coast.js';
import himalayaCards from './cards/himalaya.js';
import meruCards from './cards/meru.js';
import anyCards from './cards/any.js';

export { ITEMS, FOOD } from './items.js';
export { CREATURES } from './creatures.js';
export { COMPANIONS } from './companions.js';
export { QUESTS, TOKENS, ENDINGS } from './quests.js';

// The journey, in order. Each region is one board.
export const REGIONS = [ganga, dandaka, maru, coast, himalaya, meru].map(layoutRegion);
export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r]));

const tag = (region, cards) => cards.map((c) => ({ region, ...c }));
export const CARD_LIST = [
  ...tag('ganga', gangaCards),
  ...tag('dandaka', dandakaCards),
  ...tag('maru', maruCards),
  ...tag('coast', coastCards),
  ...tag('himalaya', himalayaCards),
  ...tag('meru', meruCards),
  ...tag('any', anyCards),
];

export const CARDS = {};
export const CARDS_BY_DECK = {};
for (const c of CARD_LIST) {
  if (CARDS[c.id]) throw new Error(`Duplicate card id "${c.id}"`);
  CARDS[c.id] = c;
  (CARDS_BY_DECK[c.deck] ??= []).push(c);
}
