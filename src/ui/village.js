import { h } from './dom.js';
import { ITEMS, COMPANIONS, QUESTS, FOOD, REGION_BY_ID } from '../data/index.js';
import { villageRecruits, villageQuests, MAX_ITEMS, MAX_PARTY, STAT_NAMES } from '../engine/index.js';

export function renderVillage(host, state, { act }) {
  const p = state.pending;
  const node = REGION_BY_ID[state.region].nodes[p.node];
  const cost = node.restCost ?? 2;
  const recruits = villageRecruits(state, node);
  const quests = villageQuests(state, node);
  const bagFull = state.inventory.length >= MAX_ITEMS;

  host.replaceChildren(
    h('div', { class: 'overlay' },
      h('article', { class: 'village', role: 'dialog', 'aria-label': node.label },
        h('header', { class: 'village-head' },
          h('div', { class: 'card-art' }, '🏘️'),
          h('div', {}, h('div', { class: 'card-kind' }, 'Village'), h('h2', { class: 'card-title' }, node.label), h('p', { class: 'village-text' }, node.text)),
        ),
        h('div', { class: 'village-grid' },
          h('section', { class: 'vsec' },
            h('h3', {}, '🛏️ Rest'),
            p.rested
              ? h('p', { class: 'muted' }, 'You have rested here.')
              : h('div', { class: 'vbtns' },
                h('button', { class: 'btn', disabled: state.mudra < cost || state.prana >= state.pranaMax, onClick: () => act({ type: 'REST', paid: true }) },
                  cost ? `Stay at the inn (${cost} 🪙): full Prana` : 'Rest as an honoured guest: full Prana'),
                h('button', { class: 'btn-ghost', disabled: state.prana >= state.pranaMax, onClick: () => act({ type: 'REST', paid: false }) }, 'Sleep on a veranda (free): +3 Prana'),
              ),
          ),
          h('section', { class: 'vsec' },
            h('h3', {}, '🛒 Market'),
            h('div', { class: 'shop' },
              shopRow({ icon: '🍚', name: `Food (+${FOOD.amount} Anna)`, text: 'Rice, dal, rotis wrapped in a cloth.' }, FOOD.price, state.mudra < FOOD.price, () => act({ type: 'BUY', item: 'food' })),
              (node.shop ?? []).map((id) => {
                const it = ITEMS[id];
                const owned = state.inventory.includes(id) && it.bonus;
                const why = owned ? 'Owned' : bagFull ? 'Bag full' : null;
                return shopRow(it, it.price, state.mudra < it.price || bagFull || owned, () => act({ type: 'BUY', item: id }), why);
              }),
            ),
          ),
          quests.length
            ? h('section', { class: 'vsec' },
              h('h3', {}, '📜 Someone needs help'),
              quests.map((q) =>
                h('div', { class: 'offer' },
                  h('div', {}, h('strong', {}, QUESTS[q].title), h('p', {}, QUESTS[q].text), h('small', { class: 'muted' }, QUESTS[q].giver)),
                  h('button', { class: 'btn', onClick: () => act({ type: 'ACCEPT_QUEST', quest: q }) }, 'Accept'),
                ),
              ),
            )
            : null,
          recruits.length
            ? h('section', { class: 'vsec' },
              h('h3', {}, '🤝 Friends to be'),
              recruits.map((id) => {
                const c = COMPANIONS[id];
                const bonus = Object.entries(c.bonus).map(([k, v]) => `+${v} ${STAT_NAMES[k]}`).join(', ');
                return h('div', { class: 'offer' },
                  h('div', {},
                    h('strong', {}, `${c.icon} ${c.name}, ${c.title}`),
                    h('p', {}, c.text),
                    h('small', { class: 'muted' }, `${bonus} · ${c.ability.name}: ${c.ability.text}`),
                  ),
                  h('button', { class: 'btn', disabled: state.party.length >= MAX_PARTY, title: state.party.length >= MAX_PARTY ? 'Your party is full: part ways with someone first' : '', onClick: () => act({ type: 'RECRUIT', companion: id }) },
                    state.party.length >= MAX_PARTY ? 'Party full' : 'Invite'),
                );
              }),
            )
            : null,
        ),
        h('footer', { class: 'village-foot' },
          h('span', { class: 'muted' }, `You have ${state.mudra} 🪙 · ${state.anna} 🍚 · ${state.prana}/${state.pranaMax} ❤️`),
          h('button', { class: 'btn-primary', onClick: () => act({ type: 'LEAVE' }) }, 'Continue the journey →'),
        ),
      ),
    ),
  );
}

function shopRow(it, price, disabled, onBuy, why) {
  return h('div', { class: 'shop-row', title: it.text },
    h('span', { class: 'shop-icon' }, it.icon),
    h('span', { class: 'shop-name' }, it.name, h('small', {}, it.text)),
    h('button', { class: 'btn-small', disabled, onClick: onBuy }, why ?? `${price} 🪙`),
  );
}
