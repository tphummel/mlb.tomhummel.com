---
title: "2015 AFL Fall Stars Game Relics"
date: 2016-09-01
teams: ["twins", "marlins", "phillies", "pirates", "giants", "guardians", "athletics", "mariners", "yankees", "rays", "rangers", "rockies", "braves", "blue-jays", "red-sox"]
players: ["adam-brett-walker", "austin-dean", "andrew-knapp", "austin-meadows", "christian-arroyo", "clint-frazier", "chad-pinder", "dj-peterson", "gary-sanchez", "jake-bauers", "jurickson-profar", "kyle-freeland", "lucas-sims", "renato-nunez", "rowdy-tellez", "raimel-tapia", "sean-manaea", "sam-travis"]
checklist:
  - number: "AFLR-ABW"
    date: 2016-09-01
    players: ["Adam Brett Walker"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-AD"
    date: 2016-09-01
    players: ["Austin Dean"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-AK"
    date: 2016-09-01
    players: ["Andrew Knapp"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-AM"
    date: 2016-09-01
    players: ["Austin Meadows"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-CA"
    date: 2016-09-01
    players: ["Christian Arroyo"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-CF"
    date: 2016-09-01
    players: ["Clint Frazier"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: false

  - number: "AFLR-CP"
    date: 2016-09-01
    players: ["Chad Pinder"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-DP"
    date: 2016-09-01
    players: ["D.J. Peterson"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-GS"
    date: 2016-09-01
    players: ["Gary Sanchez"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-JB"
    date: 2016-09-01
    players: ["Jake Bauers"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-JP"
    date: 2016-09-01
    players: ["Jurickson Profar"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-KF"
    date: 2016-09-01
    players: ["Kyle Freeland"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-LS"
    date: 2016-09-01
    players: ["Lucas Sims"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: false

  - number: "AFLR-RN"
    date: 2016-09-01
    players: ["Renato Nunez"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-RT"
    date: 2016-09-01
    players: ["Rowdy Tellez"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-RTA"
    date: 2016-09-01
    players: ["Raimel Tapia"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-SM"
    date: 2016-09-01
    players: ["Sean Manaea"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-ST"
    date: 2016-09-01
    players: ["Sam Travis"]
    title: null
    shortprint: null
    labels: []
    print_run: 99
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

The 2015 AFL Fall Stars Game Relics checklist in 2016 Bowman Chrome features 18 hobby-only relic cards numbered to 99, plus Orange Refractor (/25) and SuperFractor (1/1) parallels. I still need the Lucas Sims and Clint Frazier cards to finish the run.

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
