/*
 * Strat-O-Matic style basic pitcher card generator: season pitching stats ->
 * card model. Packing, layout and drawing live in the shared engine.
 *
 * A pitcher card has the same 3 x 11 grid as a batter card, but the results
 * are what batters do against him: the shares are per batter faced.
 *
 * Works in the browser (window.SomCard, after the engine script) and in node
 * (module.exports).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('../strat-o-matic-shared/engine.js'));
  else root.SomCard = factory(root.SomEngine);
})(typeof self !== 'undefined' ? self : this, function (E) {
  'use strict';

  var toInt = E.toInt, isBlank = E.isBlank;

  // [key, required]. IP is handled separately because of the .1 / .2 notation.
  var STAT_FIELDS = [
    ['h', true], ['hr', true], ['bb', true], ['so', true],
    ['hbp', false], ['doubles', false], ['triples', false], ['bf', false],
    ['g', false], ['gs', false], ['sv', false]
  ];

  // Of the hits that are not homers, a typical league split. Card backs rarely
  // list doubles and triples allowed.
  var DOUBLE_SHARE = 0.215, TRIPLE_SHARE = 0.025;

  // "198", "198.1" (one out, 198 1/3) and "198.2" -> outs recorded, or NaN.
  function parseOuts(v) {
    var m = /^(\d+)(?:\.([012]))?$/.exec(String(v == null ? '' : v).trim());
    return m ? parseInt(m[1], 10) * 3 + (m[2] ? parseInt(m[2], 10) : 0) : NaN;
  }

  function ipText(outs) {
    return Math.floor(outs / 3) + '.' + (outs % 3);
  }

  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }

  // Validates raw form values. Returns {errors, stats, estimated}.
  function parseStats(raw) {
    var errors = [];
    var stats = {};
    var missing = {};
    var estimated = [];

    if (isBlank(raw.ip)) {
      errors.push('IP is required');
    } else {
      stats.outs = parseOuts(raw.ip);
      if (isNaN(stats.outs)) errors.push('IP should look like 198.1 (the digit after the point is outs: 0, 1 or 2)');
    }
    STAT_FIELDS.forEach(function (f) {
      var key = f[0];
      if (isBlank(raw[key])) {
        if (f[1]) errors.push(key.toUpperCase() + ' is required');
        missing[key] = true;
        stats[key] = 0;
        return;
      }
      var n = toInt(raw[key]);
      if (isNaN(n)) errors.push(key.toUpperCase() + ' must be a whole number, 0 or more');
      stats[key] = isNaN(n) ? 0 : n;
    });
    if (errors.length) return { errors: errors, stats: null, estimated: [] };

    if (stats.hr > stats.h) errors.push('HR cannot exceed H');
    if (stats.so > stats.outs) errors.push('SO cannot exceed the outs recorded (3 x IP)');
    if (errors.length) return { errors: errors, stats: null, estimated: [] };

    // batters faced: given, or outs plus everyone who reached
    var reached = stats.h + stats.bb + stats.hbp;
    if (missing.bf) {
      stats.bf = stats.outs + reached;
    } else if (stats.bf < reached + stats.so) {
      errors.push('BF is too low for the H, BB, HBP and SO entered');
    }
    if (stats.bf === 0) errors.push('Batters faced must be more than 0');

    // doubles and triples allowed
    var nonHr = stats.h - stats.hr;
    if (missing.doubles && missing.triples) {
      stats.triples = Math.round(nonHr * TRIPLE_SHARE);
      stats.doubles = Math.round(nonHr * DOUBLE_SHARE);
      estimated.push('doubles', 'triples');
    } else if (missing.triples) {
      stats.triples = clamp(Math.round(nonHr * TRIPLE_SHARE), 0, Math.max(0, nonHr - stats.doubles));
      estimated.push('triples');
    } else if (missing.doubles) {
      stats.doubles = clamp(Math.round(nonHr * DOUBLE_SHARE), 0, Math.max(0, nonHr - stats.triples));
      estimated.push('doubles');
    }
    if (stats.doubles + stats.triples > nonHr) errors.push('2B + 3B cannot exceed H minus HR');

    if (errors.length) return { errors: errors, stats: null, estimated: [] };
    return { errors: [], stats: stats, estimated: estimated, missing: missing };
  }

  // Starter / reliever / closer and how long he lasts, from G, GS, SV and IP.
  function roleFor(meta, s, missing) {
    var ip = s.outs / 3;
    var note = [];
    var role = ['starter', 'reliever', 'closer'].indexOf(meta.role) >= 0 ? meta.role : null;
    if (!role) {
      if (!missing.g) {
        var starts = s.gs;
        role = starts * 2 >= s.g && s.g > 0 ? 'starter'
          : (s.sv >= 15 || (s.sv > 0 && s.sv >= s.g * 0.25)) ? 'closer' : 'reliever';
      } else {
        role = ip >= 100 ? 'starter' : 'reliever';
        note.push('role guessed from IP (enter G and GS to work it out)');
      }
    }
    var endurance = toInt(meta.endurance);
    if (isNaN(endurance) || endurance < 1 || endurance > 9) {
      if (role === 'starter') {
        var per = !missing.gs && s.gs > 0 ? ip / s.gs : !missing.g && s.g > 0 ? ip / s.g : 6;
        endurance = clamp(Math.round(per), 4, 9);
      } else {
        var perRelief = !missing.g && s.g > 0 ? ip / s.g : 1;
        endurance = clamp(Math.round(perRelief), 1, role === 'closer' ? 2 : 3);
      }
    }
    return { role: role, endurance: endurance, note: note };
  }

  // Season stats -> list of outcomes with their share of batters faced.
  function outcomeShares(s, opts) {
    var bf = s.bf;
    var walks = s.bb + s.hbp;
    var singles = s.h - s.doubles - s.triples - s.hr;
    var inPlay = bf - s.h - walks - s.so; // outs on balls in play, plus any errors
    var counts = [
      ['hr', 'HOMERUN', s.hr], ['3b', 'TRIPLE', s.triples], ['2b', 'DOUBLE', s.doubles],
      ['1b', 'SINGLE', singles], ['bb', 'WALK', walks], ['so', 'STRIKEOUT', s.so]
    ];
    var out = counts.map(function (c) {
      return { id: c[0], label: c[1], kind: c[0], share: c[2] / bf };
    });
    var fly = [['lf', 0.32], ['cf', 0.36], ['rf', 0.32]];
    return out.concat(E.inPlayOutcomes(Math.max(0, inPlay) / bf, opts.tendency, fly));
  }

  /*
   * meta: {name, year, team, throws, tendency, role, endurance}
   * raw: form values for the stats: ip plus the fields in STAT_FIELDS
   * Returns {errors} or {card}.
   */
  function buildCard(meta, raw) {
    meta = meta || {};
    var parsed = parseStats(raw || {});
    if (parsed.errors.length) return { errors: parsed.errors };
    var s = parsed.stats;
    var throwsWith = meta.throws === 'L' ? 'L' : 'R';
    var tendency = E.isTendency(meta.tendency) ? meta.tendency : 'neutral';
    var job = roleFor(meta, s, parsed.missing);

    var seed = [meta.name, meta.year, throwsWith, tendency, s.outs].concat(
      STAT_FIELDS.map(function (f) { return s[f[0]]; })).join('|');
    var fitted = E.buildGrid(outcomeShares(s, { tendency: tendency }), seed);

    var notes = [];
    var split = parsed.estimated.map(function (k) { return { doubles: '2B', triples: '3B' }[k] + ' ' + s[k]; });
    if (split.length) notes.push('Doubles and triples allowed are a typical split of the non-HR hits: ' + split.join(', '));
    if (job.note.length) notes.push(job.note.join('; '));

    return {
      card: {
        cardType: 'pitcher',
        kicker: 'PITCHER CARD',
        name: (meta.name || '').trim() || 'Unnamed Pitcher',
        year: (meta.year || '').toString().trim(),
        team: (meta.team || '').trim(),
        headline: { starter: 'SP', reliever: 'RP', closer: 'CL' }[job.role],
        subline: 'THROWS ' + throwsWith,
        ratings: [['ROLE', job.role.toUpperCase()], ['ENDURANCE', String(job.endurance)]],
        stats: s,
        job: job,
        estimateNote: notes.join('. '),
        estimated: parsed.estimated,
        basis: ipText(s.outs) + ' IP, ' + s.bf + ' BF',
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
    parseOuts: parseOuts,
    parseStats: parseStats,
    buildCard: buildCard,
    toSvg: E.toSvg,
    toCanvas: E.toCanvas
  };
});
