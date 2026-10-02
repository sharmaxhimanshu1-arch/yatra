// Boards must stay readable: no trail segments crossing, no tiles piled on each other.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REGIONS } from '../src/data/index.js';

const orient = (p, q, r) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
const crosses = (a, b, c, d) => orient(a, b, c) !== orient(a, b, d) && orient(c, d, a) !== orient(c, d, b);

for (const r of REGIONS) {
  test(`${r.id} board has no crossing trails or crowded tiles`, () => {
    const nodes = Object.values(r.nodes);
    const edges = nodes.flatMap((n) => n.next.map((t) => [n, r.nodes[t]]));
    for (let i = 0; i < edges.length; i++) for (let j = i + 1; j < edges.length; j++) {
      const [a, b] = edges[i], [c, d] = edges[j];
      if ([a, b].includes(c) || [a, b].includes(d)) continue;
      assert.ok(!crosses(a, b, c, d), `${a.id}-${b.id} crosses ${c.id}-${d.id}`);
    }
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      assert.ok(dist >= 46, `${nodes[i].id} and ${nodes[j].id} are ${dist.toFixed(0)}px apart`);
    }
  });
}
