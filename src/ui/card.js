import { h, wait } from './dom.js';
import { CARDS, COMPANIONS, CREATURES, REGION_BY_ID } from '../data/index.js';
import { choiceView, STAT_NAMES } from '../engine/index.js';
import { tumble, dieFace, noteKind } from './fx.js';
import { STAT_INFO } from './hud.js';
import { sound } from './sound.js';

const DECK_NAMES = {
  intro: 'A New Land', event: 'Event', encounter: 'Encounter', hazard: 'Hazard', mystery: 'Mystery',
  shrine: 'Shrine', landmark: 'Landmark', gate: 'Trial', visit: 'Village', final: 'Journey’s End',
};

export function renderCard(host, state, { act }) {
  const p = state.pending;
  const card = CARDS[p.card];
  const region = REGION_BY_ID[state.region];
  const creature = card.creature ? CREATURES[card.creature] : null;
  const kind = card.region === 'any' ? DECK_NAMES[card.deck] : `${DECK_NAMES[card.deck]} · ${region.name.replace(/^The /, '')}`;

  const body = p.result ? resultView(state, card, p.result, act) : choicesView(state, card, act);
  host.replaceChildren(
    h('div', { class: 'overlay' },
      h('article', { class: `card deck-${card.deck}`, role: 'dialog', 'aria-label': card.title },
        h('header', { class: 'card-head' },
          h('div', { class: 'card-art', 'aria-hidden': 'true' }, card.art ?? '✨'),
          h('div', {},
            h('div', { class: 'card-kind' }, kind),
            h('h2', { class: 'card-title' }, card.title),
            creature ? h('div', { class: 'card-creature' }, `${creature.icon} ${creature.name}${state.journal.creatures[card.creature] === 'friend' ? ' · friend' : ''}`) : null,
          ),
        ),
        h('p', { class: 'card-text' }, card.text),
        p.revealNotes?.length ? notesList(p.revealNotes) : null,
        h('div', { class: 'card-body' }, body),
      ),
    ),
  );
}

function choicesView(state, card, act) {
  const opts = choiceView(state, card.id);
  return h('div', { class: 'choices' },
    opts.map((o, i) =>
      h('button', {
        class: `choice ${o.available ? '' : 'locked'} ${o.test ? '' : 'sure'}`,
        disabled: !o.available,
        onClick: () => act({ type: 'CHOOSE_OPTION', index: o.index }),
      },
        h('span', { class: 'choice-key' }, i + 1),
        h('span', { class: 'choice-main' },
          h('span', { class: 'choice-label' }, o.label),
          o.available
            ? o.test
              ? h('span', { class: 'choice-test' },
                `${STAT_INFO[o.test.stat].icon} ${STAT_NAMES[o.test.stat]} test: roll + ${o.test.bonus} vs ${o.test.dc} `,
                h('span', { class: `odds ${oddsClass(o.test.chance)}` }, `${Math.round(o.test.chance * 100)}%`))
              : null
            : h('span', { class: 'choice-test' }, `🔒 ${o.reason}`),
        ),
      ),
    ),
  );
}

const oddsClass = (c) => (c >= 0.66 ? 'high' : c >= 0.4 ? 'mid' : 'low');

function resultView(state, card, result, act) {
  const t = result.test;
  return h('div', { class: `result ${result.passed ? 'pass' : 'fail'}` },
    t ? h('div', { class: 'roll-line' },
      h('div', { class: 'die-host' }, dieFace(t.roll, 'die die-landed')),
      h('div', {},
        h('div', { class: 'roll-math' }, `${t.roll} + ${t.bonus} = ${t.total} vs ${t.dc}${t.roll === 6 && t.total < t.dc ? ' (a natural 6 always succeeds)' : ''}`),
        h('div', { class: 'roll-verdict' }, result.passed ? 'Success!' : 'Not this time'),
        t.rerolledBy ? h('div', { class: 'roll-help' }, `${COMPANIONS[t.rerolledBy].icon} ${COMPANIONS[t.rerolledBy].name} gave you a second chance (first roll: ${t.firstRoll})`) : null,
      ),
    ) : null,
    result.text ? h('p', { class: 'result-text' }, result.text) : null,
    result.notes.length ? notesList(result.notes) : null,
    h('button', { class: 'btn-primary continue', onClick: () => act({ type: 'CONTINUE' }), autofocus: true }, 'Continue ⏎'),
  );
}

function notesList(notes) {
  return h('ul', { class: 'notes' }, notes.map((n) => h('li', { class: `note ${noteKind(n)}` }, n)));
}

// Plays the dice for a stat test inside the open card before the result is shown.
export async function animateTest(host, test) {
  const body = host.querySelector('.card-body');
  if (!body) return;
  const dieHost = h('div', { class: 'die-host big' });
  const caption = h('div', { class: 'roll-caption' }, `${STAT_INFO[test.stat].icon} Rolling for ${STAT_NAMES[test.stat]}…`);
  body.replaceChildren(h('div', { class: 'rolling' }, dieHost, caption));
  if (test.rerolledBy) {
    await tumble(dieHost, test.firstRoll);
    caption.textContent = `${test.firstRoll} + ${test.bonus} = ${test.firstRoll + test.bonus}… not enough. ${COMPANIONS[test.rerolledBy].name} steps in!`;
    sound.fail();
    await wait(900);
  }
  await tumble(dieHost, test.roll);
  caption.textContent = `${test.roll} + ${test.bonus} = ${test.total} vs ${test.dc}`;
  if (test.passed) sound.pass();
  else sound.fail();
  await wait(650);
}
