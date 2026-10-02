// Procedural background art for each region, as SVG markup. Seeded so a board always looks the same.
import { seedFrom, next } from '../engine/rng.js';

const W = 1000, H = 620;

function scatter(rng, count, region, minFromTrail, extraAvoid = []) {
  const pts = [];
  const trail = region.curve.filter((_, i) => i % 3 === 0);
  const nodes = Object.values(region.nodes);
  let tries = 0;
  while (pts.length < count && tries++ < count * 40) {
    const x = 15 + next(rng) * (W - 30);
    const y = 15 + next(rng) * (H - 30);
    const near = (list, d) => list.some(([px, py]) => (px - x) ** 2 + (py - y) ** 2 < d * d);
    if (near(trail, minFromTrail)) continue;
    if (nodes.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < (minFromTrail + 18) ** 2)) continue;
    if (extraAvoid.some((f) => f(x, y))) continue;
    if (near(pts, 26)) continue;
    pts.push([x, y]);
  }
  return pts.sort((a, b) => a[1] - b[1]); // paint back to front
}

const r = (rng, a, b) => a + next(rng) * (b - a);

function tree(x, y, size, fill, trunk = '#6b4a2b') {
  return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><rect x="-2" y="0" width="4" height="${size * 0.9}" fill="${trunk}"/><circle r="${size}" fill="${fill}"/><circle r="${size * 0.55}" cx="${-size * 0.3}" cy="${-size * 0.3}" fill="#fff" opacity=".12"/></g>`;
}

function palm(x, y, s) {
  const fronds = [-150, -110, -70, -30, 10].map((a) => {
    const rad = (a * Math.PI) / 180;
    return `<path d="M0 ${-s * 2} q ${Math.cos(rad) * s} ${Math.sin(rad) * s - 6} ${Math.cos(rad) * s * 1.6} ${Math.sin(rad) * s * 1.2 + 4}" stroke="#2e7d4f" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  });
  return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><path d="M0 0 q 4 ${-s} 0 ${-s * 2}" stroke="#8a6a3d" stroke-width="4" fill="none"/>${fronds.join('')}</g>`;
}

function mountain(x, y, w, h, body, snow) {
  const peak = `${x},${y - h}`;
  return `<polygon points="${x - w / 2},${y} ${peak} ${x + w / 2},${y}" fill="${body}"/>` +
    `<polygon points="${x - w * 0.16},${y - h * 0.68} ${peak} ${x + w * 0.16},${y - h * 0.68} ${x + w * 0.05},${y - h * 0.6} ${x - w * 0.04},${y - h * 0.7}" fill="${snow}"/>`;
}

const SCENERY = {
  ganga(region, rng) {
    let out = '';
    // Fields
    for (const [x, y] of scatter(rng, 14, region, 55)) {
      const w = r(rng, 50, 90), h = r(rng, 26, 40);
      const c = ['#b9cf72', '#d7d27a', '#a8c46a'][Math.floor(next(rng) * 3)];
      out += `<g transform="translate(${x - w / 2} ${y - h / 2}) skewX(-12)"><rect width="${w}" height="${h}" rx="4" fill="${c}"/>`;
      for (let i = 6; i < h; i += 7) out += `<line x1="3" x2="${w - 3}" y1="${i}" y2="${i}" stroke="#8fa64f" stroke-width="1.4" opacity=".6"/>`;
      out += '</g>';
    }
    // The river
    out += `<path d="M-20 300 C 150 250, 260 470, 470 450 S 760 250, 1020 330" stroke="#7fb7d6" stroke-width="46" fill="none" opacity=".85"/>`;
    out += `<path d="M-20 300 C 150 250, 260 470, 470 450 S 760 250, 1020 330" stroke="#bfe0ef" stroke-width="3" stroke-dasharray="16 22" fill="none" opacity=".8"/>`;
    for (const [x, y] of scatter(rng, 26, region, 40)) out += tree(x, y, r(rng, 9, 15), ['#4f8a3c', '#3e7a35', '#6a9a45'][Math.floor(next(rng) * 3)]);
    return out;
  },
  dandaka(region, rng) {
    let out = '';
    for (const [x, y] of scatter(rng, 5, region, 60)) out += `<ellipse cx="${x}" cy="${y}" rx="${r(rng, 26, 40)}" ry="${r(rng, 12, 18)}" fill="#3f7f8c" opacity=".8"/><circle cx="${x - 8}" cy="${y - 2}" r="4" fill="#f4a7c0"/><circle cx="${x + 10}" cy="${y + 3}" r="3.5" fill="#f7c3d4"/>`;
    for (const [x, y] of scatter(rng, 90, region, 32)) out += tree(x, y, r(rng, 11, 20), ['#1f4d24', '#2c6b2f', '#3d7d36', '#24582a'][Math.floor(next(rng) * 4)], '#3e2c18');
    return out;
  },
  maru(region, rng) {
    let out = '';
    for (let i = 0; i < 9; i++) {
      const y = 40 + i * 70 + r(rng, -10, 10);
      out += `<path d="M -20 ${y} Q ${r(rng, 150, 350)} ${y - r(rng, 25, 45)} ${r(rng, 450, 550)} ${y} T 1020 ${y + r(rng, -10, 10)}" stroke="#f9e6bd" stroke-width="3" fill="none" opacity=".7"/>`;
      out += `<path d="M -20 ${y + 4} Q ${r(rng, 150, 350)} ${y - 20} ${r(rng, 450, 550)} ${y + 4} T 1020 ${y + 8} L 1020 ${y + 30} L -20 ${y + 30} Z" fill="#d99a58" opacity=".22"/>`;
    }
    for (const [x, y] of scatter(rng, 14, region, 45)) out += tree(x, y, r(rng, 8, 12), '#8a9a4a', '#6b4a2b');
    for (const [x, y] of scatter(rng, 4, region, 60)) out += `<text x="${x}" y="${y}" font-size="22" text-anchor="middle" opacity=".85">🐪</text>`;
    return out;
  },
  coast(region, rng) {
    let out = '';
    // Hills along the top, sea along the bottom-right
    out += `<path d="M -20 60 Q 120 0 260 50 T 560 40 T 860 45 T 1020 30 L 1020 -20 L -20 -20 Z" fill="#5e9e5a" opacity=".8"/>`;
    out += `<path d="M 300 640 C 420 560, 560 600, 660 590 S 880 600, 960 600 L 1020 590 L 1020 640 Z" fill="#3d93b8"/>`;
    out += `<path d="M 1020 340 C 990 420, 980 470, 1000 560 L 1020 560 Z" fill="#3d93b8"/>`;
    for (let i = 0; i < 8; i++) {
      const x = 380 + i * 80;
      out += `<path d="M ${x} 615 q 10 -6 20 0 t 20 0" stroke="#bfe6f4" stroke-width="2" fill="none"/>`;
    }
    for (const [x, y] of scatter(rng, 30, region, 40, [(x, y) => y < 55])) out += palm(x, y + 10, r(rng, 12, 17));
    return out;
  },
  himalaya(region, rng) {
    let out = '';
    for (let i = 0; i < 9; i++) out += mountain(60 + i * 118 + r(rng, -20, 20), 230, r(rng, 200, 280), r(rng, 150, 230), '#9fb2c7', '#ffffff');
    out += `<rect x="0" y="200" width="1000" height="420" fill="url(#hima-fade)"/>`;
    for (const [x, y] of scatter(rng, 40, region, 34, [(x, y) => y < 300])) {
      out += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><polygon points="0,-24 -11,4 11,4" fill="#2f5d50"/><polygon points="0,-34 -8,-12 8,-12" fill="#3c6f5f"/><rect x="-2" y="4" width="4" height="7" fill="#5b4330"/></g>`;
    }
    const colors = ['#2f6fb6', '#ffffff', '#c8432b', '#2f8a4a', '#e2b42e'];
    for (const [x, y] of scatter(rng, 4, region, 50)) {
      out += `<path d="M ${x - 50} ${y} Q ${x} ${y + 18} ${x + 50} ${y}" stroke="#555" stroke-width="1" fill="none"/>`;
      for (let k = 0; k < 9; k++) {
        const t = (k + 0.5) / 9, fx = x - 50 + 100 * t, fy = y + 18 * 4 * t * (1 - t) * 0.5 + 1;
        out += `<rect x="${fx - 4}" y="${fy}" width="8" height="10" fill="${colors[k % 5]}"/>`;
      }
    }
    return out;
  },
  meru(region, rng) {
    let out = '';
    for (let i = 0; i < 140; i++) out += `<circle cx="${r(rng, 0, W).toFixed(0)}" cy="${r(rng, 0, H).toFixed(0)}" r="${r(rng, 0.6, 2).toFixed(1)}" fill="#fff" opacity="${r(rng, 0.3, 0.9).toFixed(2)}"/>`;
    out += `<polygon points="500,40 900,620 100,620" fill="url(#meru-gold)" opacity=".9"/>`;
    out += `<polygon points="500,40 560,200 520,180 500,240 470,190 440,210" fill="#fff8d6" opacity=".7"/>`;
    for (const [x, y] of scatter(rng, 10, region, 40)) out += `<ellipse cx="${x}" cy="${y}" rx="${r(rng, 30, 60)}" ry="${r(rng, 8, 14)}" fill="#fff" opacity=".18"/>`;
    return out;
  },
};

export function sceneryFor(region) {
  const rng = { rng: seedFrom(region.id) };
  return (SCENERY[region.id] ?? (() => ''))(region, rng);
}

export const SCENERY_DEFS = `
  <linearGradient id="hima-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe7ef" stop-opacity="0"/><stop offset=".25" stop-color="#dfe7ef" stop-opacity=".95"/><stop offset="1" stop-color="#cfdbe6"/></linearGradient>
  <linearGradient id="meru-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".5" stop-color="#e2b13c"/><stop offset="1" stop-color="#8a5a12"/></linearGradient>
`;
