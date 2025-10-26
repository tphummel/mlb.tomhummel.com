---
title: "Oakland Athletics vs. San Francisco Giants"
date: 2024-10-13
tags: []
players: []
teams: ["athletics", "giants"]
data: 
  description: a's from 1968 to 2024. giants from 1958 to 2024. the bay area era for each
  athletics: 
    reg_season_h2h: 76-72
    postseason_h2h: 4-0
    games: 9002
    wins: 4614
    losses: 4387
    win_pct: 0.513
    runs_per_game: 4.5
    runs_allowed_per_game: 4.4
    postseason_appearances: 21
    world_series_appearances: 6
    world_series_championships: 4
  giants: 
    reg_season_h2h: 72-76
    postseason_h2h: 0-4
    games: 10601
    wins: 5474
    losses: 5121
    win_pct: .516
    runs_per_game: 4.4
    runs_allowed_per_game: 4.2
    postseason_appearances: 13
    world_series_appearances: 6
    world_series_championships: 3


---
The Oakland Athletics (1968-2024) vs. the San Francisco Giants (1958-2024)
<!--more-->

{{< table.inline >}}
{{- $data := .Page.Params.data -}}
{{- $ath := $data.athletics -}}
{{- $sf := $data.giants -}}
<div class="sr_share_wrap" style="overflow:auto">
  <table class="sr_share" style="border-collapse: collapse; font-size:.83em; border: 1px solid #aaa; min-width: 22rem;">
    <caption>Oakland Athletics vs. San Francisco Giants (Bay Area era)</caption>
    <colgroup>
      <col>
      <col>
      <col>
    </colgroup>
    <thead>
      <tr>
        <th scope="col" style="background-color: #ddd; border: 1px solid #aaa; padding: 4px; text-align: left;">Category</th>
        <th scope="col" style="background-color: #ddd; border: 1px solid #aaa; padding: 4px; text-align: right;">Athletics</th>
        <th scope="col" style="background-color: #ddd; border: 1px solid #aaa; padding: 4px; text-align: right;">Giants</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">Regular season head-to-head</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.reg_season_h2h }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.reg_season_h2h }}</td>
      </tr>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">Postseason head-to-head</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.postseason_h2h }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.postseason_h2h }}</td>
      </tr>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">Games</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.games }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.games }}</td>
      </tr>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">Wins</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.wins }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.wins }}</td>
      </tr>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">Losses</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.losses }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.losses }}</td>
      </tr>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">Win %</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.win_pct }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.win_pct }}</td>
      </tr>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">Runs per game</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.runs_per_game }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.runs_per_game }}</td>
      </tr>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">Runs allowed per game</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.runs_allowed_per_game }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.runs_allowed_per_game }}</td>
      </tr>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">Postseason appearances</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.postseason_appearances }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.postseason_appearances }}</td>
      </tr>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">World Series appearances</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.world_series_appearances }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.world_series_appearances }}</td>
      </tr>
      <tr>
        <th scope="row" style="border: 1px solid #aaa; padding: 4px; text-align: left;">World Series championships</th>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $ath.world_series_championships }}</td>
        <td style="border: 1px solid #aaa; padding: 4px; text-align: right;">{{ $sf.world_series_championships }}</td>
      </tr>
    </tbody>
  </table>
</div>
{{< /table.inline >}}

[source](https://stathead.com/tiny/3p1nC)
