// Read-only helpers the UI uses to present state. Nothing here mutates.
import { CARDS } from '../data/index.js';
import { check, describe } from './conditions.js';
import { passChance } from './skillcheck.js';

export function choiceView(s, cardId) {
  const card = CARDS[cardId];
  return card.choices
    .map((c, index) => {
      if (!check(s, c.hide)) return null;
      const available = check(s, c.requires);
      return {
        index,
        label: c.label,
        hint: c.hint ?? '',
        available,
        reason: available ? '' : describe(c.requires),
        test: c.test ? { ...c.test, ...passChance(s, c.test) } : null,
      };
    })
    .filter(Boolean);
}

export const canRoll = (s) => !s.pending && !s.ended;
