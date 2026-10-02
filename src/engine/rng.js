// Seeded PRNG (mulberry32). The generator state lives on the game state as `s.rng`,
// so a save always reproduces the same future rolls.

export function seedFrom(input) {
  if (typeof input === 'number') return input >>> 0;
  let h = 2166136261;
  for (const ch of String(input)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function next(s) {
  let t = (s.rng = (s.rng + 0x6d2b79f5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const roll = (s, sides = 6) => 1 + Math.floor(next(s) * sides);

export function weightedPick(s, items, weightOf = (x) => x.weight ?? 1) {
  const total = items.reduce((sum, x) => sum + weightOf(x), 0);
  if (!items.length || total <= 0) return null;
  let r = next(s) * total;
  for (const x of items) {
    r -= weightOf(x);
    if (r < 0) return x;
  }
  return items[items.length - 1];
}
