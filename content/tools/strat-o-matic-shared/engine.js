/*
 * Shared engine for the Strat-O-Matic style basic card generators.
 *
 * A basic card is 3 columns x 11 rows (dice sums 2..12). The rows are not
 * equally likely: 2 and 12 come up 1/36 of the time, 7 comes up 6/36. Per
 * column that is 36 "chances", so a whole card is 108 chances. A card is built
 * by turning season stats into outcomes with a share of all plate appearances
 * (or batters faced), rounding each outcome to a whole number of chances out
 * of 108, then packing those outcomes into cells whose weights add up exactly
 * to the outcome's chances.
 *
 * This is an approximation in the style of the basic game, not the
 * proprietary Strat-O-Matic card formula.
 *
 * Works in the browser (window.SomEngine) and in node (module.exports).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SomEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var ROW_WEIGHTS = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]; // dice sums 2..12
  var COLUMNS = 3;
  var TOTAL_CHANCES = 108;

  // Share of balls in play that become ground / fly / line-pop outs.
  var TENDENCIES = {
    ground: [0.58, 0.28, 0.14],
    neutral: [0.46, 0.4, 0.14],
    fly: [0.34, 0.52, 0.14]
  };

  var GROUND_FIELDERS = [['1b', 0.18], ['2b', 0.28], ['ss', 0.32], ['3b', 0.22]];
  var LINE_POP_VARIANTS = [['LO (ss)', 0.3], ['LO (2b)', 0.25], ['PO (3b)', 0.25], ['PO (1b)', 0.2]];

  // Outs on balls in play, as outcomes with a share of all plate appearances.
  // inPlayShare is the share of PAs that were outs in play; fly is the
  // [[fielder, weight], ...] split for fly balls.
  function inPlayOutcomes(inPlayShare, tendencyKey, fly) {
    var tendency = TENDENCIES[tendencyKey] || TENDENCIES.neutral;
    var out = [];
    GROUND_FIELDERS.forEach(function (f) {
      out.push({ id: 'gb-' + f[0], label: 'GB (' + f[0] + ')', kind: 'gb', share: inPlayShare * tendency[0] * f[1] });
    });
    fly.forEach(function (f) {
      out.push({ id: 'fly-' + f[0], label: 'FLY (' + f[0] + ')', kind: 'fly', share: inPlayShare * tendency[1] * f[1] });
    });
    LINE_POP_VARIANTS.forEach(function (v) {
      out.push({ id: 'lp-' + v[0], label: v[0], kind: 'lp', share: inPlayShare * tendency[2] * v[1] });
    });
    return out;
  }

  function isTendency(key) { return !!TENDENCIES[key]; }

  function toInt(v) {
    if (typeof v === 'number') return Number.isInteger(v) ? v : NaN;
    var s = String(v == null ? '' : v).trim();
    return /^\d+$/.test(s) ? parseInt(s, 10) : NaN;
  }

  function isBlank(v) {
    return v == null || String(v).trim() === '';
  }

  // Accepts .412 or 0.412. Returns null when blank, NaN when invalid.
  function toRate(v, max) {
    if (isBlank(v)) return null;
    var s = String(v).trim();
    if (!/^(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    var n = parseFloat(s);
    return n > max ? NaN : n;
  }

  // Fills in BB from OBP and 2B/3B from SLG when those counts are blank.
  // OBP = (H + W) / (AB + W + SF) where W = BB + HBP, so W is solvable.
  // SLG gives total bases, and TB = H + 2B + 2*3B + 3*HR, which fixes 2B + 2*3B

  // Largest remainder rounding so the chances always total 108.
  function toChances(outcomes) {
    var items = outcomes.map(function (o, i) {
      var exact = o.share * TOTAL_CHANCES;
      return { o: o, i: i, n: Math.floor(exact), frac: exact - Math.floor(exact) };
    });
    var left = TOTAL_CHANCES - items.reduce(function (a, b) { return a + b.n; }, 0);
    items.slice().sort(function (a, b) { return b.frac - a.frac || a.i - b.i; })
      .slice(0, left).forEach(function (it) { it.n += 1; });
    return items.map(function (it) {
      return { id: it.o.id, label: it.o.label, kind: it.o.kind, n: it.n, exact: it.o.share * TOTAL_CHANCES };
    });
  }

  // ---- packing outcomes into cells ----

  function weightCounts() {
    var c = [0, 0, 0, 0, 0, 0, 0];
    for (var col = 0; col < COLUMNS; col++) ROW_WEIGHTS.forEach(function (w) { c[w] += 1; });
    return c; // index = weight
  }

  // All ways to build `n` chances from the cells still free, fewest cells first.
  function candidates(n, avail) {
    var found = [];
    var pick = [0, 0, 0, 0, 0, 0, 0];
    (function rec(w, remaining) {
      if (w === 0) {
        if (remaining === 0) found.push(pick.slice());
        return;
      }
      var max = Math.min(avail[w], Math.floor(remaining / w));
      for (var k = max; k >= 0; k--) {
        pick[w] = k;
        rec(w - 1, remaining - k * w);
      }
      pick[w] = 0;
    })(6, n);
    found.sort(function (a, b) {
      var ca = a.reduce(function (x, y) { return x + y; }, 0);
      var cb = b.reduce(function (x, y) { return x + y; }, 0);
      return ca - cb;
    });
    return found;
  }

  function pack(items) {
    var order = items.filter(function (it) { return it.n > 0; })
      .sort(function (a, b) { return b.n - a.n; });
    var picks = new Array(order.length);
    var failed = {};
    function solve(idx, avail) {
      if (idx === order.length) return true;
      var key = idx + ':' + avail.join(',');
      if (failed[key]) return false;
      var cands = candidates(order[idx].n, avail);
      for (var c = 0; c < cands.length; c++) {
        var next = avail.slice();
        for (var w = 1; w <= 6; w++) next[w] -= cands[c][w];
        picks[idx] = cands[c];
        if (solve(idx + 1, next)) return true;
      }
      failed[key] = true;
      return false;
    }
    if (!solve(0, weightCounts())) throw new Error('Could not fit outcomes onto a card');
    return order.map(function (it, i) { return { item: it, pick: picks[i] }; });
  }

  // Many tiny outcomes (say, a dozen with 1 chance each) cannot all fit: there
  // are only six cells worth 1 and six worth 2. When that happens, fold the
  // two smallest fielder variants of the same kind together and try again.
  function packWithMerging(chances) {
    var list = chances.filter(function (c) { return c.n > 0; });
    for (;;) {
      try {
        return { chances: list, packed: pack(list) };
      } catch (e) {
        var best = null;
        list.forEach(function (a, i) {
          list.forEach(function (b, j) {
            if (j <= i || a.kind !== b.kind || ['gb', 'fly', 'lp'].indexOf(a.kind) < 0) return;
            if (!best || a.n + b.n < best.total) best = { i: i, j: j, total: a.n + b.n };
          });
        });
        if (!best) throw e;
        var a = list[best.i], b = list[best.j];
        var keep = a.n >= b.n ? a : b;
        var merged = { id: keep.id, label: keep.label, kind: keep.kind, n: a.n + b.n, exact: a.exact + b.exact };
        list = list.filter(function (_, k) { return k !== best.i && k !== best.j; }).concat([merged]);
      }
    }
  }

  function hashString(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    var a = seed;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Lay the packed outcomes onto the grid. Cell order is shuffled with a seed
  // derived from the input so the same stats always give the same card.
  function layout(packed, seedText) {
    var rand = mulberry32(hashString(seedText));
    var cells = [[], [], [], [], [], [], []]; // by weight
    for (var col = 0; col < COLUMNS; col++) {
      ROW_WEIGHTS.forEach(function (w, row) { cells[w].push({ col: col, row: row }); });
    }
    cells.forEach(function (list) {
      for (var i = list.length - 1; i > 0; i--) {
        var j = Math.floor(rand() * (i + 1));
        var t = list[i]; list[i] = list[j]; list[j] = t;
      }
    });
    var grid = [];
    for (var c = 0; c < COLUMNS; c++) grid.push(new Array(ROW_WEIGHTS.length));
    packed.forEach(function (p) {
      for (var w = 1; w <= 6; w++) {
        for (var k = 0; k < p.pick[w]; k++) {
          var cell = cells[w].pop();
          grid[cell.col][cell.row] = { id: p.item.id, label: p.item.label, kind: p.item.kind };
        }
      }
    });
    return grid;
  }

  // Outcomes (with shares) -> {chances, grid}. seedText makes the cell shuffle repeatable.
  function buildGrid(outcomes, seedText) {
    var fitted = packWithMerging(toChances(outcomes));
    return { chances: fitted.chances, grid: layout(fitted.packed, seedText) };
  }

  function summarize(chances) {
    var n = function (kinds) {
      return chances.reduce(function (a, c) { return a + (kinds.indexOf(c.kind) >= 0 ? c.n : 0); }, 0);
    };
    var hits = n(['1b', '2b', '3b', 'hr']);
    var walks = n(['bb']);
    var bases = n(['1b']) + 2 * n(['2b']) + 3 * n(['3b']) + 4 * n(['hr']);
    var ab = TOTAL_CHANCES - walks;
    return { avg: hits / ab, obp: (hits + walks) / TOTAL_CHANCES, slg: bases / ab };
  }

  // ---- drawing ----
  // The card is described once, as rect/line/text calls, and drawn by either
  // an SVG string builder or a canvas. The site's CSP blocks data: and blob:
  // images, so we cannot rasterize the SVG; we draw the PNG directly instead.

  var W = 500, H = 700;
  var FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  var INK = '#1d1a14', PAPER = '#fbf6e6', RULE = '#b9ae8f', BAND = '#f0e8cd', HEAD = '#1d1a14';
  // card: {name, year, team, headline, subline, ratings: [[label, value]], kicker,
  // basis, cardType, grid, summary}
  var HIT_KINDS = { '1b': 1, '2b': 1, '3b': 1, hr: 1 };

  function sub(s) { return (s || '').replace(/\s+/g, ' '); }

  function drawCard(card, g) {
    g.rect(0, 0, W, H, { fill: PAPER, rx: 22 });
    g.rect(8, 8, W - 16, H - 16, { stroke: INK, sw: 3, rx: 16 });

    // header
    g.text(28, 56, card.name.toUpperCase(), { size: card.name.length > 20 ? 26 : 32, weight: 'bold', fill: INK });
    var line2 = [card.year, card.team].filter(Boolean).join('  ');
    if (line2) g.text(28, 84, sub(line2), { size: 20, fill: INK });
    if (card.headline) g.text(W - 28, 56, card.headline, { size: 30, weight: 'bold', anchor: 'end', fill: INK });
    if (card.subline) g.text(W - 28, 84, card.subline, { size: 18, anchor: 'end', fill: INK });

    // ratings
    g.rect(28, 100, W - 56, 36, { fill: BAND, stroke: RULE, sw: 1 });
    card.ratings.forEach(function (r, i) {
      var cx = 28 + (W - 56) * (i + 0.5) / card.ratings.length;
      g.text(cx, 124, r[0] + ' ' + r[1], { size: 15, weight: 'bold', anchor: 'middle', fill: INK });
    });

    // table
    var left = 28, labelW = 36, colW = (W - 56 - labelW) / COLUMNS;
    var top = 152, headH = 32, rowH = 40;
    g.rect(left, top, W - 56, headH, { fill: HEAD });
    for (var c = 0; c < COLUMNS; c++) {
      g.text(left + labelW + colW * (c + 0.5), top + 23, String(c + 1), { size: 22, weight: 'bold', anchor: 'middle', fill: PAPER });
    }
    for (var r = 0; r < ROW_WEIGHTS.length; r++) {
      var y = top + headH + r * rowH;
      if (r % 2 === 1) g.rect(left, y, W - 56, rowH, { fill: BAND });
      g.text(left + labelW / 2, y + 26, String(r + 2), { size: 16, weight: 'bold', anchor: 'middle', fill: INK });
      for (var col = 0; col < COLUMNS; col++) {
        var cell = card.grid[col][r];
        g.text(left + labelW + colW * (col + 0.5), y + 26, cell.label, {
          size: 17, weight: HIT_KINDS[cell.kind] || cell.kind === 'bb' ? 'bold' : 'normal', anchor: 'middle', fill: INK
        });
      }
    }
    var bottom = top + headH + ROW_WEIGHTS.length * rowH;
    g.rect(left, top, W - 56, bottom - top, { stroke: INK, sw: 2 });
    g.line(left + labelW, top + headH, left + labelW, bottom, { stroke: INK, sw: 1.5 });
    for (var k = 1; k < COLUMNS; k++) {
      g.line(left + labelW + colW * k, top, left + labelW + colW * k, bottom, { stroke: INK, sw: 1.5 });
    }

    // footer
    var sm = card.summary;
    var f = function (x) { return x.toFixed(3).replace(/^0/, ''); };
    g.text(W / 2, bottom + 28, card.kicker + '   ' + f(sm.avg) + ' / ' + f(sm.obp) + ' / ' + f(sm.slg), {
      size: 15, weight: 'bold', anchor: 'middle', fill: INK
    });
    g.text(W / 2, bottom + 48, 'Based on ' + (card.year ? card.year + ' ' : '') + 'season stats: ' + card.basis, {
      size: 12, anchor: 'middle', fill: '#5b5340'
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function toSvg(card) {
    var parts = [];
    var n = function (v) { return Math.round(v * 100) / 100; };
    var paint = function (o) {
      return ' fill="' + (o.fill || 'none') + '"' + (o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + o.sw + '"' : '');
    };
    drawCard(card, {
      rect: function (x, y, w, h, o) {
        parts.push('<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '"' +
          (o.rx ? ' rx="' + o.rx + '"' : '') + paint(o) + '/>');
      },
      line: function (x1, y1, x2, y2, o) {
        parts.push('<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) +
          '" stroke="' + o.stroke + '" stroke-width="' + o.sw + '"/>');
      },
      text: function (x, y, str, o) {
        parts.push('<text x="' + n(x) + '" y="' + n(y) + '" font-size="' + o.size + '"' +
          (o.weight === 'bold' ? ' font-weight="bold"' : '') +
          (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
          ' fill="' + o.fill + '">' + esc(str) + '</text>');
      }
    });
    var title = card.name + (card.year ? ' ' + card.year : '') + ' ' + card.cardType + ' card';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H +
      '" width="' + W / 2 + '" height="' + H / 2 + '" font-family="' + FONT + '" role="img" aria-label="' + esc(title) + '">' +
      '<title>' + esc(title) + '</title>' + parts.join('') + '</svg>';
  }

  function toCanvas(card, canvas, scale) {
    scale = scale || 2;
    canvas.width = W * scale;
    canvas.height = H * scale;
    var ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, W, H);
    var roundRect = function (x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };
    drawCard(card, {
      rect: function (x, y, w, h, o) {
        if (o.rx) roundRect(x, y, w, h, o.rx); else { ctx.beginPath(); ctx.rect(x, y, w, h); }
        if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
        if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.sw; ctx.stroke(); }
      },
      line: function (x1, y1, x2, y2, o) {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = o.stroke; ctx.lineWidth = o.sw; ctx.stroke();
      },
      text: function (x, y, str, o) {
        ctx.font = (o.weight === 'bold' ? 'bold ' : '') + o.size + 'px ' + FONT;
        ctx.textAlign = o.anchor === 'middle' ? 'center' : o.anchor === 'end' ? 'right' : 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = o.fill;
        ctx.fillText(str, x, y);
      }
    });
  }

  return {
    ROW_WEIGHTS: ROW_WEIGHTS,
    TOTAL_CHANCES: TOTAL_CHANCES,
    isBlank: isBlank,
    toInt: toInt,
    toRate: toRate,
    isTendency: isTendency,
    inPlayOutcomes: inPlayOutcomes,
    buildGrid: buildGrid,
    summarize: summarize,
    toSvg: toSvg,
    toCanvas: toCanvas
  };
});
