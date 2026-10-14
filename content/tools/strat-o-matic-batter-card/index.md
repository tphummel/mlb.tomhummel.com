---
title: "Strat-O-Matic Batter Card Generator"
date: 2026-10-14
description: "Enter a season stat line from the back of a baseball card and get a basic-game Strat-O-Matic style batter card to download, print or embed."
tags: ["strat-o-matic", "tools"]
---
Enter a hitter's season line from the back of a baseball card and get a basic-game, Strat-O-Matic style batter card: three columns, one row for each dice total from 2 to 12.

{{< strat-card.inline >}}
<style>
  .card-tool { display: grid; gap: 2em; grid-template-columns: minmax(0, 1fr); align-items: start; }
  @media (min-width: 900px) { .card-tool { grid-template-columns: minmax(0, 1fr) 280px; } }
  .card-tool fieldset { border: 1px dashed rgba(180, 255, 216, 0.4); margin: 0 0 1.5em; padding: 0.5em 1em 1em; }
  .card-tool legend { color: #b4ffd8; padding: 0 0.5em; }
  .card-tool .fields { display: grid; gap: 0.75em 1em; grid-template-columns: repeat(auto-fill, minmax(8.5em, 1fr)); }
  .card-tool label { display: flex; flex-direction: column; font-size: 0.85em; line-height: 1.3; gap: 0.2em; }
  .card-tool input, .card-tool select, .card-tool button {
    font: inherit; font-size: 1em; padding: 0.35em 0.5em; color: #f4fff8;
    background: rgba(244, 255, 248, 0.08); border: 1px solid rgba(180, 255, 216, 0.4); border-radius: 4px;
  }
  .card-tool button { cursor: pointer; color: #071c11; background: #6bf7b2; border-color: #6bf7b2; }
  .card-tool button.secondary { color: #f4fff8; background: transparent; border-color: rgba(180, 255, 216, 0.4); }
  .card-tool .actions { display: flex; flex-wrap: wrap; gap: 0.5em; margin: 1em 0; }
  .card-tool .errors { color: #ffb4b4; margin: 0 0 1em; padding-left: 1.2em; }
  .card-tool .hint { font-size: 0.8em; opacity: 0.7; line-height: 1.4; margin: 0.5em 0 0; }
  #card-wrap svg { display: block; width: 100%; max-width: 280px; height: auto; border-radius: 12px; }
  #card-empty { opacity: 0.6; }
  #embed-code { width: 100%; min-height: 6em; font-size: 0.75em; line-height: 1.3; }
  #status { min-height: 1.5em; font-size: 0.85em; }
  .card-detail table { font-size: 0.8em; }
  .card-detail th, .card-detail td { padding: 0.3em 0.6em; }
  @media print {
    @page { margin: 0.5in; }
    html { background: #fff !important; padding: 0 !important; }
    body * { visibility: hidden; }
    #card-wrap, #card-wrap * { visibility: visible; }
    #card-wrap { position: absolute; left: 0; top: 0; }
    #card-wrap svg { width: 2.5in; max-width: none; height: 3.5in; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>

<div class="card-tool">
  <form id="card-form" autocomplete="off" novalidate>
    <fieldset>
      <legend>Player</legend>
      <div class="fields">
        <label>Name <input name="name" type="text" maxlength="40" placeholder="Rickey Henderson"></label>
        <label>Year <input name="year" type="text" maxlength="9" placeholder="1990"></label>
        <label>Team <input name="team" type="text" maxlength="24" placeholder="Athletics"></label>
        <label>Bats
          <select name="bats"><option value="R">Right</option><option value="L">Left</option><option value="S">Switch</option></select>
        </label>
        <label>Position
          <select name="pos">
            <option value="">-</option>
            <option>c</option><option>1b</option><option>2b</option><option>3b</option><option>ss</option>
            <option>lf</option><option>cf</option><option>rf</option><option>dh</option>
          </select>
        </label>
        <label>Fielding (1-5) <input name="fielding" type="text" inputmode="numeric" maxlength="1" placeholder="2"></label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Season stats</legend>
      <div class="fields">
        <label>AB <input name="ab" type="text" inputmode="numeric" required></label>
        <label>H <input name="h" type="text" inputmode="numeric" required></label>
        <label>2B <input name="doubles" type="text" inputmode="numeric"></label>
        <label>3B <input name="triples" type="text" inputmode="numeric"></label>
        <label>HR <input name="hr" type="text" inputmode="numeric" required></label>
        <label>BB <input name="bb" type="text" inputmode="numeric"></label>
        <label>SO <input name="so" type="text" inputmode="numeric" required></label>
        <label>OBP <input name="obp" type="text" inputmode="decimal" maxlength="5" placeholder=".412"></label>
        <label>SLG <input name="slg" type="text" inputmode="decimal" maxlength="5" placeholder=".550"></label>
      </div>
      <p class="hint">AB, H, HR and SO are required. Doubles and triples are included in H. Skip BB to work it out from OBP, and skip 2B and 3B to work them out from SLG. The split between doubles and triples is an estimate.</p>
    </fieldset>

    <fieldset>
      <legend>Optional</legend>
      <div class="fields">
        <label>HBP <input name="hbp" type="text" inputmode="numeric"></label>
        <label>SF <input name="sf" type="text" inputmode="numeric"></label>
        <label>SH <input name="sh" type="text" inputmode="numeric"></label>
        <label>SB <input name="sb" type="text" inputmode="numeric"></label>
        <label>CS <input name="cs" type="text" inputmode="numeric"></label>
        <label>Batted balls
          <select name="tendency"><option value="neutral">Neutral</option><option value="ground">Ground ball hitter</option><option value="fly">Fly ball hitter</option></select>
        </label>
        <label>Stealing
          <select name="stealing"><option value="">Auto</option><option>A</option><option>B</option><option>C</option><option>D</option></select>
        </label>
        <label>Bunting
          <select name="bunting"><option value="">Auto</option><option>A</option><option>B</option><option>C</option><option>D</option></select>
        </label>
        <label>Hit &amp; run
          <select name="hitAndRun"><option value="">Auto</option><option>A</option><option>B</option><option>C</option><option>D</option></select>
        </label>
      </div>
      <p class="hint">Walks and hit by pitch are combined into one WALK result. Stealing, bunting and hit &amp; run are estimated from your stats unless you pick a letter.</p>
    </fieldset>

    <div class="actions">
      <button type="submit">Make card</button>
      <button type="reset" class="secondary" id="reset">Clear</button>
    </div>
    <ul class="errors" id="errors" role="alert" hidden></ul>
  </form>

  <div>
    <div id="card-wrap" aria-live="polite"><div id="card-empty">Your card will show up here.</div></div>
    <div class="actions" id="card-actions" hidden>
      <button type="button" id="dl-png">PNG</button>
      <button type="button" id="dl-svg" class="secondary">SVG</button>
      <button type="button" id="print" class="secondary">Print</button>
    </div>
    <div id="status" role="status"></div>
    <p class="hint" id="estimates" hidden></p>
  </div>
</div>

<div class="card-detail" id="detail" hidden>
  <h3>Embed</h3>
  <p>Paste this SVG into any page or post. It has no scripts or external files.</p>
  <textarea id="embed-code" readonly></textarea>
  <div class="actions">
    <button type="button" id="copy-embed" class="secondary">Copy SVG</button>
    <button type="button" id="copy-link" class="secondary">Copy link to this card</button>
  </div>

  <h3>How the card was made</h3>
  <p>Each result gets a whole number of chances out of 108, in proportion to how often it happened per plate appearance. The row you roll decides how many chances a cell is worth (a 7 is six times a 2).</p>
  <table>
    <thead><tr><th>Result</th><th>Season PA%</th><th>Chances</th><th>Card PA%</th></tr></thead>
    <tbody id="detail-rows"></tbody>
  </table>
</div>

<p class="hint">This follows the layout of the basic Strat-O-Matic game but is an approximation, not the company's own card formula.</p>
<script src="{{ (.Page.Resources.Get "card.js").RelPermalink }}"></script>
<script src="{{ (.Page.Resources.Get "app.js").RelPermalink }}"></script>
{{< /strat-card.inline >}}
