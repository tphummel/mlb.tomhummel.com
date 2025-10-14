---
title: "2016 Bowman Chrome 2015 AFL Fall Stars Autograph Relics"
date: 2016-09-01
teams: ["reds", "white-sox", "astros", "yankees", "cubs", "rangers", "pirates"]
players: ["alex-blandino", "adam-engel", "derek-fisher", "gary-sanchez", "jeimer-candelario", "jurickson-profar", "reese-mcguire"]
checklist:
  - number: "AFLR-AB"
    date: 2016-09-01
    players: ["Alex Blandino"]
    title: null
    shortprint: null
    labels: []
    print_run: 199
    have_base: false

  - number: "AFLR-AE"
    date: 2016-09-01
    players: ["Adam Engel"]
    title: null
    shortprint: null
    labels: []
    print_run: 199
    have_base: true

  - number: "AFLR-DF"
    date: 2016-09-01
    players: ["Derek Fisher"]
    title: null
    shortprint: null
    labels: []
    print_run: 199
    have_base: true

  - number: "AFLR-GS"
    date: 2016-09-01
    players: ["Gary Sanchez"]
    title: null
    shortprint: null
    labels: []
    print_run: 199
    have_base: false

  - number: "AFLR-JC"
    date: 2016-09-01
    players: ["Jeimer Candelario"]
    title: null
    shortprint: null
    labels: []
    print_run: 199
    have_base: false

  - number: "AFLR-JP"
    date: 2016-09-01
    players: ["Jurickson Profar"]
    title: null
    shortprint: null
    labels: []
    print_run: 199
    have_base: false

  - number: "AFLR-RM"
    date: 2016-09-01
    players: ["Reese McGuire"]
    title: null
    shortprint: null
    labels: []
    print_run: 199
    have_base: true
---

## Summary

{{< checklist_stat.inline >}}
{{- $checklist := default (slice) .Page.Params.checklist -}}
{{- $total := len $checklist -}}
{{- $owned := len (where $checklist "have_base" true) -}}
{{- $rookies := len (where $checklist "labels" "intersect" (slice "RC")) -}}
{{- $ownedPercent := cond (gt $total 0) (printf "%.1f" (mul (div (float $owned) (float $total)) 100.0)) "0.0" -}}
<ul>
  <li><strong>Total Cards:</strong> {{ $total }}</li>
  <li><strong>Cards Owned:</strong> {{ $owned }} / {{ $total }} ({{ $ownedPercent }}%)</li>
  <li><strong>Rookie Cards:</strong> {{ $rookies }}</li>
</ul>
{{< /checklist_stat.inline >}}

<!--more-->

The 2016 Bowman Chrome 2015 AFL Fall Stars Autograph Relics checklist delivers seven signed memorabilia cards numbered to 199, plus SuperFractor (1/1) parallels. I currently have the Adam Engel, Derek Fisher, and Reese McGuire cards.

## Checklist

{{< checklist.inline >}}
{{- $checklist := default (slice) .Page.Params.checklist -}}
<table>
  <thead>
    <tr>
      <th scope="col">Owned</th>
      <th scope="col">#</th>
      <th scope="col">Date</th>
      <th scope="col">Players</th>
      <th scope="col">Print Run</th>
      <th scope="col">Title</th>
    </tr>
  </thead>
  <tbody>
  {{- range $checklist }}
    <tr>
      <td>{{ cond .have_base "✓" "○" }}</td>
      <td>{{ .number }}</td>
      <td>{{ .date }}</td>
      <td>{{ delimit .players ", " }}</td>
      <td>{{ with .print_run }}{{ . }}{{ end }}</td>
      <td>{{ with .title }}{{ . }}{{ end }}</td>
    </tr>
  {{- end }}
  </tbody>
</table>
{{< /checklist.inline >}}
