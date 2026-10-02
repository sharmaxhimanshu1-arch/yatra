// Turns a compact region "track" into a node graph with board coordinates.
//
// track entries:
//   'type'                 a tile with an auto id
//   'type#id'              a tile with a fixed id (for villages, landmarks, quests…)
//   'type#id:Label'        …with a visible label
//   [[...lane], [...lane]] a fork: lanes run side by side and rejoin at the next entry
// waypoints: points the trail follows across a 1000×620 board (smoothed with Catmull-Rom).

const LANE_GAP = 40;

function parseEntry(str, auto) {
  const m = /^([a-z]+)(?:#([\w-]+))?(?::(.+))?$/.exec(str);
  if (!m) throw new Error(`Bad track entry "${str}"`);
  return { type: m[1], id: m[2] ?? auto(), label: m[3] ?? null };
}

function catmullRom(points, samplesPerSeg = 24) {
  const out = [];
  const p = [points[0], ...points, points[points.length - 1]];
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    for (let k = 0; k < samplesPerSeg; k++) {
      const t = k / samplesPerSeg, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

function makeCurve(waypoints) {
  const pts = catmullRom(waypoints);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const length = cum[cum.length - 1];
  function at(frac) {
    const d = Math.max(0, Math.min(1, frac)) * length;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < d) i++;
    const seg = cum[i] - cum[i - 1] || 1;
    const t = (d - cum[i - 1]) / seg;
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
    return { x: ax + dx * t, y: ay + dy * t, nx: -dy / len, ny: dx / len };
  }
  return { at, pts, length };
}

export function layoutRegion(region) {
  let n = 0;
  const auto = () => `t${++n}`;
  // First pass: count slots along the main trail.
  const slots = region.track.reduce((sum, e) => sum + (Array.isArray(e) ? Math.max(...e.map((l) => l.length)) : 1), 0);
  const curve = makeCurve(region.waypoints);
  const at = (slot) => curve.at(slot / (slots - 1));

  const nodes = {};
  const add = (entry, pos, offset = 0) => {
    if (nodes[entry.id]) throw new Error(`Duplicate node id "${entry.id}" in ${region.id}`);
    const p = at(pos);
    nodes[entry.id] = {
      id: entry.id, type: entry.type, label: entry.label,
      x: Math.round(p.x + p.nx * offset), y: Math.round(p.y + p.ny * offset),
      next: [], ...(region.nodes?.[entry.id] ?? {}),
    };
    return entry.id;
  };

  let slot = 0;
  let tails = []; // node ids that should link to the next placed node
  let start = null;
  for (const e of region.track) {
    if (Array.isArray(e)) {
      const span = Math.max(...e.map((l) => l.length));
      const offsets = e.length === 2 ? [-LANE_GAP, LANE_GAP] : e.map((_, i) => (i - (e.length - 1) / 2) * LANE_GAP * 1.2);
      const newTails = [];
      e.forEach((lane, li) => {
        let prev = null;
        lane.forEach((str, k) => {
          const pos = slot - 1 + ((k + 1) * (span + 1)) / (lane.length + 1);
          const id = add(parseEntry(str, auto), pos, offsets[li]);
          if (prev) nodes[prev].next.push(id);
          else tails.forEach((t) => nodes[t].next.push(id));
          prev = id;
        });
        newTails.push(prev);
      });
      tails = newTails;
      slot += span;
    } else {
      const id = add(parseEntry(e, auto), slot);
      tails.forEach((t) => nodes[t].next.push(id));
      tails = [id];
      start ??= id;
      slot += 1;
    }
  }
  const gate = Object.values(nodes).find((nd) => nd.type === 'gate');
  return { ...region, nodes, start, gate: gate?.id ?? null, curve: curve.pts.map(([x, y]) => [Math.round(x), Math.round(y)]) };
}
