import { COMPANIONS } from '../data/index.js';
import { effectiveStat, log } from './state.js';
import { roll } from './rng.js';

const buffFor = (s, stat) => (s.buff && (s.buff.stat === stat || s.buff.stat === 'any') ? s.buff.amount : 0);

// Probability of passing: d6 + bonus >= dc, and a natural 6 always passes.
export function passChance(s, test) {
  const bonus = effectiveStat(s, test.stat) + buffFor(s, test.stat);
  let pass = 0;
  for (let r = 1; r <= 6; r++) if (r === 6 || r + bonus >= test.dc) pass++;
  return { bonus, chance: pass / 6 };
}

// Rolls a stat test. A companion with the "reroll" ability retries one failure per region.
export function resolveTest(s, test) {
  const stat = effectiveStat(s, test.stat);
  const buff = buffFor(s, test.stat);
  if (buff) s.buff = null;
  const attempt = () => {
    const r = roll(s);
    return { roll: r, total: r + stat + buff, passed: r === 6 || r + stat + buff >= test.dc };
  };
  let res = attempt();
  let rerolledBy = null;
  if (!res.passed) {
    const helper = s.party.find((c) => COMPANIONS[c].ability.kind === 'reroll' && !s.used[c]);
    if (helper) {
      s.used[helper] = true;
      rerolledBy = helper;
      const first = res.roll;
      res = attempt();
      res.firstRoll = first;
      log(s, `${COMPANIONS[helper].name} gave you a second chance.`);
    }
  }
  return { stat: test.stat, dc: test.dc, bonus: stat + buff, ...res, rerolledBy };
}
