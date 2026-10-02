import { QUESTS } from '../data/index.js';
import { check } from './conditions.js';
import { applyEffects } from './effects.js';
import { log } from './state.js';

// Advances every active quest whose current step condition is now true.
export function progressQuests(s, notes = []) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const [id, q] of Object.entries(s.quests)) {
      if (q.done) continue;
      const def = QUESTS[id];
      const step = def.steps[q.step];
      if (!step || !check(s, step.done)) continue;
      q.step++;
      changed = true;
      if (q.step >= def.steps.length) {
        q.done = true;
        notes.push(`Quest complete: ${def.title}`);
        log(s, `Completed "${def.title}".`);
        applyEffects(s, def.reward, notes);
      }
    }
  }
  return notes;
}
