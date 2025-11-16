---
title: "2025 Topps NOW - Oakland Athletics"
date: 2025-01-01
teams: ["athletics"]
players: ["nick-kurtz", "shea-langeliers", "colby-thomas", "carlos-cortez", "lawrence-butler", "denzel-clarke", "tyler-soderstrom", "logan-davidson", "willie-maciver", "jacob-wilson", "gunnar-hoglund", "luis-urias", "max-muncy"]
checklist:
  - number: 787
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 3554
    have_base: false

  - number: 711
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 10738
    have_base: false

  - number: 687
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 4388
    have_base: false

  - number: 610
    date: null
    players: ["Shea Langeliers"]
    title: null
    shortprint: null
    labels: []
    print_run: 534
    have_base: false

  - number: 528
    date: null
    players: ["Colby Thomas"]
    title: null
    shortprint: null
    labels: []
    print_run: 528
    have_base: false

  - number: 520
    date: null
    players: ["Shea Langeliers"]
    title: null
    shortprint: null
    labels: []
    print_run: 683
    have_base: false

  - number: 464
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 53611
    have_base: false

  - number: 460
    date: null
    players: ["Carlos Cortez"]
    title: null
    shortprint: null
    labels: []
    print_run: 540
    have_base: false

  - number: 424
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 863
    have_base: false

  - number: 401
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 824
    have_base: false

  - number: 400
    date: null
    players: ["Lawrence Butler"]
    title: null
    shortprint: null
    labels: []
    print_run: 419
    have_base: false

  - number: 371
    date: null
    players: ["Colby Thomas"]
    title: null
    shortprint: null
    labels: []
    print_run: 826
    have_base: false

  - number: 322
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 2947
    have_base: false

  - number: 306
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 1341
    have_base: false

  - number: 302
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 725
    have_base: false

  - number: 283
    date: null
    players: ["Denzel Clarke"]
    title: null
    shortprint: null
    labels: []
    print_run: 4392
    have_base: false

  - number: 259
    date: null
    players: ["Tyler Soderstrom"]
    title: null
    shortprint: null
    labels: []
    print_run: 567
    have_base: false

  - number: 240
    date: null
    players: ["Denzel Clarke"]
    title: null
    shortprint: null
    labels: []
    print_run: 635
    have_base: false

  - number: 217
    date: null
    players: ["Logan Davidson", "Willie MacIver"]
    title: null
    shortprint: null
    labels: []
    print_run: 443
    have_base: false

  - number: 178
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 1608
    have_base: false

  - number: 177
    date: null
    players: ["Jacob Wilson"]
    title: null
    shortprint: null
    labels: []
    print_run: 1492
    have_base: false

  - number: 161
    date: null
    players: ["Shea Langeliers"]
    title: null
    shortprint: null
    labels: []
    print_run: 266
    have_base: false

  - number: 147
    date: null
    players: ["Jacob Wilson"]
    title: null
    shortprint: null
    labels: []
    print_run: 1206
    have_base: false

  - number: 129
    date: null
    players: ["Gunnar Hoglund"]
    title: null
    shortprint: null
    labels: []
    print_run: 583
    have_base: false

  - number: 125
    date: null
    players: ["Lawrence Butler"]
    title: null
    shortprint: null
    labels: []
    print_run: 423
    have_base: false

  - number: 113
    date: null
    players: ["Luis Urias"]
    title: null
    shortprint: null
    labels: []
    print_run: 353
    have_base: false

  - number: 104
    date: null
    players: ["Jacob Wilson"]
    title: null
    shortprint: null
    labels: []
    print_run: 1081
    have_base: false

  - number: 101
    date: null
    players: ["Nick Kurtz"]
    title: null
    shortprint: null
    labels: []
    print_run: 3852
    have_base: false

  - number: 72
    date: null
    players: ["Tyler Soderstrom"]
    title: null
    shortprint: null
    labels: []
    print_run: 632
    have_base: false

  - number: 61
    date: null
    players: ["Jacob Wilson"]
    title: null
    shortprint: null
    labels: []
    print_run: 1292
    have_base: false

  - number: 27
    date: null
    players: ["Jacob Wilson"]
    title: null
    shortprint: null
    labels: []
    print_run: 1266
    have_base: false

  - number: 15
    date: null
    players: ["Max Muncy"]
    title: null
    shortprint: null
    labels: []
    print_run: 1046
    have_base: false
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
      <td>{{ with .date }}{{ . }}{{ end }}</td>
      <td>{{ delimit .players ", " }}</td>
      <td>{{ with .print_run }}{{ . }}{{ end }}</td>
      <td>{{ with .title }}{{ . }}{{ end }}</td>
    </tr>
  {{- end }}
  </tbody>
</table>
{{< /checklist.inline >}}
