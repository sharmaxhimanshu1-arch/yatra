import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, dispatch, IllegalAction, passChance, effectiveStat } from '../src/engine/index.js';
import { REGIONS, CARDS } from '../src/data/index.js';
import { roll, seedFrom } from '../src/engine/rng.js';
import { applyEffects } from '../src/engine/effects.js';
import { drawCard } from '../src/engine/actions.js';

const ganga = REGIONS[0];
const act = (s, type, extra = {}) => dispatch(s, { type, ...extra }).state;

// Starts a game, answers the intro card, and leaves the player idle at the start.
function idleAt(nodeId, seed = 1) {
  const s = newGame({ seed });
  s.pos = nodeId;
  s.route = [nodeId];
  s.pending = null;
  return s;
}

test('rng is deterministic and in range', () => {
  const a = { rng: seedFrom('yatra') };
  const b = { rng: seedFrom('yatra') };
  const rollsA = Array.from({ length: 50 }, () => roll(a));
  const rollsB = Array.from({ length: 50 }, () => roll(b));
  assert.deepEqual(rollsA, rollsB);
  assert.ok(rollsA.every((r) => r >= 1 && r <= 6));
  assert.equal(new Set(rollsA).size, 6);
});

test('a new game opens on the intro card, which applies its gift', () => {
  let s = newGame({ seed: 7 });
  assert.equal(s.pending.card, 'ganga_intro');
  assert.throws(() => dispatch(s, { type: 'ROLL' }), IllegalAction);
  s = act(s, 'CHOOSE_OPTION', { index: 0 });
  assert.deepEqual(s.party, ['moti']);
  s = act(s, 'CONTINUE');
  assert.equal(s.pending, null);
  s = act(s, 'ROLL');
  assert.equal(s.turns, 1);
});

test('rolling walks the trail and stops at the first village', () => {
  let s = idleAt(ganga.start);
  s.chooseRoll = true;
  const { state, events } = dispatch(s, { type: 'ROLL', value: 6 });
  const steps = events.filter((e) => e.type === 'step');
  assert.equal(steps.length, 4, 'village is 4 steps from the start');
  assert.equal(state.pos, 'ghat');
  assert.equal(state.lastVillage, 'ghat');
  assert.ok(['village', 'card'].includes(state.pending.kind));
  assert.equal(state.anna, 5, 'walking costs one Anna');
});

test('forks pause movement until a branch is chosen', () => {
  let s = idleAt('ghat');
  s.chooseRoll = true;
  let r = dispatch(s, { type: 'ROLL', value: 3 });
  assert.equal(r.state.pending.kind, 'fork');
  assert.equal(r.state.pending.remaining, 3);
  const [a, b] = r.state.pending.options;
  assert.notEqual(a, b);
  r = dispatch(r.state, { type: 'CHOOSE_FORK', to: b });
  assert.equal(r.events.filter((e) => e.type === 'step').length, 3, 'uses the rest of the roll along the chosen lane');
  assert.ok(r.state.route.includes(b));
  assert.throws(() => dispatch(r.state, { type: 'CHOOSE_FORK', to: a }), IllegalAction);
});

test('card choices resolve tests, apply effects and continue', () => {
  let s = idleAt(ganga.start);
  s.pending = { kind: 'card', card: 'ganga_mango', then: null, result: null, revealNotes: [] };
  s.stats.karuna = 10;
  s = act(s, 'CHOOSE_OPTION', { index: 0 });
  assert.equal(s.pending.result.passed, true);
  assert.equal(s.anna, 9);
  s = act(s, 'CONTINUE');
  assert.equal(s.pending, null);
});

test('unavailable choices are rejected', () => {
  const s = idleAt(ganga.start);
  s.pending = { kind: 'card', card: 'ganga_gate', then: null, result: null, revealNotes: [] };
  s.mudra = 0;
  assert.throws(() => dispatch(s, { type: 'CHOOSE_OPTION', index: 0 }), IllegalAction);
});

test('pass chance accounts for stat, buff and the natural 6', () => {
  const s = newGame({ seed: 3 });
  assert.equal(passChance(s, { stat: 'shakti', dc: 20 }).chance, 1 / 6);
  assert.equal(passChance(s, { stat: 'shakti', dc: 2 }).chance, 1);
  s.buff = { stat: 'any', amount: 2 };
  assert.equal(passChance(s, { stat: 'shakti', dc: 6 }).chance, 4 / 6);
});

test('fainting returns you to the last village with half your coins', () => {
  let s = idleAt('banyan');
  s.lastVillage = 'ghat';
  s.mudra = 9;
  s.prana = 1;
  s.anna = 0;
  const r = dispatch(s, { type: 'ROLL' });
  assert.ok(r.events.some((e) => e.type === 'faint'));
  assert.equal(r.state.pos, 'ghat');
  assert.equal(r.state.mudra, 5);
  assert.equal(r.state.prana, 5);
  assert.equal(r.state.pending.kind, 'village');
});

test('effects: items, companions, stats, quests', () => {
  const s = newGame({ seed: 5 });
  applyEffects(s, [{ addItem: 'staff' }, { recruit: 'hanu' }, { stat: { buddhi: 2 } }]);
  assert.equal(effectiveStat(s, 'shakti'), 2);
  assert.equal(effectiveStat(s, 'gati'), 2);
  assert.equal(s.stats.buddhi, 3);
  assert.ok(s.quests.q_hanu, 'recruiting starts the companion quest');
  applyEffects(s, [{ recruit: 'moti' }, { recruit: 'ulupi' }, { recruit: 'meen' }]);
  assert.equal(s.party.length, 3);
  assert.deepEqual(s.waiting, ['meen']);
  for (let i = 0; i < 6; i++) applyEffects(s, [{ addItem: 'herbs' }]);
  assert.equal(s.inventory.length, 6);
});

test('the calf quest runs start to finish', () => {
  let s = idleAt('ghat');
  s.pending = { kind: 'village', node: 'ghat', rested: false };
  s = act(s, 'ACCEPT_QUEST', { quest: 'q_calf' });
  assert.equal(s.quests.q_calf.step, 0);
  assert.equal(drawCard({ ...s, seen: {} }, 'event').id !== undefined, true);
  s.pending = { kind: 'card', card: 'ganga_calf_found', then: null, result: null, revealNotes: [] };
  s.stats.shakti = 9;
  s = act(s, 'CHOOSE_OPTION', { index: 0 });
  assert.equal(s.quests.q_calf.step, 1);
  s = act(s, 'CONTINUE');
  s.pos = 'mela';
  s.pending = null;
  // Arriving at the Mela triggers the return visit, then the village.
  s.pos = 'banyan';
  s.chooseRoll = true;
  s = dispatch(s, { type: 'ROLL', value: 6 }).state;
  assert.equal(s.pos, 'mela');
  assert.equal(s.pending.card, 'ganga_calf_return');
  const mudra = s.mudra;
  s = act(s, 'CHOOSE_OPTION', { index: 0 });
  assert.equal(s.quests.q_calf.done, true);
  assert.equal(s.mudra, mudra + 4);
  s = act(s, 'CONTINUE');
  assert.equal(s.pending.kind, 'village');
});

test('the gate grants the token and moves on to the next region', () => {
  let s = idleAt('ferry');
  s.pending = { kind: 'card', card: 'ganga_gate', then: null, result: null, revealNotes: [] };
  s.mudra = 4;
  s = act(s, 'CHOOSE_OPTION', { index: 0 });
  assert.deepEqual(s.tokens, ['lotus_seed']);
  s = act(s, 'CONTINUE');
  assert.equal(s.pending.kind, 'regionDone');
  if (REGIONS.length > 1) {
    s = act(s, 'TRAVEL');
    assert.equal(s.region, REGIONS[1].id);
    assert.equal(s.pos, REGIONS[1].start);
  }
});

test('village services', () => {
  let s = idleAt('ghat');
  s.pending = { kind: 'village', node: 'ghat', rested: false };
  s.mudra = 10;
  s.prana = 2;
  s = act(s, 'REST', { paid: true });
  assert.equal(s.prana, s.pranaMax);
  assert.equal(s.mudra, 8);
  assert.throws(() => dispatch(s, { type: 'REST', paid: false }), IllegalAction);
  s = act(s, 'BUY', { item: 'food' });
  assert.equal(s.anna, 9);
  s = act(s, 'BUY', { item: 'staff' });
  assert.ok(s.inventory.includes('staff'));
  assert.throws(() => dispatch(s, { type: 'BUY', item: 'feather' }), IllegalAction);
  s = act(s, 'LEAVE');
  assert.equal(s.pending, null);
});

test('companion abilities: once per region', () => {
  let s = idleAt(ganga.start);
  applyEffects(s, [{ recruit: 'moti' }, { recruit: 'tarkshya' }]);
  s = act(s, 'USE_ABILITY', { companion: 'moti' });
  assert.equal(s.anna, 9);
  assert.throws(() => dispatch(s, { type: 'USE_ABILITY', companion: 'moti' }), IllegalAction);
  s = act(s, 'USE_ABILITY', { companion: 'tarkshya' });
  assert.equal(s.chooseRoll, true);
  const r = dispatch(s, { type: 'ROLL', value: 2 });
  assert.equal(r.events.find((e) => e.type === 'roll').value, 2);
});

test('hanu re-rolls one failed test per region', () => {
  const s = idleAt(ganga.start);
  applyEffects(s, [{ recruit: 'hanu' }]);
  s.pending = { kind: 'card', card: 'ganga_wrestler', then: null, result: null, revealNotes: [] };
  s.stats.shakti = -10; // guaranteed fail except a natural 6
  let state = s;
  for (let i = 0; i < 20 && !state.used.hanu; i++) {
    state = { ...s, rng: i + 1 };
    state = act(state, 'CHOOSE_OPTION', { index: 0 });
  }
  assert.equal(state.used.hanu, true);
  assert.equal(state.pending.result.test.rerolledBy, 'hanu');
});

test('cards referenced by the board exist', () => {
  for (const r of REGIONS) for (const n of Object.values(r.nodes)) {
    if (n.card) assert.ok(CARDS[n.card], `${r.id}/${n.id} → ${n.card}`);
    for (const v of n.visits ?? []) assert.ok(CARDS[v], `${r.id}/${n.id} visit → ${v}`);
  }
});
