import { CARDS, CARDS_BY_DECK, COMPANIONS, ITEMS, QUESTS, REGIONS, FOOD } from '../data/index.js';
import { check } from './conditions.js';
import { applyEffects, addItem, recruit } from './effects.js';
import { progressQuests } from './quests.js';
import { resolveTest } from './skillcheck.js';
import { roll, weightedPick } from './rng.js';
import { MAX_ITEMS, MAX_PARTY, STOP_TYPES, addPlace, log, meet, nodeOf, regionOf, WATCHES } from './state.js';

export class IllegalAction extends Error {}
const assert = (ok, msg) => {
  if (!ok) throw new IllegalAction(msg);
};

// ---- movement -------------------------------------------------------------

function step(s, to, ev) {
  ev.push({ type: 'step', from: s.pos, to });
  s.pos = to;
  s.steps++;
  s.route.push(to);
  if (s.route.length > 200) s.route.shift();
}

function walk(s, remaining, ev) {
  while (remaining > 0) {
    const node = nodeOf(s);
    if (!node.next.length) break;
    if (node.next.length > 1) {
      s.pending = { kind: 'fork', remaining, options: [...node.next] };
      ev.push({ type: 'fork', options: node.next, remaining });
      return;
    }
    step(s, node.next[0], ev);
    remaining--;
    if (STOP_TYPES.has(nodeOf(s).type)) break;
  }
  land(s, ev);
}

function land(s, ev) {
  const node = nodeOf(s);
  ev.push({ type: 'land', node: node.id, tile: node.type });
  switch (node.type) {
    case 'start':
      if (node.card && !s.seenOnce[node.card]) openCard(s, node.card, ev);
      break;
    case 'village':
      s.lastVillage = node.id;
      if (addPlace(s, node)) ev.push({ type: 'place', name: node.label });
      enterVillage(s, node, ev);
      break;
    case 'landmark':
      if (addPlace(s, node)) ev.push({ type: 'place', name: node.label });
      if (node.card && !s.seenOnce[node.card]) openCard(s, node.card, ev);
      else ev.push({ type: 'quiet', text: `You pass ${node.label} once more.` });
      break;
    case 'gate':
      if (s.flags[`gate_${s.region}`]) s.pending = { kind: 'regionDone' };
      else openCard(s, node.card, ev);
      break;
    default: {
      const card = drawCard(s, node.type);
      if (card) openCard(s, card.id, ev);
      else ev.push({ type: 'quiet', text: 'The road is quiet.' });
    }
  }
}

const villagePending = (id) => ({ kind: 'village', node: id, rested: false });

function enterVillage(s, node, ev) {
  const visit = (node.visits ?? []).find((id) => !s.seenOnce[id] && check(s, CARDS[id].when));
  if (visit) openCard(s, visit, ev, villagePending(node.id));
  else s.pending = villagePending(node.id);
}

// ---- cards ----------------------------------------------------------------

export function drawCard(s, deck) {
  const pool = CARDS_BY_DECK[deck] ?? [];
  const seen = s.seen[s.region] ?? [];
  const eligible = (ignoreSeen) =>
    pool.filter(
      (c) =>
        (c.region === s.region || c.region === 'any') &&
        !(c.once && s.seenOnce[c.id]) &&
        (ignoreSeen || !seen.includes(c.id)) &&
        check(s, c.when),
    );
  let list = eligible(false);
  if (!list.length) list = eligible(true);
  return weightedPick(s, list, (c) => (c.weight ?? 1) * (c.region === 'any' ? 0.5 : 1));
}

function openCard(s, id, ev, then = null) {
  const card = CARDS[id];
  if (!card) throw new Error(`Missing card "${id}"`);
  s.pending = { kind: 'card', card: id, then, result: null, revealNotes: [] };
  s.seenOnce[id] = true;
  (s.seen[s.region] ??= []).push(id);
  if (card.creature) meet(s, card.creature);
  if (card.reveal) {
    s.pending.revealNotes = applyEffects(s, card.reveal);
    checkFaint(s, ev, s.pending.revealNotes);
  }
  ev.push({ type: 'card', card: id });
}

function checkFaint(s, ev, notes) {
  if (s.prana > 0) return false;
  const region = regionOf(s);
  const to = s.lastVillage ?? region.start;
  s.faints++;
  s.pos = to;
  s.route.push(to);
  s.prana = Math.ceil(s.pranaMax / 2);
  const lost = Math.floor(s.mudra / 2);
  s.mudra -= lost;
  s.anna = Math.max(s.anna, 2);
  s.buff = null;
  const where = region.nodes[to].label ?? 'the start of the road';
  notes.push(`You collapse… and wake in ${where}${lost ? `, ${lost} Mudra lighter` : ''}.`);
  log(s, `Fainted from exhaustion and woke in ${where}.`);
  ev.push({ type: 'faint', to });
  s.queue = s.lastVillage ? villagePending(to) : null;
  return true;
}

// Moves to whatever comes after a card or a faint. `then` is carried into a chained card.
function goTo(s, next, then, ev) {
  s.pending = null;
  if (!next) return;
  if (next.kind === 'card') openCard(s, next.card, ev, then);
  else if (next.kind === 'village') enterVillage(s, nodeOf(s, next.node), ev);
  else s.pending = next;
}

// ---- handlers ---------------------------------------------------------------

const free = (s) => !s.ended && (!s.pending || s.pending.kind === 'village');

const HANDLERS = {
  ROLL(s, { value }, ev) {
    assert(!s.pending && !s.ended, 'Cannot roll now');
    const chosen = s.chooseRoll && value >= 1 && value <= 6;
    const n = chosen ? value : roll(s);
    s.chooseRoll = false;
    ev.push({ type: 'roll', value: n, chosen });
    s.turns++;
    s.watch = (s.watch + 1) % 4;
    if (s.watch === 0) s.day++;
    ev.push({ type: 'time', day: s.day, watch: WATCHES[s.watch] });
    const notes = [];
    if (s.anna > 0) s.anna--;
    else {
      applyEffects(s, [{ lose: { prana: 1 } }], notes);
      ev.push({ type: 'hungry' });
    }
    if (checkFaint(s, ev, notes)) {
      ev.push({ type: 'notes', notes });
      const next = s.queue;
      s.queue = null;
      goTo(s, next, null, ev);
      return;
    }
    walk(s, n, ev);
  },

  CHOOSE_FORK(s, { to }, ev) {
    const p = s.pending;
    assert(p?.kind === 'fork' && p.options.includes(to), 'Not a fork choice');
    s.pending = null;
    step(s, to, ev);
    const remaining = p.remaining - 1;
    if (remaining <= 0 || STOP_TYPES.has(nodeOf(s).type)) land(s, ev);
    else walk(s, remaining, ev);
  },

  CHOOSE_OPTION(s, { index }, ev) {
    const p = s.pending;
    assert(p?.kind === 'card' && !p.result, 'No card to answer');
    const choice = CARDS[p.card].choices[index];
    assert(choice && check(s, choice.hide) && check(s, choice.requires), 'Choice unavailable');
    const test = choice.test ? resolveTest(s, choice.test) : null;
    const passed = test ? test.passed : true;
    const notes = applyEffects(s, (passed ? choice.pass : choice.fail) ?? []);
    progressQuests(s, notes);
    const fainted = checkFaint(s, ev, notes);
    p.result = { index, test, passed, text: (passed ? choice.passText : choice.failText) ?? '', notes, fainted };
    ev.push({ type: 'resolve', test, passed });
  },

  CONTINUE(s, _a, ev) {
    const p = s.pending;
    assert(p?.kind === 'card' && p.result, 'Nothing to continue');
    const queued = s.queue;
    s.queue = null;
    if (queued?.kind === 'card') goTo(s, queued, p.then, ev);
    else goTo(s, queued ?? p.then, null, ev);
  },

  REST(s, { paid }, ev) {
    const p = s.pending;
    assert(p?.kind === 'village' && !p.rested, 'Cannot rest');
    const notes = [];
    if (paid) {
      const cost = nodeOf(s, p.node).restCost ?? 2;
      assert(s.mudra >= cost, 'Not enough Mudra');
      applyEffects(s, [{ lose: { mudra: cost } }, { gain: { prana: s.pranaMax } }], notes);
    } else {
      applyEffects(s, [{ gain: { prana: 3 } }], notes);
    }
    p.rested = true;
    ev.push({ type: 'notes', notes });
  },

  BUY(s, { item }, ev) {
    const p = s.pending;
    assert(p?.kind === 'village', 'No shop here');
    const notes = [];
    if (item === 'food') {
      assert(s.mudra >= FOOD.price, 'Not enough Mudra');
      applyEffects(s, [{ lose: { mudra: FOOD.price } }, { gain: { anna: FOOD.amount } }], notes);
    } else {
      assert(nodeOf(s, p.node).shop?.includes(item), 'Not sold here');
      assert(s.mudra >= ITEMS[item].price, 'Not enough Mudra');
      assert(s.inventory.length < MAX_ITEMS, 'Bag is full');
      s.mudra -= ITEMS[item].price;
      addItem(s, item, notes);
    }
    ev.push({ type: 'notes', notes });
  },

  RECRUIT(s, { companion }, ev) {
    const p = s.pending;
    assert(p?.kind === 'village' && s.party.length < MAX_PARTY, 'Cannot recruit');
    assert(villageRecruits(s, nodeOf(s, p.node)).includes(companion), 'Not here');
    const notes = [];
    recruit(s, companion, notes);
    ev.push({ type: 'notes', notes });
  },

  ACCEPT_QUEST(s, { quest }, ev) {
    const p = s.pending;
    assert(p?.kind === 'village', 'No quests here');
    assert(villageQuests(s, nodeOf(s, p.node)).includes(quest), 'Quest not offered');
    ev.push({ type: 'notes', notes: applyEffects(s, [{ startQuest: quest }]) });
  },

  LEAVE(s) {
    assert(s.pending?.kind === 'village', 'Not in a village');
    s.pending = null;
  },

  USE_ITEM(s, { item }, ev) {
    assert(free(s) && s.inventory.includes(item), 'Cannot use');
    const def = ITEMS[item];
    assert(def.use, `${def.name} cannot be used`);
    if (def.consumable) s.inventory.splice(s.inventory.indexOf(item), 1);
    ev.push({ type: 'notes', notes: applyEffects(s, def.use) });
  },

  DROP_ITEM(s, { item }) {
    assert(free(s) && s.inventory.includes(item), 'Cannot drop');
    s.inventory.splice(s.inventory.indexOf(item), 1);
  },

  USE_ABILITY(s, { companion }, ev) {
    assert(free(s) && s.party.includes(companion) && !s.used[companion], 'Ability not ready');
    const { kind } = COMPANIONS[companion].ability;
    const notes = [];
    if (kind === 'heal') applyEffects(s, [{ gain: { prana: 4 } }], notes);
    else if (kind === 'forage') applyEffects(s, [{ gain: { anna: 3 } }], notes);
    else if (kind === 'insight') applyEffects(s, [{ buff: { stat: 'any', amount: 3 } }], notes);
    else if (kind === 'shield') applyEffects(s, [{ shield: true }], notes);
    else if (kind === 'song') applyEffects(s, [{ gain: { prana: 2, punya: 1 } }], notes);
    else if (kind === 'wings') {
      assert(!s.pending, 'Use this before rolling');
      s.chooseRoll = true;
      notes.push('Choose your next move (1–6)');
    } else assert(false, 'This ability works on its own');
    s.used[companion] = true;
    ev.push({ type: 'notes', notes });
  },

  DISMISS(s, { companion }) {
    assert(free(s) && s.party.includes(companion), 'Not in party');
    s.party = s.party.filter((c) => c !== companion);
    s.waiting.push(companion);
    log(s, `${COMPANIONS[companion].name} parted ways for a while.`);
  },

  TRAVEL(s, _a, ev) {
    assert(s.pending?.kind === 'regionDone', 'Not ready to travel');
    assert(s.regionIndex + 1 < REGIONS.length, 'No road onward');
    s.regionIndex++;
    const r = REGIONS[s.regionIndex];
    s.region = r.id;
    s.pos = r.start;
    s.route = [r.start];
    s.lastVillage = null;
    s.used = {};
    s.pending = null;
    log(s, `Set out into ${r.name}.`);
    ev.push({ type: 'travel', region: r.id });
    land(s, ev);
  },
};

export function villageRecruits(s, node) {
  const here = (node.recruit ?? []).filter(
    (c) => !s.party.includes(c) && !s.waiting.includes(c) && !s.journal.friends.includes(c) && check(s, COMPANIONS[c].recruitWhen),
  );
  return [...here, ...s.waiting];
}

export function villageQuests(s, node) {
  return (node.quests ?? []).filter((q) => !s.quests[q] && check(s, QUESTS[q].offerWhen));
}

export function dispatch(state, action) {
  const s = structuredClone(state);
  const ev = [];
  const handler = HANDLERS[action.type];
  if (!handler) throw new Error(`Unknown action "${action.type}"`);
  handler(s, action, ev);
  const notes = progressQuests(s);
  if (notes.length) ev.push({ type: 'notes', notes });
  return { state: s, events: ev };
}
