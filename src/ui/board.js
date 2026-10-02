import { s, wait } from './dom.js';
import { TILES, REGION_THEME } from './tiles.js';
import { sceneryFor, SCENERY_DEFS } from './scenery.js';

const TINTS = { 0: ["#ff9a3c", 0.14], 1: [null, 0], 2: ["#7b3fa0", 0.18], 3: ["#0b1a5c", 0.4] };
const BIG = new Set(['village', 'landmark', 'gate', 'start']);

export class Board {
  constructor(container, { onPick }) {
    this.container = container;
    this.onPick = onPick;
    this.region = null;
    this.tokenAt = null;
    this.svg = s('svg', { class: 'board', viewBox: '0 0 1000 620', preserveAspectRatio: 'xMidYMid meet', role: 'img' });
    container.append(this.svg);
    this.svg.addEventListener('click', (e) => {
      const g = e.target.closest('.node.pick');
      if (g) this.onPick(g.dataset.id);
    });
  }

  build(region) {
    this.region = region;
    const theme = REGION_THEME[region.id];
    const nodes = Object.values(region.nodes);
    const edges = nodes.flatMap((n) => n.next.map((to) => [n, region.nodes[to]]));
    const curve = ([a, b]) => {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      return `M${a.x} ${a.y} Q${mx + (b.y - a.y) * 0.08} ${my - (b.x - a.x) * 0.08} ${b.x} ${b.y}`;
    };
    this.svg.setAttribute('aria-label', `Board: ${region.name}`);
    this.svg.setAttribute('class', `board region-${region.id}`);
    this.svg.innerHTML = `
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${theme.sky[0]}"/><stop offset="1" stop-color="${theme.sky[1]}"/></linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity=".35"/></filter>
        <radialGradient id="glow"><stop offset="0" stop-color="#fff6c8" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient>
        ${SCENERY_DEFS}
      </defs>
      <rect x="-1000" y="-600" width="3000" height="1820" fill="url(#sky)"/>
      <g class="scenery">${sceneryFor(region)}</g>
      <rect class="tint" x="-1000" y="-600" width="3000" height="1820" fill="none" opacity="0"/>
      <g class="night-stars" opacity="0">${Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 163) % 1000}" cy="${(i * 97) % 300}" r="${1 + (i % 3) * 0.5}" fill="#fff"/>`).join('')}</g>
      <g class="trail">
        ${edges.map((e) => `<path d="${curve(e)}" stroke="${theme.edge}" stroke-width="15" stroke-linecap="round" fill="none" opacity=".55"/>`).join('')}
        ${edges.map((e) => `<path d="${curve(e)}" stroke="${theme.trail}" stroke-width="9" stroke-linecap="round" fill="none"/>`).join('')}
        ${edges.map(([a, b]) => `<path class="walked" data-edge="${a.id}>${b.id}" d="${curve([a, b])}" stroke="${theme.accent}" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round" fill="none" opacity="0"/>`).join('')}
      </g>
      <g class="nodes">
        ${nodes.map((n) => this.nodeMarkup(n)).join('')}
      </g>
    `;
    this.token = s('g', { class: 'token', filter: 'url(#shadow)' },
      s('circle', { r: 30, fill: 'url(#glow)', class: 'token-glow' }),
      s('ellipse', { cy: 4, rx: 11, ry: 4, fill: '#000', opacity: 0.25 }),
      s('path', { d: 'M-10 3 Q-9 -14 0 -16 Q9 -14 10 3 Z', fill: '#c2410c', stroke: '#fff', 'stroke-width': 2 }),
      s('circle', { cy: -22, r: 8, fill: '#f59e0b', stroke: '#fff', 'stroke-width': 2 }),
      s('path', { d: 'M3 -30 L3 -46 L16 -41 L3 -36', fill: '#facc15', stroke: '#7c2d12', 'stroke-width': 1.5 }),
    );
    this.svg.append(this.token);
    this.tokenAt = null;
  }

  nodeMarkup(n) {
    const t = TILES[n.type];
    const rad = BIG.has(n.type) ? 23 : 18;
    const labelY = n.y > 560 ? -rad - 9 : rad + 17;
    const label = n.label
      ? `<text class="node-label" y="${labelY}" text-anchor="middle">${escapeXml(n.label)}</text>`
      : '';
    return `<g class="node t-${n.type}" data-id="${n.id}" transform="translate(${n.x} ${n.y})">
      <title>${escapeXml(n.label ? `${n.label} (${t.name})` : t.name)}: ${escapeXml(t.text)}</title>
      <circle class="pick-ring" r="${rad + 9}" fill="none" stroke="#fff" stroke-width="3"/>
      <circle r="${rad}" fill="${t.color}" stroke="#fff" stroke-width="3" filter="url(#shadow)"/>
      <circle r="${rad - 5}" fill="#fff" opacity=".16"/>
      <text class="node-icon" y="${rad > 20 ? 7 : 6}" font-size="${rad > 20 ? 20 : 16}" text-anchor="middle">${t.icon}</text>
      ${label}
    </g>`;
  }

  // Sync everything that doesn't animate: token, walked trail, time of day.
  update(state) {
    const visited = new Set(state.route);
    const walked = new Set();
    for (let i = 1; i < state.route.length; i++) walked.add(`${state.route[i - 1]}>${state.route[i]}`);
    this.svg.querySelectorAll('.walked').forEach((p) => p.setAttribute('opacity', walked.has(p.dataset.edge) ? 0.95 : 0));
    this.svg.querySelectorAll('.node').forEach((g) => g.classList.toggle('visited', visited.has(g.dataset.id) && g.dataset.id !== state.pos));
    const [color, alpha] = TINTS[state.watch];
    const tint = this.svg.querySelector('.tint');
    tint.setAttribute('fill', color ?? 'none');
    tint.setAttribute('opacity', alpha);
    this.svg.querySelector('.night-stars').setAttribute('opacity', state.watch === 3 ? 0.8 : 0);
    this.placeToken(state.pos);
    this.clearFork();
    if (state.pending?.kind === 'fork') this.showFork(state.pending.options);
  }

  placeToken(id) {
    const n = this.region.nodes[id];
    this.tokenAt = id;
    this.token.style.transform = `translate(${n.x}px, ${n.y - 4}px)`;
  }

  async hop(to, ms = 230) {
    const a = this.region.nodes[this.tokenAt] ?? this.region.nodes[to];
    const b = this.region.nodes[to];
    const mid = `translate(${(a.x + b.x) / 2}px, ${(a.y + b.y) / 2 - 26}px)`;
    const anim = this.token.animate(
      [{ transform: `translate(${a.x}px, ${a.y - 4}px)` }, { transform: mid }, { transform: `translate(${b.x}px, ${b.y - 4}px)` }],
      { duration: ms, easing: 'ease-in-out' },
    );
    this.placeToken(to);
    // Animations stall in hidden tabs, so never wait on them for longer than they should take.
    await Promise.race([anim.finished.catch(() => {}), wait(ms + 120)]);
  }

  showFork(options) {
    for (const id of options) this.svg.querySelector(`.node[data-id="${id}"]`)?.classList.add('pick');
  }

  clearFork() {
    this.svg.querySelectorAll('.node.pick').forEach((g) => g.classList.remove('pick'));
  }

  // The tile types along a fork lane until the trail merges again, for the path picker.
  lanePreview(start) {
    const out = [];
    let id = start;
    const merge = this.mergePoint(start);
    while (id && id !== merge && out.length < 6) {
      out.push(this.region.nodes[id]);
      id = this.region.nodes[id].next[0];
    }
    return out;
  }

  mergePoint(start) {
    // The first node reachable from every lane: walk this lane and stop at a node with >1 parent.
    const parents = {};
    for (const n of Object.values(this.region.nodes)) for (const to of n.next) parents[to] = (parents[to] ?? 0) + 1;
    let id = this.region.nodes[start].next[0];
    while (id && (parents[id] ?? 0) < 2) id = this.region.nodes[id].next[0];
    return id;
  }
}

function escapeXml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
}
