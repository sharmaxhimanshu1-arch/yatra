import { h, s } from './dom.js';
import { REGIONS, REGION_BY_ID, CREATURES, COMPANIONS, QUESTS, TOKENS, ENDINGS } from '../data/index.js';
import { friendCount, STAT_NAMES } from '../engine/index.js';
import { TILES } from './tiles.js';

function modal(host, { title, cls = '', onClose, wide = false }, ...content) {
  const close = h('button', { class: 'modal-close', onClick: onClose, 'aria-label': 'Close' }, '✕');
  host.replaceChildren(
    h('div', { class: 'overlay', onClick: (e) => e.target === e.currentTarget && onClose() },
      h('article', { class: `modal ${wide ? 'wide' : ''} ${cls}`, role: 'dialog', 'aria-label': title },
        h('header', { class: 'modal-head' }, h('h2', {}, title), close),
        h('div', { class: 'modal-body' }, content),
      ),
    ),
  );
}

// ---- journal ---------------------------------------------------------------

const TABS = ['Quests', 'Bestiary', 'Friends', 'Places', 'Chronicle'];

export function renderJournal(host, state, { tab = 'Quests', setTab, onClose }) {
  const tabs = h('div', { class: 'tabs', role: 'tablist' },
    TABS.map((t) => h('button', { class: `tab ${t === tab ? 'active' : ''}`, role: 'tab', 'aria-selected': t === tab, onClick: () => setTab(t) }, t)),
  );
  const body = { Quests: questsTab, Bestiary: bestiaryTab, Friends: friendsTab, Places: placesTab, Chronicle: chronicleTab }[tab](state);
  modal(host, { title: '📖 Journal', onClose, wide: true }, tabs, h('div', { class: 'tab-body' }, body));
}

function questsTab(state) {
  const entries = Object.entries(state.quests);
  const active = entries.filter(([, q]) => !q.done);
  const done = entries.filter(([, q]) => q.done);
  const main = h('div', { class: 'quest main-quest' },
    h('strong', {}, '🗺️ The Road to Meru'),
    h('p', {}, `Gather the five Sacred Tokens and climb Mount Meru. ${state.tokens.length} of 5 found.`),
    h('div', { class: 'tokens inline' }, Object.entries(TOKENS).map(([id, t]) => h('span', { class: `token-slot ${state.tokens.includes(id) ? 'have' : ''}`, title: t.name }, state.tokens.includes(id) ? t.icon : '◌'))),
  );
  return [
    main,
    active.length ? h('h3', {}, 'Under way') : null,
    active.map(([id, q]) => {
      const def = QUESTS[id];
      return h('div', { class: 'quest' },
        h('strong', {}, def.title), h('small', { class: 'muted' }, ` from ${def.giver}`),
        h('p', {}, def.text),
        h('ol', { class: 'steps' }, def.steps.map((st, i) => h('li', { class: i < q.step ? 'done' : i === q.step ? 'current' : 'later' }, i <= q.step ? st.text : '…'))),
      );
    }),
    done.length ? h('h3', {}, 'Completed') : null,
    done.map(([id]) => h('div', { class: 'quest done' }, h('strong', {}, `✓ ${QUESTS[id].title}`))),
    !entries.length ? h('p', { class: 'muted' }, 'Villagers and friends will ask for your help along the way.') : null,
  ];
}

function bestiaryTab(state) {
  const met = Object.keys(state.journal.creatures).length;
  return [
    h('p', { class: 'muted' }, `Met ${met} of ${Object.keys(CREATURES).length} creatures · befriended ${friendCount(state)}.`),
    REGIONS.map((r) => {
      const list = Object.entries(CREATURES).filter(([, c]) => c.region === r.id);
      return h('div', {},
        h('h3', {}, r.name),
        h('div', { class: 'bestiary' },
          list.map(([id, c]) => {
            const status = state.journal.creatures[id];
            if (!status) return h('div', { class: 'beast unknown', title: 'Not yet met' }, h('span', { class: 'beast-icon' }, '?'), h('span', { class: 'beast-name' }, '???'));
            return h('div', { class: `beast ${status}` },
              h('span', { class: 'beast-icon' }, c.icon),
              h('span', { class: 'beast-name' }, c.name),
              h('span', { class: 'beast-status' }, status === 'friend' ? '💛 Friend' : 'Met'),
              h('p', { class: 'beast-text' }, c.text),
            );
          }),
        ),
      );
    }),
  ];
}

function friendsTab(state) {
  if (!state.journal.friends.length) return h('p', { class: 'muted' }, 'You have not made any travelling companions yet.');
  return h('div', { class: 'friends' },
    state.journal.friends.map((id) => {
      const c = COMPANIONS[id];
      const q = c.quest && state.quests[c.quest];
      const where = state.party.includes(id) ? 'Travelling with you' : state.waiting.includes(id) ? 'Waiting to rejoin you' : 'Stayed behind';
      return h('div', { class: 'friend' },
        h('div', { class: 'companion-head' }, h('span', { class: 'companion-icon' }, c.icon), h('div', {}, h('strong', {}, c.name), h('div', { class: 'muted' }, `${c.title} · ${where}`))),
        h('p', {}, c.text),
        h('small', {}, `${Object.entries(c.bonus).map(([k, v]) => `+${v} ${STAT_NAMES[k]}`).join(', ')} · ${c.ability.name}: ${c.ability.text}`),
        q ? h('p', { class: 'muted' }, q.done ? `✓ ${QUESTS[c.quest].title}` : `◇ ${QUESTS[c.quest].title}: ${QUESTS[c.quest].steps[q.step].text}`) : null,
      );
    }),
  );
}

function placesTab(state) {
  if (!state.journal.places.length) return h('p', { class: 'muted' }, 'Villages and landmarks you reach are recorded here.');
  return REGIONS.filter((r) => state.journal.places.some((p) => p.region === r.id)).map((r) =>
    h('div', {},
      h('h3', {}, r.name),
      state.journal.places.filter((p) => p.region === r.id).map((p) => h('div', { class: 'place' }, h('strong', {}, p.name), h('small', { class: 'muted' }, ` · day ${p.day}`), h('p', {}, p.text))),
    ),
  );
}

function chronicleTab(state) {
  const log = [...state.journal.log].reverse();
  if (!log.length) return h('p', { class: 'muted' }, 'Your story is just beginning.');
  return h('ul', { class: 'chronicle' }, log.map((e) => h('li', {}, h('span', { class: 'muted' }, `Day ${e.day} · ${REGION_BY_ID[e.region]?.name.replace(/^The /, '') ?? ''}`), ' ', e.text)));
}

// ---- world map ---------------------------------------------------------------

const MAP_POS = { ganga: [470, 250], dandaka: [440, 360], maru: [215, 255], coast: [395, 505], himalaya: [470, 120], meru: [640, 45] };
const MAP_ICON = { ganga: '🌊', dandaka: '🌳', maru: '🏜️', coast: '🐚', himalaya: '🏔️', meru: '✨' };

export function renderWorldMap(host, state, { onClose }) {
  const land = 'M 300 80 Q 420 40 560 70 L 640 110 Q 700 160 650 230 Q 610 300 560 370 Q 500 470 430 575 Q 400 600 380 560 Q 330 460 300 400 Q 250 330 160 300 Q 110 270 150 220 Q 200 170 260 150 Z';
  const svg = s('svg', { class: 'worldmap', viewBox: '0 0 800 620' },
    s('rect', { width: 800, height: 620, fill: '#a9d3e0' }),
    s('path', { d: land, fill: '#efe1bd', stroke: '#b89a63', 'stroke-width': 3 }),
    s('path', { d: 'M 300 80 Q 420 40 560 70 L 640 110 Q 600 130 470 150 Q 360 150 300 80 Z', fill: '#e7eef4', opacity: 0.9 }),
    s('path', { d: 'M 160 300 Q 200 240 280 230 Q 300 300 250 330 Z', fill: '#f2cf8c', opacity: 0.8 }),
    s('path', { d: 'M 380 300 Q 470 300 520 380 Q 470 420 400 400 Z', fill: '#9cc58a', opacity: 0.8 }),
  );
  // The route between regions, in journey order.
  for (let i = 1; i < REGIONS.length; i++) {
    const [ax, ay] = MAP_POS[REGIONS[i - 1].id];
    const [bx, by] = MAP_POS[REGIONS[i].id];
    const done = i <= state.regionIndex;
    svg.append(s('path', { d: `M${ax} ${ay} Q${(ax + bx) / 2 + 40} ${(ay + by) / 2} ${bx} ${by}`, fill: 'none', stroke: done ? '#c2410c' : '#7a6a55', 'stroke-width': done ? 4 : 2.5, 'stroke-dasharray': done ? '' : '6 8', opacity: done ? 0.9 : 0.6 }));
  }
  REGIONS.forEach((r, i) => {
    const [x, y] = MAP_POS[r.id];
    const here = i === state.regionIndex;
    const done = i < state.regionIndex;
    const tok = r.token && state.tokens.includes(r.token) ? TOKENS[r.token].icon : '';
    svg.append(s('g', { transform: `translate(${x} ${y})`, class: `map-region ${here ? 'here' : ''}` },
      here ? s('circle', { r: 38, fill: '#fff', opacity: 0.6, class: 'map-pulse' }) : null,
      s('circle', { r: 28, fill: done ? '#fde68a' : here ? '#fff7ed' : '#f5f0e6', stroke: here ? '#c2410c' : '#8a7a62', 'stroke-width': here ? 4 : 2 }),
      s('text', { y: 9, 'text-anchor': 'middle', 'font-size': 26 }, i > state.regionIndex + 1 ? '❔' : MAP_ICON[r.id]),
      s('text', { y: 50, 'text-anchor': 'middle', class: 'map-label' }, i > state.regionIndex + 1 ? '???' : r.name.replace(/^The /, '')),
      tok ? s('text', { x: 26, y: -18, 'font-size': 18 }, tok) : null,
    ));
  });
  modal(host, { title: '🗺️ The Half-Burnt Map', onClose, wide: true },
    h('p', { class: 'muted center' }, `Region ${state.regionIndex + 1} of ${REGIONS.length} · ${state.steps} steps walked · day ${state.day}`),
    svg,
  );
}

// ---- menu & help --------------------------------------------------------------

export function renderMenu(host, { onClose, onSaveQuit, onExport, onHelp, onToggleSound, muted }) {
  modal(host, { title: 'Menu', onClose },
    h('div', { class: 'menu' },
      h('button', { class: 'btn', onClick: onClose }, '▶ Resume'),
      h('button', { class: 'btn', onClick: onHelp }, '❓ How to play'),
      h('button', { class: 'btn', onClick: onToggleSound }, muted ? '🔇 Sound: off' : '🔊 Sound: on'),
      h('button', { class: 'btn', onClick: onExport }, '💾 Export save file'),
      h('button', { class: 'btn-ghost', onClick: onSaveQuit }, '🏠 Save & return to title'),
      h('p', { class: 'muted small' }, 'Your journey saves automatically after every move.'),
    ),
  );
}

export function renderHelp(host, { onClose }) {
  modal(host, { title: '❓ How to play', onClose, wide: true },
    h('div', { class: 'help' },
      h('p', {}, 'You are a traveller from the village of Sonpur, following a dying rishi’s map across five lands to Mount Meru. Earn each land’s Sacred Token at its Gate, then travel on.'),
      h('h3', {}, 'Each turn'),
      h('ol', {},
        h('li', {}, h('strong', {}, 'Roll'), ' (Space) and walk that many tiles. At a fork, click the path you want.'),
        h('li', {}, 'Every roll eats 1 ', h('strong', {}, 'Anna'), ' (food). With none left, you lose 1 Prana instead.'),
        h('li', {}, 'Where you stop, the tile acts. ', h('strong', {}, 'Villages and Gates always stop you'), ', even mid-move.'),
        h('li', {}, 'Each roll is one watch: Dawn, Day, Dusk, Night. Some things only happen at night.'),
      ),
      h('h3', {}, 'Tiles'),
      h('div', { class: 'legend' }, Object.entries(TILES).map(([, t]) => h('div', { class: 'legend-row' }, h('span', { class: 'legend-dot', style: { background: t.color } }, t.icon), h('strong', {}, t.name), h('span', {}, t.text)))),
      h('h3', {}, 'Tests'),
      h('p', {}, 'Most choices test a stat: roll a die and add the stat. Match or beat the number and you succeed. A 6 always succeeds. The percentage shows your odds. ', h('strong', {}, 'Shakti'), ' is strength, ', h('strong', {}, 'Buddhi'), ' wit, ', h('strong', {}, 'Karuna'), ' compassion, and ', h('strong', {}, 'Gati'), ' agility.'),
      h('h3', {}, 'Friends and fainting'),
      h('p', {}, 'Up to three companions travel with you, each with a stat bonus and an ability you can use once per land. Most creatures can be befriended, and they fill your Bestiary. If your Prana reaches 0 you faint and wake in the last village you visited, with half your coins. There is no game over.'),
      h('h3', {}, 'Punya'),
      h('p', {}, 'Kindness earns Punya. How much you have, and who walks beside you, decides how your journey can end at the summit of Meru.'),
      h('h3', {}, 'Keys'),
      h('p', {}, 'Space: roll / continue · 1–5: choose · J: journal · M: map · Esc: close or menu'),
    ),
  );
}

// ---- region complete & ending ----------------------------------------------------

export function renderRegionDone(host, state, { act }) {
  const here = REGIONS[state.regionIndex];
  const next = REGIONS[state.regionIndex + 1];
  const token = TOKENS[here.token];
  const metHere = Object.entries(state.journal.creatures).filter(([id]) => CREATURES[id].region === here.id);
  host.replaceChildren(
    h('div', { class: 'overlay' },
      h('article', { class: 'modal celebrate', role: 'dialog', 'aria-label': 'Land complete' },
        h('div', { class: 'big-icon' }, token?.icon ?? '✨'),
        h('div', { class: 'card-kind' }, 'Sacred Token'),
        h('h2', {}, token?.name ?? here.name),
        h('p', {}, `You have crossed ${here.name}. ${state.tokens.length} of 5 tokens gathered.`),
        metHere.length ? h('p', { class: 'muted' }, `Creatures met here: ${metHere.map(([id, st]) => `${CREATURES[id].icon}${st === 'friend' ? '💛' : ''}`).join(' ')}`) : null,
        h('div', { class: 'next-region' },
          h('div', { class: 'card-kind' }, 'The road leads on to'),
          h('h3', {}, next.name),
          h('p', { class: 'muted' }, next.subtitle),
        ),
        h('button', { class: 'btn-primary', autofocus: true, onClick: () => act({ type: 'TRAVEL' }) }, `Travel to ${next.name.replace(/^The /, '')} →`),
      ),
    ),
  );
}

export function renderEnding(host, state, { onTitle }) {
  const e = ENDINGS[state.ended];
  const doneQuests = Object.values(state.quests).filter((q) => q.done).length;
  const stats = [
    ['Days on the road', state.day],
    ['Steps walked', state.steps],
    ['Creatures met', Object.keys(state.journal.creatures).length],
    ['Creatures befriended', friendCount(state)],
    ['Companions', state.journal.friends.map((c) => COMPANIONS[c].icon).join(' ') || 'none'],
    ['Quests completed', doneQuests],
    ['Punya', state.punya],
    ['Times fainted', state.faints],
  ];
  host.replaceChildren(
    h('div', { class: 'overlay ending-overlay' },
      h('article', { class: 'ending', role: 'dialog', 'aria-label': e.title },
        h('div', { class: 'big-icon' }, e.icon),
        h('div', { class: 'card-kind' }, 'Journey’s End'),
        h('h2', {}, e.title),
        h('p', { class: 'ending-text' }, e.text),
        h('dl', { class: 'ending-stats' }, stats.map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
        h('p', { class: 'muted' }, `Endings exist for the kind, the friendly and the well-accompanied. There are ${Object.keys(ENDINGS).length} in all.`),
        h('button', { class: 'btn-primary', onClick: onTitle }, 'Return to the title'),
      ),
    ),
  );
}

// ---- fork picker -------------------------------------------------------------------

export function renderForkBar(host, state, board, { act }) {
  const { options, remaining } = state.pending;
  host.replaceChildren(
    h('div', { class: 'forkbar' },
      h('div', { class: 'forkbar-title' }, `The path splits. ${remaining} step${remaining > 1 ? 's' : ''} left. Which way?`),
      h('div', { class: 'forkbar-options' },
        options.map((id, i) => {
          const lane = board.lanePreview(id);
          return h('button', { class: 'fork-option', onClick: () => act({ type: 'CHOOSE_FORK', to: id }) },
            h('span', { class: 'choice-key' }, i + 1),
            h('span', { class: 'lane' }, lane.map((n) => h('span', { class: 'lane-tile', title: n.label ?? TILES[n.type].name, style: { background: TILES[n.type].color } }, TILES[n.type].icon))),
            h('span', { class: 'lane-text' }, lane.map((n) => n.label ?? TILES[n.type].name).join(' → ')),
          );
        }),
      ),
    ),
  );
}
