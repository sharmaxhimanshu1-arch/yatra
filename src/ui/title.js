import { h, s } from './dom.js';
import { saves } from '../engine/index.js';

export function renderTitle(host, store, { onNew, onContinue, onImport }) {
  let naming = null;
  let confirmDelete = null;

  const draw = () => {
    const slots = saves.listSlots(store);
    host.replaceChildren(
      h('main', { class: 'title-screen' },
        titleArt(),
        h('h1', { class: 'title-logo' }, 'Yatra'),
        h('p', { class: 'title-tag' }, 'A journey across five lands to the mountain at the centre of the world'),
        h('div', { class: 'slots' },
          slots.map((sl) => {
            if (naming === sl.slot) {
              const input = h('input', { class: 'name-input', maxlength: 24, placeholder: 'Your name, traveller', value: 'Traveller', 'aria-label': 'Your name' });
              const begin = () => onNew(sl.slot, input.value.trim() || 'Traveller');
              input.addEventListener('keydown', (e) => e.key === 'Enter' && begin());
              setTimeout(() => input.select(), 0);
              return h('div', { class: 'slot new' },
                h('div', { class: 'slot-label' }, `Journey ${sl.slot}`),
                input,
                h('div', { class: 'slot-actions' },
                  h('button', { class: 'btn-primary', onClick: begin }, 'Set out'),
                  h('button', { class: 'btn-link', onClick: () => { naming = null; draw(); } }, 'Cancel'),
                ),
              );
            }
            if (sl.empty) {
              return h('button', { class: 'slot empty', onClick: () => { naming = sl.slot; draw(); } },
                h('div', { class: 'slot-label' }, `Journey ${sl.slot}`),
                h('div', { class: 'slot-empty' }, '+ Begin a new journey'),
              );
            }
            if (sl.broken) {
              return h('div', { class: 'slot' }, h('div', { class: 'slot-label' }, `Journey ${sl.slot}`), h('p', {}, 'This save is damaged.'),
                h('button', { class: 'btn-link', onClick: () => { saves.deleteGame(store, sl.slot); draw(); } }, 'Clear it'));
            }
            return h('div', { class: 'slot' },
              h('div', { class: 'slot-label' }, `Journey ${sl.slot}`),
              h('div', { class: 'slot-name' }, sl.name),
              h('div', { class: 'slot-meta' }, sl.ended ? '✨ Journey complete' : `${sl.region} · day ${sl.day} · ${sl.tokens}/5 tokens`),
              h('div', { class: 'slot-meta muted' }, `Saved ${new Date(sl.savedAt).toLocaleString()}`),
              h('div', { class: 'slot-actions' },
                h('button', { class: 'btn-primary', onClick: () => onContinue(sl.slot) }, sl.ended ? 'Revisit' : 'Continue'),
                confirmDelete === sl.slot
                  ? h('span', { class: 'confirm' },
                    h('button', { class: 'btn-small danger', onClick: () => { saves.deleteGame(store, sl.slot); confirmDelete = null; draw(); } }, 'Delete forever'),
                    h('button', { class: 'btn-small', onClick: () => { confirmDelete = null; draw(); } }, 'Keep'))
                  : h('button', { class: 'btn-link', onClick: () => { confirmDelete = sl.slot; draw(); } }, 'Delete…'),
              ),
            );
          }),
        ),
        h('div', { class: 'title-foot' },
          h('label', { class: 'btn-link file-label' }, 'Import a save file…',
            h('input', {
              type: 'file', accept: '.json,application/json', hidden: true,
              onChange: async (e) => {
                const file = e.target.files[0];
                if (file) onImport(await file.text(), draw);
              },
            }),
          ),
        ),
      ),
    );
  };
  draw();
}

function titleArt() {
  return s('svg', { class: 'title-art', viewBox: '0 0 400 160', 'aria-hidden': 'true' },
    s('defs', {},
      s('linearGradient', { id: 'tg', x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: 0, 'stop-color': '#fde68a' }), s('stop', { offset: 1, 'stop-color': '#d97706' })),
    ),
    s('circle', { cx: 200, cy: 70, r: 46, fill: '#fcd34d', opacity: 0.55, class: 'title-sun' }),
    s('polygon', { points: '200,14 290,150 110,150', fill: 'url(#tg)' }),
    s('polygon', { points: '200,14 222,52 210,46 200,62 190,48 178,54', fill: '#fff7d6' }),
    s('polygon', { points: '90,150 150,80 210,150', fill: '#7c8fa6', opacity: 0.8 }),
    s('polygon', { points: '190,150 260,70 330,150', fill: '#8aa0b8', opacity: 0.8 }),
    s('path', { d: 'M20 150 Q 120 120 200 140 T 380 135', stroke: '#c2410c', 'stroke-width': 3, 'stroke-dasharray': '3 8', fill: 'none', 'stroke-linecap': 'round' }),
  );
}
