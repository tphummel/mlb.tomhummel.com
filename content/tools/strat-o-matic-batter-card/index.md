---
title: "Strat-O-Matic Batter Card Generator"
date: 2026-10-14
description: "Enter a season stat line from the back of a baseball card and get a basic-game Strat-O-Matic style batter card to download, print or embed."
tags: ["strat-o-matic", "tools"]
---
Enter a hitter's season line from the back of a baseball card and get a basic-game, Strat-O-Matic style batter card: three columns, one row for each dice total from 2 to 12. For pitchers, use the [pitcher card generator](../strat-o-matic-pitcher-card/).
<!--more-->

{{< som-card-tool unit="plate appearance" >}}
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
{{< /som-card-tool >}}
