// Run with: node --test content/tools/strat-o-matic-pitcher-card/card.test.js
const test = require('node:test');
const assert = require('node:assert');
const SomCard = require('./card.js');

const ace = { ip: '267.0', h: 226, hr: 19, bb: 83, so: 166, hbp: 6, g: 36, gs: 36 };

function build(raw, meta) {
  const r = SomCard.buildCard(meta || { name: 'Test', throws: 'R' }, raw);
  assert.strictEqual(r.errors, undefined, JSON.stringify(r.errors));
  return r.card;
}

test('chances total 108 and fill all 33 cells', () => {
  const card = build(ace);
  assert.strictEqual(card.chances.reduce((a, c) => a + c.n, 0), 108);
  const cells = card.grid.flat();
  assert.strictEqual(cells.length, 33);
  assert.ok(cells.every(Boolean));
});

test('each outcome occupies cells whose weights sum to its chances', () => {
  const card = build(ace);
  const sums = {};
  card.grid.forEach((col) => col.forEach((cell, row) => {
    sums[cell.id] = (sums[cell.id] || 0) + SomCard.ROW_WEIGHTS[row];
  }));
  card.chances.filter((c) => c.n > 0).forEach((c) => assert.strictEqual(sums[c.id], c.n, c.id));
});

test('card rates track the opponents batting line', () => {
  const card = build(ace);
  const bf = 267 * 3 + 226 + 83 + 6;
  assert.strictEqual(card.stats.bf, bf);
  assert.ok(Math.abs(card.summary.obp - (226 + 83 + 6) / bf) < 0.02);
  const so = card.chances.filter((c) => c.kind === 'so').reduce((a, c) => a + c.n, 0);
  assert.ok(Math.abs(so / 108 - 166 / bf) < 0.01);
});

test('innings pitched notation', () => {
  assert.strictEqual(SomCard.parseOuts('198'), 594);
  assert.strictEqual(SomCard.parseOuts('198.1'), 595);
  assert.strictEqual(SomCard.parseOuts('198.2'), 596);
  assert.strictEqual(SomCard.parseOuts('.2'), NaN);
  assert.ok(Number.isNaN(SomCard.parseOuts('198.3')));
  assert.ok(Number.isNaN(SomCard.parseOuts('198.5')));
});

test('doubles and triples allowed are estimated unless given', () => {
  const est = SomCard.parseStats(ace);
  assert.deepStrictEqual(est.estimated, ['doubles', 'triples']);
  assert.ok(est.stats.doubles + est.stats.triples <= 226 - 19);
  const given = SomCard.parseStats({ ...ace, doubles: 40, triples: 4 });
  assert.deepStrictEqual(given.estimated, []);
  assert.strictEqual(given.stats.doubles, 40);
  const one = SomCard.parseStats({ ...ace, doubles: 40 });
  assert.deepStrictEqual(one.estimated, ['triples']);
});

test('role and endurance', () => {
  assert.deepStrictEqual([build(ace).job.role, build(ace).job.endurance], ['starter', 7]);
  const closer = build({ ip: '65.1', h: 50, hr: 6, bb: 20, so: 80, g: 68, gs: 0, sv: 38 });
  assert.deepStrictEqual([closer.job.role, closer.job.endurance], ['closer', 1]);
  const setup = build({ ip: '90.0', h: 80, hr: 8, bb: 30, so: 70, g: 60, gs: 0, sv: 2 });
  assert.deepStrictEqual([setup.job.role, setup.job.endurance], ['reliever', 2]);
  const guessed = build({ ip: '180.0', h: 170, hr: 20, bb: 50, so: 140 });
  assert.strictEqual(guessed.job.role, 'starter');
  assert.ok(/role guessed/.test(guessed.estimateNote));
  assert.strictEqual(build(ace, { role: 'reliever', endurance: '3' }).job.endurance, 3);
  assert.strictEqual(build(ace, { role: 'closer' }).job.endurance, 2);
});

test('deterministic for the same input', () => {
  assert.deepStrictEqual(build(ace).grid, build(ace).grid);
});

test('packs random pitching lines', () => {
  let seed = 5;
  const rnd = (n) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
  for (let i = 0; i < 300; i++) {
    const outs = 30 + rnd(700);
    const h = rnd(Math.floor(outs * 0.9) + 1);
    const card = build({
      ip: `${Math.floor(outs / 3)}.${outs % 3}`, h, hr: rnd(Math.min(h, 40) + 1), bb: rnd(120), so: rnd(Math.min(outs, 280) + 1),
      hbp: rnd(15), g: 20 + rnd(60), gs: rnd(35)
    }, { name: 'p' + i, throws: ['L', 'R'][i % 2], tendency: ['ground', 'neutral', 'fly'][i % 3] });
    assert.strictEqual(card.grid.flat().length, 33);
  }
});

test('validation', () => {
  assert.ok(SomCard.buildCard({}, {}).errors.length >= 5);
  assert.ok(SomCard.buildCard({}, { ...ace, ip: '12.4' }).errors.some((e) => /IP should look like/.test(e)));
  assert.ok(SomCard.buildCard({}, { ...ace, hr: 300 }).errors.some((e) => /HR cannot exceed H/.test(e)));
  assert.ok(SomCard.buildCard({}, { ...ace, so: 900 }).errors.some((e) => /SO cannot exceed/.test(e)));
  assert.ok(SomCard.buildCard({}, { ...ace, bf: 100 }).errors.some((e) => /BF is too low/.test(e)));
  assert.ok(SomCard.buildCard({}, { ...ace, doubles: 300 }).errors.some((e) => /2B \+ 3B/.test(e)));
});

test('svg escapes user text', () => {
  const svg = SomCard.toSvg(build(ace, { name: '<script>"x"&', team: "O'Brien" }));
  assert.ok(!svg.includes('<script>'));
  assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'));
});
