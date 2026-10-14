/*
 * Strat-O-Matic style basic batter card generator.
 *
 * A basic batter card is 3 columns x 11 rows (dice sums 2..12). The rows are
 * not equally likely: 2 and 12 come up 1/36 of the time, 7 comes up 6/36.
 * Per column that is 36 "chances", so a whole card is 108 chances. The card
 * is built by turning season stats into plate appearance outcomes, rounding
 * each outcome to a whole number of chances out of 108, then packing those
 * outcomes into cells whose weights add up exactly to the outcome's chances.
 *
 * This is an approximation in the style of the basic game, not the
 * proprietary Strat-O-Matic card formula.
 *
 * Works in the browser (window.SomCard) and in node (module.exports).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SomCard = factory();
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

  var LETTERS = ['A', 'B', 'C', 'D'];

  // [key, required]. BB, 2B and 3B can instead be worked out from OBP and SLG.
  var STAT_FIELDS = [
    ['ab', true], ['h', true], ['hr', true], ['so', true],
    ['doubles', false], ['triples', false], ['bb', false],
    ['hbp', false], ['sf', false], ['sh', false], ['sb', false], ['cs', false]
  ];

  // Without both 2B and 3B, assume this many triples per double.
  var TRIPLES_PER_DOUBLE = 0.1;

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
  // but not the split between them.
  function fillFromRates(stats, missing, obp, slg, errors) {
    var estimated = [];
    if (missing.bb) {
      if (obp == null) {
        errors.push('Enter BB, or OBP to work it out');
      } else if (obp >= 1) {
        errors.push('OBP must be less than 1');
      } else {
        var w = Math.round((obp * (stats.ab + stats.sf) - stats.h) / (1 - obp));
        if (w - stats.hbp < 0) errors.push('OBP is too low for these H and AB');
        else { stats.bb = w - stats.hbp; estimated.push('bb'); }
      }
    }
    if (missing.doubles || missing.triples) {
      if (slg == null) {
        errors.push('Enter 2B and 3B, or SLG to work them out');
      } else {
        var extra = Math.round(slg * stats.ab) - stats.h - 3 * stats.hr; // 2B + 2*3B
        if (extra < 0) {
          errors.push('SLG is too low for these H, AB and HR');
        } else if (missing.doubles && missing.triples) {
          // D + T = extra - T can't exceed the hits that aren't homers, so there is a
          // floor on triples when almost every hit is an extra-base hit.
          var avail = stats.h - stats.hr;
          var t = Math.round(extra * TRIPLES_PER_DOUBLE / (1 + 2 * TRIPLES_PER_DOUBLE));
          t = Math.min(Math.floor(extra / 2), Math.max(t, extra - avail));
          stats.triples = t;
          stats.doubles = extra - 2 * t;
          // SLG is rounded, so a hit or two of slop is fine
          var over = stats.doubles + stats.triples - avail;
          if (over > 2) errors.push('SLG is too high for these H and HR');
          else if (over > 0) stats.doubles -= over;
          estimated.push('doubles', 'triples');
        } else if (missing.triples) {
          stats.triples = Math.round((extra - stats.doubles) / 2);
          if (stats.triples < 0) errors.push('SLG is too low for the 2B entered');
          else estimated.push('triples');
        } else {
          stats.doubles = extra - 2 * stats.triples;
          if (stats.doubles < 0) errors.push('SLG is too low for the 3B entered');
          else estimated.push('doubles');
        }
      }
    }
    return estimated;
  }

  // Validates raw form values. Returns {errors, stats, estimated}.
  function parseStats(raw) {
    var errors = [];
    var stats = {};
    var missing = {};
    STAT_FIELDS.forEach(function (f) {
      var key = f[0], required = f[1];
      if (isBlank(raw[key])) {
        if (required) errors.push(key.toUpperCase() + ' is required');
        missing[key] = true;
        stats[key] = 0;
        return;
      }
      var n = toInt(raw[key]);
      if (isNaN(n)) errors.push(key.toUpperCase() + ' must be a whole number, 0 or more');
      stats[key] = isNaN(n) ? 0 : n;
    });
    var obp = toRate(raw.obp, 1), slg = toRate(raw.slg, 4);
    if (isNaN(obp)) errors.push('OBP should look like .412');
    if (isNaN(slg)) errors.push('SLG should look like .550');
    if (errors.length) return { errors: errors, stats: null, estimated: [] };

    if (stats.h > stats.ab) errors.push('H cannot exceed AB');
    if (stats.hr > stats.h) errors.push('HR cannot exceed H');
    if (stats.h + stats.so > stats.ab) errors.push('H + SO cannot exceed AB');
    if (errors.length) return { errors: errors, stats: null, estimated: [] };

    var estimated = fillFromRates(stats, missing, obp, slg, errors);
    if (errors.length) return { errors: errors, stats: null, estimated: [] };

    if (stats.doubles + stats.triples + stats.hr > stats.h) errors.push('2B + 3B + HR cannot exceed H');
    if (stats.ab + stats.bb + stats.hbp + stats.sf + stats.sh === 0) errors.push('Plate appearances must be more than 0');
    if (errors.length) return { errors: errors, stats: null, estimated: [] };
    return { errors: [], stats: stats, estimated: estimated };
  }

  function plateAppearances(s) {
    return s.ab + s.bb + s.hbp + s.sf + s.sh;
  }

  function split(total, parts) {
    return parts.map(function (p) { return total * p[1]; });
  }

  // Season stats -> list of outcomes with their share of plate appearances.
  function outcomeShares(s, opts) {
    var pa = plateAppearances(s);
    var bats = opts.bats || 'R';
    var tendency = TENDENCIES[opts.tendency] || TENDENCIES.neutral;
    var singles = s.h - s.doubles - s.triples - s.hr;
    var walks = s.bb + s.hbp;
    var inPlay = pa - s.h - walks - s.so; // includes SF and SH
    var out = [];
    function add(id, label, kind, count) {
      out.push({ id: id, label: label, kind: kind, share: count / pa });
    }
    add('hr', 'HOMERUN', 'hr', s.hr);
    add('3b', 'TRIPLE', '3b', s.triples);
    add('2b', 'DOUBLE', '2b', s.doubles);
    add('1b', 'SINGLE', '1b', singles);
    add('bb', 'WALK', 'bb', walks);
    add('so', 'STRIKEOUT', 'so', s.so);

    GROUND_FIELDERS.forEach(function (f) {
      add('gb-' + f[0], 'GB (' + f[0] + ')', 'gb', inPlay * tendency[0] * f[1]);
    });
    var fly = bats === 'L' ? [['lf', 0.26], ['cf', 0.36], ['rf', 0.38]]
      : bats === 'R' ? [['lf', 0.38], ['cf', 0.36], ['rf', 0.26]]
        : [['lf', 0.32], ['cf', 0.36], ['rf', 0.32]];
    fly.forEach(function (f) {
      add('fly-' + f[0], 'FLY (' + f[0] + ')', 'fly', inPlay * tendency[1] * f[1]);
    });
    LINE_POP_VARIANTS.forEach(function (v) {
      add('lp-' + v[0], v[0], 'lp', inPlay * tendency[2] * v[1]);
    });
    return out;
  }

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

  // ---- ratings ----

  function shift(letter, by) {
    return LETTERS[Math.min(LETTERS.length - 1, Math.max(0, LETTERS.indexOf(letter) + by))];
  }

  function autoStealing(s) {
    var pa = plateAppearances(s);
    var per600 = s.sb / pa * 600;
    var letter = per600 >= 35 ? 'A' : per600 >= 15 ? 'B' : per600 >= 5 ? 'C' : 'D';
    if (s.sb + s.cs >= 10 && s.sb / (s.sb + s.cs) < 0.6) letter = shift(letter, 1);
    return letter;
  }

  function autoHitAndRun(s) {
    var r = s.so / plateAppearances(s);
    return r < 0.1 ? 'A' : r < 0.15 ? 'B' : r < 0.2 ? 'C' : 'D';
  }

  function autoBunting(s) {
    if (!s.sh) return 'C';
    var per600 = s.sh / plateAppearances(s) * 600;
    return per600 >= 15 ? 'A' : per600 >= 8 ? 'B' : 'C';
  }

  function pickLetter(value, auto) {
    return LETTERS.indexOf(value) >= 0 ? value : auto;
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

  /*
   * meta: {name, year, team, bats, pos, fielding, tendency, stealing, bunting, hitAndRun}
   * raw: form values for the stats (see STAT_FIELDS), plus optional obp and slg
   * Returns {errors} or {card}.
   */
  function buildCard(meta, raw) {
    meta = meta || {};
    var parsed = parseStats(raw || {});
    if (parsed.errors.length) return { errors: parsed.errors };
    var s = parsed.stats;
    var bats = ['L', 'R', 'S'].indexOf(meta.bats) >= 0 ? meta.bats : 'R';
    var tendency = TENDENCIES[meta.tendency] ? meta.tendency : 'neutral';

    var fitted = packWithMerging(toChances(outcomeShares(s, { bats: bats, tendency: tendency })));
    var chances = fitted.chances, packed = fitted.packed;
    var seed = [meta.name, meta.year, bats, tendency].concat(STAT_FIELDS.map(function (f) { return s[f[0]]; })).join('|');
    var grid = layout(packed, seed);

    return {
      card: {
        name: (meta.name || '').trim() || 'Unnamed Batter',
        year: (meta.year || '').toString().trim(),
        team: (meta.team || '').trim(),
        bats: bats,
        pos: (meta.pos || '').trim().toLowerCase(),
        fielding: (meta.fielding || '').toString().trim(),
        stealing: pickLetter(meta.stealing, autoStealing(s)),
        bunting: pickLetter(meta.bunting, autoBunting(s)),
        hitAndRun: pickLetter(meta.hitAndRun, autoHitAndRun(s)),
        stats: s,
        estimated: parsed.estimated,
        pa: plateAppearances(s),
        chances: chances,
        grid: grid,
        summary: summarize(chances)
      }
    };
  }

  // ---- drawing ----
  // The card is described once, as rect/line/text calls, and drawn by either
  // an SVG string builder or a canvas. The site's CSP blocks data: and blob:
  // images, so we cannot rasterize the SVG; we draw the PNG directly instead.

  var W = 500, H = 700;
  var FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  var INK = '#1d1a14', PAPER = '#fbf6e6', RULE = '#b9ae8f', BAND = '#f0e8cd', HEAD = '#1d1a14';
  var HIT_KINDS = { '1b': 1, '2b': 1, '3b': 1, hr: 1 };

  function sub(s) { return (s || '').replace(/\s+/g, ' '); }

  function drawCard(card, g) {
    g.rect(0, 0, W, H, { fill: PAPER, rx: 22 });
    g.rect(8, 8, W - 16, H - 16, { stroke: INK, sw: 3, rx: 16 });

    // header
    g.text(28, 56, card.name.toUpperCase(), { size: card.name.length > 20 ? 26 : 32, weight: 'bold', fill: INK });
    var line2 = [card.year, card.team].filter(Boolean).join('  ');
    if (line2) g.text(28, 84, sub(line2), { size: 20, fill: INK });
    var posText = card.pos ? card.pos.toUpperCase() + (card.fielding ? '-' + card.fielding : '') : '';
    if (posText) g.text(W - 28, 56, posText, { size: 30, weight: 'bold', anchor: 'end', fill: INK });
    g.text(W - 28, 84, 'BATS ' + card.bats, { size: 18, anchor: 'end', fill: INK });

    // ratings
    g.rect(28, 100, W - 56, 36, { fill: BAND, stroke: RULE, sw: 1 });
    [['STEALING', card.stealing], ['BUNTING', card.bunting], ['HIT & RUN', card.hitAndRun]].forEach(function (r, i) {
      var cx = 28 + (W - 56) * (i + 0.5) / 3;
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
    g.text(W / 2, bottom + 28, 'BATTER CARD   ' + f(sm.avg) + ' / ' + f(sm.obp) + ' / ' + f(sm.slg), {
      size: 15, weight: 'bold', anchor: 'middle', fill: INK
    });
    g.text(W / 2, bottom + 48, 'Based on ' + (card.year ? card.year + ' ' : '') + 'season stats: ' + card.pa + ' PA', {
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
    var title = card.name + (card.year ? ' ' + card.year : '') + ' batter card';
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
    STAT_FIELDS: STAT_FIELDS,
    parseStats: parseStats,
    buildCard: buildCard,
    toSvg: toSvg,
    toCanvas: toCanvas
  };
});
