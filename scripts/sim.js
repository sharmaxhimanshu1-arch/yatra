// Plays many seeded games with a simple "sensible traveller" policy and reports balance numbers.
// Usage: npm run sim [-- runs]
import { newGame, dispatch, choiceView, villageRecruits, villageQuests, nodeOf, MAX_PARTY } from '../src/engine/index.js';
import { REGIONS, ITEMS, FOOD } from '../src/data/index.js';
import { next as rand } from '../src/engine/rng.js';

const RUNS = Number(process.argv[2] ?? 500);
const MAX_ACTIONS = 4000;

function policy(s, r) {
  const p = s.pending;
  if (!p) {
    if (s.prana <= s.pranaMax / 3) {
      const heal = s.inventory.find((i) => ITEMS[i].use?.some((e) => e.gain?.prana));
      if (heal) return { type: 'USE_ITEM', item: heal };
    }
    if (s.anna === 0) {
      const food = s.inventory.find((i) => ITEMS[i].use?.some((e) => e.gain?.anna));
      if (food) return { type: 'USE_ITEM', item: food };
    }
    return { type: 'ROLL' };
  }
  if (p.kind === 'fork') return { type: 'CHOOSE_FORK', to: p.options[Math.floor(rand(r) * p.options.length)] };
  if (p.kind === 'card') {
    if (p.result) return { type: 'CONTINUE' };
    const opts = choiceView(s, p.card).filter((c) => c.available);
    // Mostly pick the safest choice; sometimes a random one, like a curious player.
    if (rand(r) < 0.35) return { type: 'CHOOSE_OPTION', index: opts[Math.floor(rand(r) * opts.length)].index };
    opts.sort((a, b) => (b.test ? b.test.chance : 0.9) - (a.test ? a.test.chance : 0.9));
    return { type: 'CHOOSE_OPTION', index: opts[0].index };
  }
  if (p.kind === 'village') {
    const node = nodeOf(s, p.node);
    if (!p.rested) {
      if (s.prana < s.pranaMax * 0.7 && s.mudra >= (node.restCost ?? 2)) return { type: 'REST', paid: true };
      if (s.prana < s.pranaMax) return { type: 'REST', paid: false };
    }
    if (s.anna < 5 && s.mudra >= FOOD.price) return { type: 'BUY', item: 'food' };
    const q = villageQuests(s, node)[0];
    if (q) return { type: 'ACCEPT_QUEST', quest: q };
    const c = villageRecruits(s, node)[0];
    if (c && s.party.length < MAX_PARTY) return { type: 'RECRUIT', companion: c };
    const want = (node.shop ?? []).find((i) => ITEMS[i].bonus && !s.inventory.includes(i) && s.mudra >= ITEMS[i].price + 4 && s.inventory.length < 5);
    if (want) return { type: 'BUY', item: want };
    return { type: 'LEAVE' };
  }
  if (p.kind === 'regionDone') return { type: 'TRAVEL' };
  throw new Error(`No policy for ${p.kind}`);
}

function play(seed) {
  let s = newGame({ seed });
  const r = { rng: seed * 7919 };
  const perRegion = {};
  let actions = 0;
  while (!s.ended && actions++ < MAX_ACTIONS) {
    if (s.pending?.kind === 'regionDone' && s.regionIndex === REGIONS.length - 1) return { s, perRegion, stuck: false };
    const before = s.region;
    const turns = s.turns;
    s = dispatch(s, policy(s, r)).state;
    perRegion[before] ??= { turns: 0, faints: 0 };
    perRegion[before].turns += s.turns - turns;
    if (s.pending?.kind === 'ending' && s.ended) break;
  }
  return { s, perRegion, stuck: !s.ended };
}

const stats = { stuck: 0, endings: {}, turns: [], faints: [], punya: [], friends: [], quests: [], perRegion: {} };
for (let seed = 1; seed <= RUNS; seed++) {
  const { s, perRegion, stuck } = play(seed);
  if (stuck) {
    stats.stuck++;
    if (stats.stuck <= 3) console.log(`seed ${seed} stuck in ${s.region} at ${s.pos}, pending=${JSON.stringify(s.pending)}`);
  }
  stats.endings[s.ended ?? '(none)'] = (stats.endings[s.ended ?? '(none)'] ?? 0) + 1;
  stats.turns.push(s.turns);
  stats.faints.push(s.faints);
  stats.punya.push(s.punya);
  stats.friends.push(Object.values(s.journal.creatures).filter((v) => v === 'friend').length);
  stats.quests.push(Object.values(s.quests).filter((q) => q.done).length);
  for (const [k, v] of Object.entries(perRegion)) (stats.perRegion[k] ??= []).push(v.turns);
}

const avg = (a) => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1);
const range = (a) => `${Math.min(...a)}–${Math.max(...a)}`;
console.log(`\n${RUNS} runs · finished: ${RUNS - stats.stuck} · stuck: ${stats.stuck}`);
console.log(`turns   avg ${avg(stats.turns)} (${range(stats.turns)})`);
for (const r of REGIONS) if (stats.perRegion[r.id]) console.log(`  ${r.id.padEnd(9)} avg ${avg(stats.perRegion[r.id])} turns (${range(stats.perRegion[r.id])})`);
console.log(`faints  avg ${avg(stats.faints)} (${range(stats.faints)})`);
console.log(`punya   avg ${avg(stats.punya)} (${range(stats.punya)})`);
console.log(`friends avg ${avg(stats.friends)} · quests done avg ${avg(stats.quests)}`);
console.log('endings', stats.endings);
const pct = (a, q) => [...a].sort((x, y) => x - y)[Math.floor(a.length * q)];
console.log(`punya p25/p50/p75/p90: ${[0.25, 0.5, 0.75, 0.9].map((q) => pct(stats.punya, q)).join(' / ')}`);
console.log(`friends p25/p50/p75/p90: ${[0.25, 0.5, 0.75, 0.9].map((q) => pct(stats.friends, q)).join(' / ')}`);
