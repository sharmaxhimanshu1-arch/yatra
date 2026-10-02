import { ITEMS, COMPANIONS, QUESTS } from '../data/index.js';
import { effectiveStat, isNight, friendCount, STAT_NAMES } from './state.js';

const asList = (v) => (Array.isArray(v) ? v : [v]);

// Each key is one requirement; a condition object passes when every key passes.
const CHECKS = {
  flag: (s, v) => asList(v).every((f) => s.flags[f]),
  notFlag: (s, v) => asList(v).every((f) => !s.flags[f]),
  hasItem: (s, v) => asList(v).every((i) => s.inventory.includes(i)),
  notItem: (s, v) => asList(v).every((i) => !s.inventory.includes(i)),
  companion: (s, v) => asList(v).every((c) => s.party.includes(c)),
  notCompanion: (s, v) => asList(v).every((c) => !s.party.includes(c) && !s.waiting.includes(c)),
  prana: (s, v) => s.prana >= v,
  anna: (s, v) => s.anna >= v,
  mudra: (s, v) => s.mudra >= v,
  punya: (s, v) => s.punya >= v,
  stat: (s, v) => Object.entries(v).every(([k, n]) => effectiveStat(s, k) >= n),
  night: (s, v) => isNight(s) === v,
  quest: (s, v) => asList(v).every((q) => s.quests[q] && !s.quests[q].done),
  questDone: (s, v) => asList(v).every((q) => s.quests[q]?.done),
  notQuest: (s, v) => asList(v).every((q) => !s.quests[q]),
  tokens: (s, v) => s.tokens.length >= v,
  party: (s, v) => s.party.length >= v,
  friends: (s, v) => friendCount(s) >= v,
  befriended: (s, v) => asList(v).every((c) => s.journal.creatures[c] === 'friend'),
  region: (s, v) => asList(v).includes(s.region),
  any: (s, v) => v.some((c) => check(s, c)),
};

export const CONDITION_KEYS = Object.keys(CHECKS);

export function check(s, cond) {
  if (!cond) return true;
  return Object.entries(cond).every(([k, v]) => {
    const fn = CHECKS[k];
    if (!fn) throw new Error(`Unknown condition "${k}"`);
    return fn(s, v);
  });
}

// Short, player-facing reason for a failed requirement ("Needs Rope", "Needs 3 Mudra").
export function describe(cond) {
  if (!cond) return '';
  const parts = [];
  for (const [k, v] of Object.entries(cond)) {
    if (k === 'hasItem') parts.push(`Needs ${asList(v).map((i) => ITEMS[i]?.name ?? i).join(', ')}`);
    else if (k === 'companion') parts.push(`Needs ${asList(v).map((c) => COMPANIONS[c]?.name ?? c).join(', ')}`);
    else if (['mudra', 'anna', 'prana', 'punya'].includes(k)) parts.push(`Needs ${v} ${k[0].toUpperCase() + k.slice(1)}`);
    else if (k === 'stat') parts.push(Object.entries(v).map(([st, n]) => `Needs ${STAT_NAMES[st]} ${n}`).join(', '));
    else if (k === 'night') parts.push(v ? 'Only at night' : 'Only by day');
    else if (k === 'tokens') parts.push(`Needs ${v} Sacred Tokens`);
    else if (k === 'party') parts.push(`Needs ${v} companions`);
    else if (k === 'friends') parts.push(`Needs ${v} creature friends`);
    else if (k === 'quest') parts.push(`During "${QUESTS[asList(v)[0]]?.title ?? v}"`);
    else if (k === 'questDone') parts.push(`After "${QUESTS[asList(v)[0]]?.title ?? v}"`);
    else parts.push('Not available');
  }
  return [...new Set(parts)].join(' · ');
}
