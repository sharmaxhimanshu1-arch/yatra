// Dice faces, the dice tumble animation, and toast notes.
import { h, s, wait } from './dom.js';
import { sound } from './sound.js';

const PIPS = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
  6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
};

export function dieFace(n, cls = 'die') {
  return s('svg', { class: cls, viewBox: '0 0 100 100' },
    s('rect', { x: 4, y: 4, width: 92, height: 92, rx: 20, class: 'die-body' }),
    ...PIPS[n].map(([cx, cy]) => s('circle', { cx, cy, r: 9, class: n === 1 ? 'pip pip-one' : 'pip' })),
  );
}

// Tumbles a die inside `host` and settles on `value`.
export async function tumble(host, value, { quick = false } = {}) {
  sound.dice();
  const frames = quick ? 6 : 10;
  for (let i = 0; i < frames; i++) {
    const face = i === frames - 1 ? value : 1 + Math.floor(Math.random() * 6);
    const die = dieFace(face);
    die.style.transform = `rotate(${(Math.random() - 0.5) * 50}deg) scale(${0.9 + Math.random() * 0.15})`;
    host.replaceChildren(die);
    await wait(i < frames - 3 ? 55 : 90);
  }
  const final = dieFace(value, 'die die-landed');
  host.replaceChildren(final);
}

let toastHost = null;
export function toast(text, kind = 'info') {
  if (!toastHost) {
    toastHost = h('div', { class: 'toasts', 'aria-live': 'polite' });
    document.body.append(toastHost);
  }
  const el = h('div', { class: `toast toast-${kind}` }, text);
  toastHost.append(el);
  setTimeout(() => el.classList.add('out'), 2600);
  setTimeout(() => el.remove(), 3100);
}

// Classifies a note like "+3 Anna" for colouring.
export function noteKind(note) {
  if (/^\+/.test(note) || /^(Gained|Befriended|New quest|Quest complete|Sacred Token)|joins you/.test(note)) return 'good';
  if (/^-/.test(note) || /collapse|No room|Gave up|stays behind/.test(note)) return 'bad';
  return 'info';
}
