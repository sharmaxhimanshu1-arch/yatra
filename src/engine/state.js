import { REGIONS, REGION_BY_ID, ITEMS, COMPANIONS } from '../data/index.js';
import { seedFrom } from './rng.js';

export const SAVE_VERSION = 1;
export const STATS = ['shakti', 'buddhi', 'karuna', 'gati'];
export const STAT_NAMES = { shakti: 'Shakti', buddhi: 'Buddhi', karuna: 'Karuna', gati: 'Gati' };
export const RESOURCE_NAMES = { prana: 'Prana', pranaMax: 'Max Prana', anna: 'Anna', mudra: 'Mudra', punya: 'Punya' };
export const WATCHES = ['Dawn', 'Day', 'Dusk', 'Night'];
export const MAX_PARTY = 3;
export const MAX_ITEMS = 6;
export const STOP_TYPES = new Set(['village', 'gate']);

export function newGame({ name = 'Traveller', seed = Date.now() } = {}) {
  const first = REGIONS[0];
  const s = {
    version: SAVE_VERSION,
    name,
    seed: seedFrom(seed),
    rng: seedFrom(seed),
    regionIndex: 0,
    region: first.id,
    pos: first.start,
    lastVillage: null,
    day: 1,
    watch: 0,
    turns: 0,
    steps: 0,
    prana: 10,
    pranaMax: 10,
    anna: 6,
    mudra: 5,
    punya: 0,
    stats: { shakti: 1, buddhi: 1, karuna: 1, gati: 1 },
    inventory: ['laddoo'], // a parting gift from home
    party: [],
    waiting: [],
    used: {},
    buff: null,
    shield: false,
    chooseRoll: false,
    flags: {},
    quests: {},
    tokens: [],
    journal: { places: [], creatures: {}, friends: [], log: [] },
    seen: {},
    seenOnce: {},
    route: [first.start],
    faints: 0,
    pending: null,
    queue: null,
    ended: null,
  };
  const intro = first.nodes[first.start].card;
  if (intro) {
    s.pending = { kind: 'card', card: intro, then: null, result: null, revealNotes: [] };
    s.seenOnce[intro] = true;
  }
  return s;
}

export const regionOf = (s) => REGION_BY_ID[s.region];
export const nodeOf = (s, id = s.pos) => regionOf(s).nodes[id];
export const isNight = (s) => s.watch === 3;

export function statBonus(s, stat) {
  let bonus = 0;
  for (const id of s.inventory) bonus += ITEMS[id]?.bonus?.[stat] ?? 0;
  for (const id of s.party) bonus += COMPANIONS[id]?.bonus?.[stat] ?? 0;
  return bonus;
}

export const effectiveStat = (s, stat) => s.stats[stat] + statBonus(s, stat);

export function log(s, text) {
  s.journal.log.push({ day: s.day, region: s.region, text });
  if (s.journal.log.length > 300) s.journal.log.shift();
}

export function addPlace(s, node) {
  const key = `${s.region}:${node.id}`;
  if (s.journal.places.some((p) => p.key === key)) return false;
  s.journal.places.push({ key, region: s.region, name: node.label ?? node.id, text: node.text ?? '', day: s.day });
  return true;
}

export function meet(s, creature) {
  if (!s.journal.creatures[creature]) s.journal.creatures[creature] = 'met';
}

export const friendCount = (s) => Object.values(s.journal.creatures).filter((v) => v === 'friend').length;
