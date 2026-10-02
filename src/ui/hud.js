import { h } from './dom.js';
import { COMPANIONS, ITEMS, TOKENS, REGIONS } from '../data/index.js';
import { STATS, STAT_NAMES, WATCHES, MAX_ITEMS, effectiveStat, statBonus } from '../engine/index.js';

export const STAT_INFO = {
  shakti: { icon: '💪', text: 'Strength: fighting, climbing, hauling and enduring.' },
  buddhi: { icon: '🦉', text: 'Wit: riddles, navigation, learning and tricks.' },
  karuna: { icon: '💗', text: 'Compassion: befriending, calming and persuading.' },
  gati: { icon: '🌬️', text: 'Agility: running, sneaking, dancing and diving.' },
};
const WATCH_ICON = ['🌅', '☀️', '🌇', '🌙'];

export function renderTopbar(el, state, { onJournal, onMap, onMenu }) {
  const region = REGIONS[state.regionIndex];
  el.replaceChildren(
    h('div', { class: 'topbar-title' },
      h('span', { class: 'region-name' }, region.name),
      h('span', { class: 'region-sub' }, region.subtitle),
    ),
    h('div', { class: 'topbar-time', title: 'Each roll moves time forward one watch. Some things only happen at night.' },
      `${WATCH_ICON[state.watch]} Day ${state.day} · ${WATCHES[state.watch]}`,
    ),
    h('nav', { class: 'topbar-actions' },
      h('button', { class: 'btn-ghost', onClick: onJournal, title: 'Journal (J)' }, '📖 Journal'),
      h('button', { class: 'btn-ghost', onClick: onMap, title: 'World map (M)' }, '🗺️ Map'),
      h('button', { class: 'btn-ghost', onClick: onMenu, title: 'Menu (Esc)' }, '☰'),
    ),
  );
}

export function renderSidebar(el, state, ui) {
  const { act, selectedItem, selectItem, confirmDismiss, setConfirmDismiss } = ui;
  const free = !state.ended && (!state.pending || state.pending.kind === 'village');
  const pct = Math.round((state.prana / state.pranaMax) * 100);

  const statusBits = [];
  if (state.buff) statusBits.push(h('span', { class: 'status good', title: 'Applies to your next matching test' }, `✨ +${state.buff.amount} next ${state.buff.stat === 'any' ? 'test' : STAT_NAMES[state.buff.stat] + ' test'}`));
  if (state.shield) statusBits.push(h('span', { class: 'status good', title: 'The next Prana loss is prevented' }, '🛡️ Protected'));
  if (state.chooseRoll) statusBits.push(h('span', { class: 'status good' }, '🪶 You choose your next move'));
  if (state.anna === 0) statusBits.push(h('span', { class: 'status bad', title: 'Each roll without food costs 1 Prana' }, '🍚 Hungry!'));

  el.replaceChildren(
    h('section', { class: 'panel traveller' },
      h('div', { class: 'traveller-name' }, state.name),
      h('div', { class: 'prana', title: 'Prana: your life and energy. At 0 you faint and wake in the last village.' },
        h('div', { class: 'prana-label' }, h('span', {}, '❤️ Prana'), h('span', {}, `${state.prana} / ${state.pranaMax}`)),
        h('div', { class: 'bar' }, h('div', { class: `bar-fill ${pct <= 30 ? 'low' : ''}`, style: { width: `${pct}%` } })),
      ),
      h('div', { class: 'resources' },
        resource('🍚', 'Anna', state.anna, 'Food. Every roll eats 1 Anna; without it you lose Prana.'),
        resource('🪙', 'Mudra', state.mudra, 'Coins for villages, ferries and bribes.'),
        resource('🪷', 'Punya', state.punya, 'Merit from kind deeds. It shapes how your journey can end.'),
      ),
      statusBits.length ? h('div', { class: 'statuses' }, statusBits) : null,
    ),
    h('section', { class: 'panel' },
      h('h3', {}, 'Stats'),
      h('div', { class: 'stats' },
        STATS.map((st) => {
          const bonus = statBonus(state, st);
          return h('div', { class: 'stat', title: `${STAT_NAMES[st]}: ${STAT_INFO[st].text}\nBase ${state.stats[st]}${bonus ? `, +${bonus} from friends and gear` : ''}` },
            h('span', { class: 'stat-icon' }, STAT_INFO[st].icon),
            h('span', { class: 'stat-name' }, STAT_NAMES[st]),
            h('span', { class: 'stat-val' }, effectiveStat(state, st), bonus ? h('small', {}, ` (+${bonus})`) : null),
          );
        }),
      ),
    ),
    h('section', { class: 'panel' },
      h('h3', {}, 'Sacred Tokens'),
      h('div', { class: 'tokens' },
        Object.entries(TOKENS).map(([id, t]) =>
          h('span', { class: `token-slot ${state.tokens.includes(id) ? 'have' : ''}`, title: state.tokens.includes(id) ? t.name : `${t.name}: not yet found` }, state.tokens.includes(id) ? t.icon : '◌'),
        ),
      ),
    ),
    h('section', { class: 'panel' },
      h('h3', {}, `Companions `, h('small', {}, `${state.party.length}/3`)),
      state.party.length
        ? h('div', { class: 'party' }, state.party.map((id) => companionCard(state, id, { act, free, confirmDismiss, setConfirmDismiss })))
        : h('p', { class: 'empty' }, 'You walk alone, for now.'),
      state.waiting.length
        ? h('p', { class: 'waiting' }, `Waiting at the next village: ${state.waiting.map((c) => COMPANIONS[c].name).join(', ')}`)
        : null,
    ),
    h('section', { class: 'panel' },
      h('h3', {}, 'Bag ', h('small', {}, `${state.inventory.length}/${MAX_ITEMS}`)),
      h('div', { class: 'bag' },
        Array.from({ length: MAX_ITEMS }, (_, i) => {
          const id = state.inventory[i];
          if (!id) return h('span', { class: 'bag-slot empty' });
          return h('button', {
            class: `bag-slot ${selectedItem === i ? 'selected' : ''}`,
            title: ITEMS[id].name,
            onClick: () => selectItem(selectedItem === i ? null : i),
          }, ITEMS[id].icon);
        }),
      ),
      selectedItem != null && state.inventory[selectedItem] ? itemDetail(state, state.inventory[selectedItem], { act, free, selectItem }) : null,
    ),
  );
}

function resource(icon, name, value, title) {
  return h('div', { class: 'res', title: `${name}: ${title}` }, h('span', { class: 'res-icon' }, icon), h('span', { class: 'res-val' }, value), h('span', { class: 'res-name' }, name));
}

function companionCard(state, id, { act, free, confirmDismiss, setConfirmDismiss }) {
  const c = COMPANIONS[id];
  const used = state.used[id];
  const passive = c.ability.kind === 'reroll';
  const bonus = Object.entries(c.bonus).map(([k, v]) => `+${v} ${STAT_NAMES[k]}`).join(', ');
  return h('div', { class: 'companion' },
    h('div', { class: 'companion-head' },
      h('span', { class: 'companion-icon' }, c.icon),
      h('div', {}, h('div', { class: 'companion-name' }, c.name), h('div', { class: 'companion-title' }, `${c.title} · ${bonus}`)),
    ),
    h('div', { class: 'companion-ability', title: c.ability.text },
      h('span', {}, `${c.ability.name}: `, h('small', {}, c.ability.text)),
    ),
    h('div', { class: 'companion-actions' },
      passive
        ? h('span', { class: `chip ${used ? 'spent' : 'ready'}` }, used ? 'Used this region' : 'Ready')
        : h('button', { class: 'btn-small', disabled: !free || used || (c.ability.kind === 'wings' && state.pending), onClick: () => act({ type: 'USE_ABILITY', companion: id }) }, used ? 'Used this region' : 'Use'),
      confirmDismiss === id
        ? h('span', { class: 'confirm' },
          h('button', { class: 'btn-small danger', onClick: () => { setConfirmDismiss(null); act({ type: 'DISMISS', companion: id }); } }, 'Part ways'),
          h('button', { class: 'btn-small', onClick: () => setConfirmDismiss(null) }, 'Stay'))
        : h('button', { class: 'btn-link', disabled: !free, onClick: () => setConfirmDismiss(id), title: 'They will wait to rejoin you at the next village' }, 'Part ways…'),
    ),
  );
}

function itemDetail(state, id, { act, free, selectItem }) {
  const it = ITEMS[id];
  return h('div', { class: 'item-detail' },
    h('div', { class: 'item-name' }, `${it.icon} ${it.name}`),
    h('p', {}, it.text),
    h('div', { class: 'item-actions' },
      it.use ? h('button', { class: 'btn-small', disabled: !free, onClick: () => { selectItem(null); act({ type: 'USE_ITEM', item: id }); } }, it.consumable ? 'Use' : 'Use') : null,
      h('button', { class: 'btn-link', disabled: !free, onClick: () => { selectItem(null); act({ type: 'DROP_ITEM', item: id }); } }, 'Drop'),
    ),
  );
}
