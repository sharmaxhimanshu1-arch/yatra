import { ITEMS, COMPANIONS, CREATURES, QUESTS, TOKENS } from '../data/index.js';
import { MAX_ITEMS, MAX_PARTY, RESOURCE_NAMES, STAT_NAMES, STATS, log, meet, regionOf } from './state.js';

const asList = (v) => (Array.isArray(v) ? v : [v]);
const sign = (n) => (n > 0 ? `+${n}` : `${n}`);

function changeResource(s, key, delta, notes) {
  if (!delta) return;
  if (key === 'prana' && delta < 0 && s.shield) {
    s.shield = false;
    notes.push('Shield absorbed the harm');
    return;
  }
  const before = s[key];
  if (key === 'pranaMax') {
    s.pranaMax = Math.max(4, s.pranaMax + delta);
    s.prana = Math.min(s.pranaMax, Math.max(0, s.prana + Math.max(0, delta)));
  } else if (key === 'prana') {
    s.prana = Math.max(0, Math.min(s.pranaMax, s.prana + delta));
  } else if (key === 'punya') {
    s.punya += delta;
  } else {
    s[key] = Math.max(0, s[key] + delta);
  }
  const actual = key === 'pranaMax' ? delta : s[key] - before;
  if (actual) notes.push(`${sign(actual)} ${RESOURCE_NAMES[key]}`);
}

export function addItem(s, id, notes) {
  if (s.inventory.length >= MAX_ITEMS) {
    notes.push(`No room for ${ITEMS[id].name}`);
    return false;
  }
  s.inventory.push(id);
  notes.push(`Gained ${ITEMS[id].name}`);
  return true;
}

export function recruit(s, id, notes) {
  if (s.party.includes(id)) return;
  s.waiting = s.waiting.filter((c) => c !== id);
  const c = COMPANIONS[id];
  if (s.party.length >= MAX_PARTY) {
    s.waiting.push(id);
    notes.push(`${c.name} will wait for you at the next village`);
    return;
  }
  s.party.push(id);
  if (!s.journal.friends.includes(id)) s.journal.friends.push(id);
  if (c.quest && !s.quests[c.quest]) s.quests[c.quest] = { step: 0, done: false };
  notes.push(`${c.name} joins you!`);
  log(s, `${c.name} joined the journey.`);
}

// Each handler mutates state and pushes player-facing notes.
const EFFECTS = {
  gain: (s, v, n) => Object.entries(v).forEach(([k, d]) => changeResource(s, k, d, n)),
  lose: (s, v, n) => Object.entries(v).forEach(([k, d]) => changeResource(s, k, -d, n)),
  stat: (s, v, n) =>
    Object.entries(v).forEach(([k, d]) => {
      s.stats[k] = Math.max(0, s.stats[k] + d);
      n.push(`${sign(d)} ${STAT_NAMES[k]}`);
    }),
  addItem: (s, v, n) => asList(v).forEach((id) => addItem(s, id, n)),
  removeItem: (s, v, n) =>
    asList(v).forEach((id) => {
      const i = s.inventory.indexOf(id);
      if (i >= 0) {
        s.inventory.splice(i, 1);
        n.push(`Gave up ${ITEMS[id].name}`);
      }
    }),
  setFlag: (s, v) => asList(v).forEach((f) => (s.flags[f] = true)),
  clearFlag: (s, v) => asList(v).forEach((f) => delete s.flags[f]),
  meet: (s, v) => asList(v).forEach((c) => meet(s, c)),
  befriend: (s, v, n) =>
    asList(v).forEach((c) => {
      if (s.journal.creatures[c] === 'friend') return;
      s.journal.creatures[c] = 'friend';
      n.push(`Befriended ${CREATURES[c].name}`);
      log(s, `Made friends with ${CREATURES[c].name}.`);
    }),
  recruit: (s, v, n) => asList(v).forEach((c) => recruit(s, c, n)),
  startQuest: (s, v, n) =>
    asList(v).forEach((q) => {
      if (s.quests[q]) return;
      s.quests[q] = { step: 0, done: false };
      n.push(`New quest: ${QUESTS[q].title}`);
      log(s, `Took up the quest "${QUESTS[q].title}".`);
      applyEffects(s, QUESTS[q].onStart, n);
    }),
  farewell: (s, v, n) =>
    asList(v).forEach((c) => {
      if (!s.party.includes(c)) return;
      s.party = s.party.filter((x) => x !== c);
      n.push(`${COMPANIONS[c].name} stays behind`);
      log(s, `Said goodbye to ${COMPANIONS[c].name}.`);
    }),
  token: (s, v, n) => {
    if (s.tokens.includes(v)) return;
    s.tokens.push(v);
    n.push(`Sacred Token: ${TOKENS[v].name}`);
    log(s, `Received the ${TOKENS[v].name}.`);
  },
  completeRegion: (s) => {
    s.flags[`gate_${s.region}`] = true;
    s.queue = { kind: 'regionDone' };
  },
  moveBack: (s, v, n) => {
    const region = regionOf(s);
    const idx = Math.max(0, s.route.length - 1 - v);
    s.route = s.route.slice(0, idx + 1);
    const to = s.route[idx] ?? region.start;
    if (to !== s.pos) n.push(`Pushed back ${v} steps`);
    s.pos = to;
  },
  buff: (s, v, n) => {
    s.buff = { stat: v.stat, amount: v.amount };
    n.push(`${sign(v.amount)} to your next ${v.stat === 'any' ? '' : STAT_NAMES[v.stat] + ' '}test`);
  },
  shield: (s, v, n) => {
    s.shield = true;
    n.push('Protected from the next harm');
  },
  card: (s, v) => (s.queue = { kind: 'card', card: v }),
  ending: (s, v) => {
    s.ended = v;
    s.queue = { kind: 'ending' };
  },
  log: (s, v) => log(s, v),
  randomStat: (s, v, n) => {
    // Shrine blessings: raise the lowest stat.
    const low = STATS.reduce((a, b) => (s.stats[b] < s.stats[a] ? b : a));
    s.stats[low] += v;
    n.push(`${sign(v)} ${STAT_NAMES[low]}`);
  },
};

export const EFFECT_KEYS = Object.keys(EFFECTS);

export function applyEffects(s, effects = [], notes = []) {
  for (const eff of effects) {
    for (const [k, v] of Object.entries(eff)) {
      const fn = EFFECTS[k];
      if (!fn) throw new Error(`Unknown effect "${k}"`);
      fn(s, v, notes);
    }
    if (s.prana <= 0) break; // fainting interrupts the rest of the outcome
  }
  return notes;
}

