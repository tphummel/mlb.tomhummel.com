---
title: "Strat-O-Matic Pitcher Card Generator"
date: 2026-10-15
description: "Enter a pitcher's season line from the back of a baseball card and get a basic-game Strat-O-Matic style pitcher card to download, print or embed."
tags: ["strat-o-matic", "tools"]
---
Enter a pitcher's season line from the back of a baseball card and get a basic-game, Strat-O-Matic style pitcher card: three columns, one row for each dice total from 2 to 12. The results are what batters did against him. For hitters, use the [batter card generator](../strat-o-matic-batter-card/).
<!--more-->

{{< som-card-tool unit="batter faced" >}}
    <fieldset>
      <legend>Player</legend>
      <div class="fields">
        <label>Name <input name="name" type="text" maxlength="40" placeholder="Dave Stewart"></label>
        <label>Year <input name="year" type="text" maxlength="9" placeholder="1990"></label>
        <label>Team <input name="team" type="text" maxlength="24" placeholder="Athletics"></label>
        <label>Throws
          <select name="throws"><option value="R">Right</option><option value="L">Left</option></select>
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Season stats</legend>
      <div class="fields">
        <label>IP <input name="ip" type="text" inputmode="decimal" maxlength="7" placeholder="267.0" required></label>
        <label>H <input name="h" type="text" inputmode="numeric" required></label>
        <label>HR <input name="hr" type="text" inputmode="numeric" required></label>
        <label>BB <input name="bb" type="text" inputmode="numeric" required></label>
        <label>SO <input name="so" type="text" inputmode="numeric" required></label>
      </div>
      <p class="hint">As printed on the card back. IP uses baseball notation: 198.1 is 198 and a third, 198.2 is 198 and two thirds.</p>
    </fieldset>

    <fieldset>
      <legend>Optional</legend>
      <div class="fields">
        <label>G <input name="g" type="text" inputmode="numeric"></label>
        <label>GS <input name="gs" type="text" inputmode="numeric"></label>
        <label>SV <input name="sv" type="text" inputmode="numeric"></label>
        <label>HBP <input name="hbp" type="text" inputmode="numeric"></label>
        <label>BF <input name="bf" type="text" inputmode="numeric"></label>
        <label>2B allowed <input name="doubles" type="text" inputmode="numeric"></label>
        <label>3B allowed <input name="triples" type="text" inputmode="numeric"></label>
        <label>Batted balls
          <select name="tendency"><option value="neutral">Neutral</option><option value="ground">Ground ball pitcher</option><option value="fly">Fly ball pitcher</option></select>
        </label>
        <label>Role
          <select name="role"><option value="">Auto</option><option value="starter">Starter</option><option value="reliever">Reliever</option><option value="closer">Closer</option></select>
        </label>
        <label>Endurance (1-9) <input name="endurance" type="text" inputmode="numeric" maxlength="1" placeholder="Auto"></label>
      </div>
      <p class="hint">Batters faced are worked out from outs, hits and walks unless you enter BF. Card backs rarely list doubles and triples allowed, so they are estimated from the other hits. G, GS and SV set the role and how long he goes: starters pitch 4 to 9 innings, relievers 1 to 3. Walks and hit by pitch are combined into one WALK result.</p>
    </fieldset>
{{< /som-card-tool >}}
