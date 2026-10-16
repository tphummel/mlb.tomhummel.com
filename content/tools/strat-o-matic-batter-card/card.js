/*
 * Strat-O-Matic style basic batter card generator: season batting stats ->
 * card model. Packing, layout and drawing live in the shared engine.
 *
 * Works in the browser (window.SomCard, after the engine script) and in node
 * (module.exports).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('../strat-o-matic-shared/engine.js'));
  else root.SomCard = factory(root.SomEngine);
})(typeof self !== 'undefined' ? self : this, function (E) {
  'use strict';

  var toInt = E.toInt, isBlank = E.isBlank, toRate = E.toRate;

  var LETTERS = ['A', 'B', 'C', 'D'];

  // [key, required]. BB, 2B and 3B can instead be worked out from OBP and SLG.
  var STAT_FIELDS = [
    ['ab', true], ['h', true], ['hr', true], ['so', true],
    ['doubles', false], ['triples', false], ['bb', false],
    ['hbp', false], ['sf', false], ['sh', false], ['sb', false], ['cs', false]
  ];

  // Without both 2B and 3B, assume this many triples per double.
  var TRIPLES_PER_DOUBLE = 0.1;

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

  // Season stats -> list of outcomes with their share of plate appearances.
  function outcomeShares(s, opts) {
    var pa = plateAppearances(s);
    var bats = opts.bats || 'R';
    var singles = s.h - s.doubles - s.triples - s.hr;
    var walks = s.bb + s.hbp;
    var inPlay = pa - s.h - walks - s.so; // includes SF and SH
    var counts = [
      ['hr', 'HOMERUN', s.hr], ['3b', 'TRIPLE', s.triples], ['2b', 'DOUBLE', s.doubles],
      ['1b', 'SINGLE', singles], ['bb', 'WALK', walks], ['so', 'STRIKEOUT', s.so]
    ];
    var out = counts.map(function (c) {
      return { id: c[0], label: c[1], kind: c[0], share: c[2] / pa };
    });
    var fly = bats === 'L' ? [['lf', 0.26], ['cf', 0.36], ['rf', 0.38]]
      : bats === 'R' ? [['lf', 0.38], ['cf', 0.36], ['rf', 0.26]]
        : [['lf', 0.32], ['cf', 0.36], ['rf', 0.32]];
    return out.concat(E.inPlayOutcomes(inPlay / pa, opts.tendency, fly));
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
    var tendency = E.isTendency(meta.tendency) ? meta.tendency : 'neutral';

    var seed = [meta.name, meta.year, bats, tendency].concat(STAT_FIELDS.map(function (f) { return s[f[0]]; })).join('|');
    var fitted = E.buildGrid(outcomeShares(s, { bats: bats, tendency: tendency }), seed);

    var pos = (meta.pos || '').trim().toLowerCase();
    var fielding = (meta.fielding || '').toString().trim();
    return {
      card: {
        cardType: 'batter',
        kicker: 'BATTER CARD',
        name: (meta.name || '').trim() || 'Unnamed Batter',
        year: (meta.year || '').toString().trim(),
        team: (meta.team || '').trim(),
        headline: pos ? pos.toUpperCase() + (fielding ? '-' + fielding : '') : '',
        subline: 'BATS ' + bats,
        ratings: [
          ['STEALING', pickLetter(meta.stealing, autoStealing(s))],
          ['BUNTING', pickLetter(meta.bunting, autoBunting(s))],
          ['HIT & RUN', pickLetter(meta.hitAndRun, autoHitAndRun(s))]
        ],
        stats: s,
        estimateNote: parsed.estimated.length ? 'Worked out from OBP and SLG: ' + parsed.estimated.map(function (k) {
          return { bb: 'BB', doubles: '2B', triples: '3B' }[k] + ' ' + s[k];
        }).join(', ') : '',
        estimated: parsed.estimated,
        basis: plateAppearances(s) + ' PA',
        chances: fitted.chances,
        grid: fitted.grid,
        summary: E.summarize(fitted.chances)
      }
    };
  }

  return {
    ROW_WEIGHTS: E.ROW_WEIGHTS,
    TOTAL_CHANCES: E.TOTAL_CHANCES,
    STAT_FIELDS: STAT_FIELDS,
    parseStats: parseStats,
    buildCard: buildCard,
    toSvg: E.toSvg,
    toCanvas: E.toCanvas
  };
});
