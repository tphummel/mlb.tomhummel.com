(function () {
  'use strict';

  var form = document.getElementById('card-form');
  var wrap = document.getElementById('card-wrap');
  var actions = document.getElementById('card-actions');
  var errorsEl = document.getElementById('errors');
  var detail = document.getElementById('detail');
  var status = document.getElementById('status');
  var current = null;
  var svg = '';

  // every named control in the form, so each tool just declares its inputs in the HTML
  var FIELDS = Array.prototype.map.call(form.elements, function (el) { return el.name; })
    .filter(function (n, i, all) { return n && all.indexOf(n) === i; });

  function values() {
    var v = {};
    FIELDS.forEach(function (f) { v[f] = form.elements[f].value; });
    return v;
  }

  function say(msg) {
    status.textContent = msg;
    if (msg) setTimeout(function () { if (status.textContent === msg) status.textContent = ''; }, 3000);
  }

  function filename(ext) {
    var base = (current.name + ' ' + current.year).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return (base ? base + '-' : '') + current.cardType + '-card.' + ext;
  }

  function save(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function pct(x) { return (x * 100).toFixed(1) + '%'; }

  function renderDetail(card) {
    var tbody = document.getElementById('detail-rows');
    tbody.textContent = '';
    card.chances.forEach(function (c) {
      var tr = document.createElement('tr');
      [c.label, pct(c.exact / SomCard.TOTAL_CHANCES), String(c.n), pct(c.n / SomCard.TOTAL_CHANCES)].forEach(function (t) {
        var td = document.createElement('td');
        td.textContent = t;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function showEstimates(card) {
    var el = document.getElementById('estimates');
    el.hidden = !card.estimateNote;
    el.textContent = card.estimateNote || '';
  }

  function saveToUrl(v) {
    var q = new URLSearchParams();
    FIELDS.forEach(function (f) { if (v[f]) q.set(f, v[f]); });
    try { history.replaceState(null, '', '?' + q.toString()); } catch (e) { /* ignore */ }
  }

  function generate() {
    var v = values();
    var result = SomCard.buildCard(v, v);
    errorsEl.textContent = '';
    if (result.errors) {
      result.errors.forEach(function (e) {
        var li = document.createElement('li');
        li.textContent = e;
        errorsEl.appendChild(li);
      });
      errorsEl.hidden = false;
      return;
    }
    errorsEl.hidden = true;
    current = result.card;
    svg = SomCard.toSvg(current);
    wrap.innerHTML = svg; // svg text is escaped in card.js
    actions.hidden = false;
    detail.hidden = false;
    document.getElementById('embed-code').value = svg;
    renderDetail(current);
    showEstimates(current);
    saveToUrl(v);
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); generate(); });

  form.addEventListener('reset', function () {
    setTimeout(function () {
      current = null;
      wrap.innerHTML = '<div id="card-empty">Your card will show up here.</div>';
      actions.hidden = true;
      detail.hidden = true;
      errorsEl.hidden = true;
      document.getElementById('estimates').hidden = true;
      try { history.replaceState(null, '', location.pathname); } catch (e) { /* ignore */ }
    }, 0);
  });

  document.getElementById('dl-svg').addEventListener('click', function () {
    save(new Blob([svg], { type: 'image/svg+xml' }), filename('svg'));
  });

  document.getElementById('dl-png').addEventListener('click', function () {
    var canvas = document.createElement('canvas');
    SomCard.toCanvas(current, canvas, 3);
    canvas.toBlob(function (blob) { save(blob, filename('png')); }, 'image/png');
  });

  document.getElementById('print').addEventListener('click', function () { window.print(); });

  function copy(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { say(done); }, function () { say('Copy failed'); });
    } else {
      say('Copy is not available in this browser');
    }
  }

  document.getElementById('copy-embed').addEventListener('click', function () { copy(svg, 'SVG copied'); });
  document.getElementById('copy-link').addEventListener('click', function () { copy(location.href, 'Link copied'); });

  // restore a shared card from the query string
  var q = new URLSearchParams(location.search);
  var any = false;
  FIELDS.forEach(function (f) {
    if (q.has(f)) { form.elements[f].value = q.get(f); any = true; }
  });
  if (any) generate();
}());
