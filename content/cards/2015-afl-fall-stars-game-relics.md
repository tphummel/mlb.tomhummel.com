---
title: "2016 Bowman Chrome 2015 AFL Fall Stars Game Relics"
date: 2016-09-01
teams: ["twins", "marlins", "phillies", "pirates", "giants", "guardians", "athletics", "mariners", "yankees", "rays", "rangers", "rockies", "braves", "blue-jays", "red-sox"]
players: ["adam-brett-walker", "austin-dean", "andrew-knapp", "austin-meadows", "christian-arroyo", "clint-frazier", "chad-pinder", "dj-peterson", "gary-sanchez", "jake-bauers", "jurickson-profar", "kyle-freeland", "lucas-sims", "renato-nunez", "rowdy-tellez", "raimel-tapia", "sean-manaea", "sam-travis"]
checklist:
  - number: "AFLR-ABW"
    players: ["Adam Brett Walker"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-AD"
    players: ["Austin Dean"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-AK"
    players: ["Andrew Knapp"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-AM"
    players: ["Austin Meadows"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-CA"
    players: ["Christian Arroyo"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-CF"
    players: ["Clint Frazier"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: false

  - number: "AFLR-CP"
    players: ["Chad Pinder"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-DP"
    players: ["D.J. Peterson"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-GS"
    players: ["Gary Sanchez"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-JB"
    players: ["Jake Bauers"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-JP"
    players: ["Jurickson Profar"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-KF"
    players: ["Kyle Freeland"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-LS"
    players: ["Lucas Sims"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: false

  - number: "AFLR-RN"
    players: ["Renato Nunez"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-RT"
    players: ["Rowdy Tellez"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-RTA"
    players: ["Raimel Tapia"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-SM"
    players: ["Sean Manaea"]
    shortprint: null
    labels: []
    print_run: 99
    have_base: true

  - number: "AFLR-ST"
    players: ["Sam Travis"]
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

The 2016 Bowman Chrome 2015 AFL Fall Stars Game Relics checklist features 18 hobby-only relic cards numbered to 99, plus Orange Refractor (/25) and SuperFractor (1/1) parallels. I still need the Lucas Sims and Clint Frazier cards to finish the run.

## Checklist

{{< checklist.inline >}}
{{- $checklist := default (slice) .Page.Params.checklist -}}
<table>
  <thead>
    <tr>
      <th scope="col">Owned</th>
      <th scope="col">#</th>
      <th scope="col">Players</th>
      <th scope="col">Print Run</th>
    </tr>
  </thead>
  <tbody>
  {{- range $checklist }}
    <tr>
      <td>{{ cond .have_base "✓" "○" }}</td>
      <td>{{ .number }}</td>
      <td>{{ delimit .players ", " }}</td>
      <td>{{ with .print_run }}{{ . }}{{ end }}</td>
    </tr>
  {{- end }}
  </tbody>
</table>
{{< /checklist.inline >}}
