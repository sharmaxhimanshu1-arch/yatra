import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame as rawNewGame, dispatch, saves } from '../src/engine/index.js';

// A game past its intro card, ready to roll.
function newGame(opts) {
  let s = rawNewGame(opts);
  s = dispatch(s, { type: 'CHOOSE_OPTION', index: 1 }).state;
  return dispatch(s, { type: 'CONTINUE' }).state;
}

function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}

test('save, list, load and delete round-trip', () => {
  const store = memoryStorage();
  let s = newGame({ seed: 9, name: 'Asha' });
  s = dispatch(s, { type: 'ROLL' }).state;
  saves.saveGame(store, 2, s);
  const slots = saves.listSlots(store);
  assert.equal(slots[0].empty, true);
  assert.equal(slots[1].name, 'Asha');
  assert.equal(slots[1].region, 'The Ganga Plains');
  assert.deepEqual(saves.loadGame(store, 2), s);
  saves.deleteGame(store, 2);
  assert.equal(saves.loadGame(store, 2), null);
});

test('a loaded save continues with the same dice', () => {
  const s = newGame({ seed: 11 });
  const copy = saves.deserialize(saves.serialize(s));
  const a = dispatch(s, { type: 'ROLL' }).events.find((e) => e.type === 'roll').value;
  const b = dispatch(copy, { type: 'ROLL' }).events.find((e) => e.type === 'roll').value;
  assert.equal(a, b);
});

test('import rejects junk and future versions', () => {
  assert.throws(() => saves.deserialize('{"hello":1}'));
  assert.throws(() => saves.deserialize(JSON.stringify({ v: 999, state: newGame() })));
  assert.throws(() => saves.deserialize('not json'));
});
