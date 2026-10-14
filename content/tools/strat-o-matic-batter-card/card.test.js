// Run with: node --test content/tools/strat-o-matic-batter-card/card.test.js
const test = require('node:test');
const assert = require('node:assert');
const SomCard = require('./card.js');

const rickey = { ab: 536, h: 179, doubles: 22, triples: 4, hr: 28, bb: 117, so: 93, hbp: 2, sf: 3, sb: 100, cs: 26 };

function build(raw, meta) {
  const r = SomCard.buildCard(meta || { name: 'Test', bats: 'R' }, raw);
  assert.deepStrictEqual(r.errors, undefined, JSON.stringify(r.errors));
  return r.card;
}

test('chances total 108 and fill all 33 cells', () => {
  const card = build(rickey);
  assert.strictEqual(card.chances.reduce((a, c) => a + c.n, 0), 108);
  const cells = card.grid.flat();
  assert.strictEqual(cells.length, 33);
  assert.ok(cells.every(Boolean));
});

test('each outcome occupies cells whose weights sum to its chances', () => {
  const card = build(rickey);
  const sums = {};
  card.grid.forEach((col) => col.forEach((cell, row) => {
    sums[cell.id] = (sums[cell.id] || 0) + SomCard.ROW_WEIGHTS[row];
  }));
  card.chances.filter((c) => c.n > 0).forEach((c) => assert.strictEqual(sums[c.id], c.n, c.id));
});

test('card rates track the season line', () => {
  const card = build(rickey);
  const pa = 536 + 117 + 2 + 3;
  const obp = (179 + 117 + 2) / pa;
  assert.ok(Math.abs(card.summary.obp - obp) < 0.02, `${card.summary.obp} vs ${obp}`);
  assert.ok(Math.abs(card.summary.avg - 179 / 536) < 0.025);
});

test('deterministic for the same input', () => {
  assert.deepStrictEqual(build(rickey).grid, build(rickey).grid);
});

test('packs random stat lines', () => {
  let seed = 7;
  const rnd = (n) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
  for (let i = 0; i < 300; i++) {
    const ab = 50 + rnd(600);
    const so = rnd(Math.floor(ab * 0.4));
    const h = rnd(Math.min(ab - so, Math.floor(ab * 0.4)) + 1);
    const hr = rnd(Math.min(h, 60) + 1);
    const t3 = rnd(Math.min(h - hr, 15) + 1);
    const d2 = rnd(Math.min(h - hr - t3, 50) + 1);
    const card = build({ ab, h, doubles: d2, triples: t3, hr, bb: rnd(150), so, hbp: rnd(15), sf: rnd(10), sh: rnd(10), sb: rnd(80), cs: rnd(20) },
      { name: 'r' + i, bats: ['L', 'R', 'S'][i % 3], tendency: ['ground', 'neutral', 'fly'][i % 3] });
    assert.strictEqual(card.grid.flat().length, 33);
  }
});

test('validation', () => {
  const r = SomCard.buildCard({}, { ab: 10, h: 12, doubles: 0, triples: 0, hr: 0, bb: 0, so: 0 });
  assert.ok(r.errors.some((e) => /H cannot exceed AB/.test(e)));
  assert.ok(SomCard.buildCard({}, {}).errors.length >= 7);
  assert.ok(SomCard.buildCard({}, { ab: '1.5', h: 0, doubles: 0, triples: 0, hr: 0, bb: 0, so: 0 }).errors.length);
});

test('svg escapes user text', () => {
  const card = build(rickey, { name: '<script>"x"&', team: "O'Brien" });
  const svg = SomCard.toSvg(card);
  assert.ok(!svg.includes('<script>'));
  assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'));
});
