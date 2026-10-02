// Validates every content file: ids, references, effect/condition keys, and board connectivity.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REGIONS, CARD_LIST, CARDS, ITEMS, CREATURES, COMPANIONS, QUESTS, TOKENS, ENDINGS } from '../src/data/index.js';
import { EFFECT_KEYS } from '../src/engine/effects.js';
import { CONDITION_KEYS } from '../src/engine/conditions.js';
import { STATS } from '../src/engine/state.js';

const DECKS = new Set(['intro', 'event', 'encounter', 'hazard', 'mystery', 'shrine', 'landmark', 'gate', 'visit', 'final']);
const TILE_TYPES = new Set(['start', 'event', 'encounter', 'hazard', 'mystery', 'shrine', 'village', 'landmark', 'gate']);
const RESOURCES = new Set(['prana', 'pranaMax', 'anna', 'mudra', 'punya']);
const list = (v) => (Array.isArray(v) ? v : [v]);

function checkCondition(cond, where) {
  if (!cond) return;
  for (const [k, v] of Object.entries(cond)) {
    assert.ok(CONDITION_KEYS.includes(k), `${where}: unknown condition ${k}`);
    if (k === 'hasItem' || k === 'notItem') list(v).forEach((i) => assert.ok(ITEMS[i], `${where}: item ${i}`));
    if (k === 'companion' || k === 'notCompanion') list(v).forEach((c) => assert.ok(COMPANIONS[c], `${where}: companion ${c}`));
    if (k === 'quest' || k === 'questDone' || k === 'notQuest') list(v).forEach((q) => assert.ok(QUESTS[q], `${where}: quest ${q}`));
    if (k === 'befriended') list(v).forEach((c) => assert.ok(CREATURES[c], `${where}: creature ${c}`));
    if (k === 'stat') Object.keys(v).forEach((st) => assert.ok(STATS.includes(st), `${where}: stat ${st}`));
    if (k === 'any') v.forEach((c) => checkCondition(c, where));
  }
}

function checkEffects(effects = [], where) {
  for (const eff of effects) {
    for (const [k, v] of Object.entries(eff)) {
      assert.ok(EFFECT_KEYS.includes(k), `${where}: unknown effect ${k}`);
      if (k === 'gain' || k === 'lose') Object.keys(v).forEach((r) => assert.ok(RESOURCES.has(r), `${where}: resource ${r}`));
      if (k === 'stat') Object.keys(v).forEach((st) => assert.ok(STATS.includes(st), `${where}: stat ${st}`));
      if (k === 'addItem' || k === 'removeItem') list(v).forEach((i) => assert.ok(ITEMS[i], `${where}: item ${i}`));
      if (k === 'meet' || k === 'befriend') list(v).forEach((c) => assert.ok(CREATURES[c], `${where}: creature ${c}`));
      if (k === 'recruit' || k === 'farewell') list(v).forEach((c) => assert.ok(COMPANIONS[c], `${where}: companion ${c}`));
      if (k === 'startQuest') list(v).forEach((q) => assert.ok(QUESTS[q], `${where}: quest ${q}`));
      if (k === 'token') assert.ok(TOKENS[v], `${where}: token ${v}`);
      if (k === 'card') assert.ok(CARDS[v], `${where}: card ${v}`);
      if (k === 'ending') assert.ok(ENDINGS[v], `${where}: ending ${v}`);
      if (k === 'buff') assert.ok(v.stat === 'any' || STATS.includes(v.stat), `${where}: buff stat`);
    }
  }
}

test('cards are well-formed', () => {
  for (const c of CARD_LIST) {
    const where = `card ${c.id}`;
    assert.ok(DECKS.has(c.deck), `${where}: deck ${c.deck}`);
    assert.ok(c.title && c.text, `${where}: needs title and text`);
    assert.ok(c.choices?.length, `${where}: needs choices`);
    if (c.creature) assert.ok(CREATURES[c.creature], `${where}: creature ${c.creature}`);
    checkCondition(c.when, where);
    checkEffects(c.reveal, where);
    c.choices.forEach((ch, i) => {
      const w = `${where} choice ${i}`;
      assert.ok(ch.label, `${w}: label`);
      checkCondition(ch.requires, w);
      checkCondition(ch.hide, w);
      if (ch.test) {
        assert.ok(STATS.includes(ch.test.stat), `${w}: test stat`);
        assert.ok(ch.test.dc >= 2 && ch.test.dc <= 14, `${w}: dc`);
      } else {
        assert.equal(ch.fail, undefined, `${w}: fail without a test`);
      }
      checkEffects(ch.pass, w);
      checkEffects(ch.fail, w);
    });
    // Every card must offer at least one choice with no requirement, so the player is never stuck.
    assert.ok(c.choices.some((ch) => !ch.requires && !ch.hide), `${where}: needs an always-available choice`);
  }
});

test('regions are connected from start to gate', () => {
  for (const r of REGIONS) {
    const types = Object.values(r.nodes).map((n) => n.type);
    types.forEach((t) => assert.ok(TILE_TYPES.has(t), `${r.id}: tile type ${t}`));
    assert.ok(r.gate, `${r.id}: gate`);
    assert.ok(TOKENS[r.token] || r.id === 'meru', `${r.id}: token`);
    const seen = new Set();
    const stack = [r.start];
    while (stack.length) {
      const id = stack.pop();
      if (seen.has(id)) continue;
      seen.add(id);
      stack.push(...r.nodes[id].next);
    }
    assert.equal(seen.size, Object.keys(r.nodes).length, `${r.id}: every node reachable`);
    for (const n of Object.values(r.nodes)) {
      if (n.type === 'gate') continue;
      assert.ok(n.next.length, `${r.id}/${n.id}: dead end`);
      assert.ok(n.x >= 20 && n.x <= 980 && n.y >= 20 && n.y <= 600, `${r.id}/${n.id}: off the board (${n.x},${n.y})`);
      for (const k of n.shop ?? []) assert.ok(ITEMS[k], `${r.id}/${n.id}: shop item ${k}`);
      for (const q of n.quests ?? []) assert.ok(QUESTS[q], `${r.id}/${n.id}: quest ${q}`);
      for (const c of n.recruit ?? []) assert.ok(COMPANIONS[c], `${r.id}/${n.id}: companion ${c}`);
    }
    for (const t of ['landmark', 'gate', 'start']) {
      for (const n of Object.values(r.nodes).filter((nd) => nd.type === t)) assert.ok(CARDS[n.card], `${r.id}/${n.id}: card`);
    }
  }
});

test('quests, companions and endings reference real things', () => {
  for (const [id, q] of Object.entries(QUESTS)) {
    assert.ok(q.steps.length, `quest ${id}: steps`);
    q.steps.forEach((st, i) => checkCondition(st.done, `quest ${id} step ${i}`));
    checkEffects(q.reward, `quest ${id} reward`);
    checkEffects(q.onStart, `quest ${id} start`);
    checkCondition(q.offerWhen, `quest ${id}`);
  }
  for (const [id, c] of Object.entries(COMPANIONS)) {
    if (c.creature) assert.ok(CREATURES[c.creature], `companion ${id}: creature`);
    if (c.quest) assert.ok(QUESTS[c.quest], `companion ${id}: quest`);
    assert.ok(['reroll', 'heal', 'forage', 'insight', 'shield', 'wings', 'song'].includes(c.ability.kind), `companion ${id}: ability`);
  }
  for (const [id, it] of Object.entries(ITEMS)) {
    checkEffects(it.use, `item ${id}`);
    Object.keys(it.bonus ?? {}).forEach((st) => assert.ok(STATS.includes(st), `item ${id}: bonus`));
  }
  assert.ok(Object.keys(ENDINGS).length >= 3);
});
