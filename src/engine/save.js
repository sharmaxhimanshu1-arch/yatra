import { SAVE_VERSION } from './state.js';
import { REGION_BY_ID } from '../data/index.js';

export const SLOTS = [1, 2, 3];
const key = (slot) => `yatra.slot.${slot}`;

// Upgrades older saves step by step. Add `n: (state) => state` entries as the format changes.
const MIGRATIONS = {};

export function migrate(data) {
  if (!data || typeof data !== 'object' || !data.state) throw new Error('Not a Yatra save');
  let v = data.v ?? 1;
  if (v > SAVE_VERSION) throw new Error('This save comes from a newer version of Yatra');
  let state = data.state;
  while (v < SAVE_VERSION) {
    state = MIGRATIONS[v + 1](state);
    v++;
  }
  if (!REGION_BY_ID[state.region] || !REGION_BY_ID[state.region].nodes[state.pos]) throw new Error('Save points to an unknown place');
  return { ...state, version: SAVE_VERSION };
}

export function serialize(state) {
  return JSON.stringify({ v: SAVE_VERSION, savedAt: Date.now(), state });
}

export function deserialize(text) {
  return migrate(JSON.parse(text));
}

export function saveGame(storage, slot, state) {
  storage.setItem(key(slot), serialize(state));
}

export function loadGame(storage, slot) {
  const raw = storage.getItem(key(slot));
  return raw ? deserialize(raw) : null;
}

export function deleteGame(storage, slot) {
  storage.removeItem(key(slot));
}

export function listSlots(storage) {
  return SLOTS.map((slot) => {
    const raw = storage.getItem(key(slot));
    if (!raw) return { slot, empty: true };
    try {
      const { savedAt, state } = JSON.parse(raw);
      return {
        slot,
        empty: false,
        savedAt,
        name: state.name,
        region: REGION_BY_ID[state.region]?.name ?? state.region,
        day: state.day,
        tokens: state.tokens.length,
        ended: state.ended,
      };
    } catch {
      return { slot, empty: false, broken: true };
    }
  });
}
