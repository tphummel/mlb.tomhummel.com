---
title: "The A's New Front Office: Taylor Smith and Cam Castro"
date: 2026-11-18
tags: []
players: ["taylor-smith", "cam-castro"]
teams: ["athletics"]
profiles:
  - name: Taylor Smith
    initials: TS
    role: President of Baseball Operations
    hired: "2026-10-19"
    replaces: David Forst (fired early August 2026)
    previous: Red Sox senior vice president / assistant general manager
    bio:
      - [Age at hire, "31"]
      - [Birthdate, "Not found in sources"]
      - [Hometown, "Woodstock, Ga. (per MLB.com)"]
      - [College, "University of Georgia (2018)"]
      - [Degrees, "Joint B.S./M.S. in statistics; B.S. in mathematics"]
      - [Playing career, "None found in sources"]
    stats:
      - [Front-office stops, "2 (Rays, Red Sox)"]
      - [Rays seasons, "7 (research and development)"]
      - [Red Sox seasons, "2 (2024-2026)"]
      - [Led at Boston, "Analytics, sciences, systems and technology"]
    career:
      - ["2018", "Graduates from Georgia", "University of Georgia"]
      - ["2018-2024", "Research and development; analyst, later director of predictive modeling", "Tampa Bay Rays (7 seasons)"]
      - ["2024-2026", "Senior vice president / assistant general manager; oversaw baseball research and development", "Boston Red Sox"]
      - ["2026", "President of baseball operations", "Athletics"]
  - name: Cam Castro
    initials: CC
    role: General Manager
    hired: "2026-11-04"
    replaces: Dan Feinstein (interim GM since Aug. 7)
    previous: Brewers SVP of player development and performance
    bio:
      - [Age at hire, "36"]
      - [Birthdate, "Not found in sources"]
      - [Hometown, "Not found in sources"]
      - [College, "Lake Erie College (2012); Defiance College (graduate)"]
      - [Degrees, "B.S. in legal studies; master's in sport management"]
      - [Playing career, "None found in sources"]
    stats:
      - [Front-office stops, "1 (Brewers)"]
      - [Brewers seasons, "8 (2019-2026)"]
      - [College coaching seasons, "7 (Defiance, Augustana, Lake Erie)"]
      - [Lake Erie, "Head coach from Aug. 2016; 3rd season in 2018"]
      - [Background, "Pitching development"]
    career:
      - ["2012", "Graduates from Lake Erie College", "Bachelor's in legal studies"]
      - ["2012-2016", "Coaching staff; worked mainly with pitchers, recruiting and fundraising", "Defiance College"]
      - ["Dec. 2015-Jun. 2016", "Trainer (about 7 months)", "Driveline Baseball, Seattle"]
      - ["Before Aug. 2016", "Coach (years not given)", "Augustana University (S.D.)"]
      - ["Aug. 2016-2018+", "Head coach; teams broke school strikeout and K/9 records in each of his first two seasons", "Lake Erie College"]
      - ["2019", "Single-A pitching coach", "Milwaukee Brewers"]
      - ["2019-2022", "Minor league pitching coordinator, then director of pitching development", "Milwaukee Brewers"]
      - ["Jul. 2022", "Vice president of player development", "Milwaukee Brewers"]
      - ["Oct. 2024", "Senior vice president of player development and performance", "Milwaukee Brewers"]
      - ["Nov. 2026", "General manager", "Athletics"]
---
The Athletics rebuilt the top of their baseball operations department this fall. Taylor Smith was named president of baseball operations on October 19, 2026. Cam Castro was named general manager on November 4. The club went 64-98 in 2026, its fifth straight losing season and 12 wins worse than 2025.

<!--more-->

{{< profiles.inline >}}
<style>
.pf{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin:1.5rem 0}
@media(max-width:700px){.pf{grid-template-columns:1fr}}
.pf>div{border:1px solid rgba(128,128,128,.4);border-radius:6px;padding:1rem;min-width:0}
.pf .hd{display:flex;gap:.75rem;align-items:center;margin-bottom:.75rem}
.pf .shot{width:64px;height:64px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1.25rem;background:rgba(128,128,128,.25)}
.pf .shot img{width:64px;height:64px;border-radius:50%;object-fit:cover}
.pf h3{margin:0}
.pf table{width:100%;font-size:.9rem;margin:.25rem 0 1rem}
.pf th{text-align:left;width:40%;font-weight:normal;opacity:.7}
.pf .nf{opacity:.55;font-style:italic}
</style>
{{ $p := .Page.Params.profiles }}
<div class="pf">
{{ range $p }}
<div>
  <div class="hd">
    {{ $img := printf "%s.jpg" (urlize .name) }}
    {{ with $.Page.Resources.GetMatch $img }}<div class="shot"><img src="{{ .RelPermalink }}" alt="{{ $.Page.Title }}"></div>{{ else }}<div class="shot">{{ .initials }}</div>{{ end }}
    <div><h3>{{ .name }}</h3>{{ .role }}<br>Hired {{ .hired }}</div>
  </div>
  <table>
    <tr><th>Replaces</th><td>{{ .replaces }}</td></tr>
    <tr><th>Previously</th><td>{{ .previous }}</td></tr>
    {{ range .bio }}<tr><th>{{ index . 0 }}</th><td{{ if hasPrefix (index . 1) "Not found" }} class="nf"{{ end }}>{{ index . 1 }}</td></tr>{{ end }}
  </table>
  <strong>By the numbers</strong>
  <table>{{ range .stats }}<tr><th>{{ index . 0 }}</th><td>{{ index . 1 }}</td></tr>{{ end }}</table>
  <strong>Career</strong>
  <table>{{ range .career }}<tr><th>{{ index . 0 }}</th><td>{{ index . 1 }}<br><small>{{ index . 2 }}</small></td></tr>{{ end }}</table>
</div>
{{ end }}
</div>
{{< /profiles.inline >}}

## Notes

- Birthdates and Castro's hometown were not in the sources reviewed. Only ages at hire (Smith 31, Castro 36) are reported.
- Lake Erie's coach page also notes the Storm received the 2018 Technology in Baseball Award from Diamond Kinetics under Castro.
- The Yahoo Sports date for Castro's Driveline stint (Dec. 2015 to Jun. 2016) differs slightly in framing from Lake Erie's page, which says only that Driveline came before his Augustana and Lake Erie roles.
- Headshots are cropped from the A's welcome graphics published with the MLB.com announcements.
- Smith: [MLB.com](https://www.mlb.com/news/taylor-smith-named-a-s-president-of-baseball-operations), [Boston Globe](https://www.bostonglobe.com/2024/10/23/sports/red-sox-taylor-smith-assistant-general-manager/), [MLB Trade Rumors](https://www.mlbtraderumors.com/2024/10/red-sox-hire-taylor-smith-from-rays-for-possible-agm-role.html).
- Castro: [MLB.com](https://www.mlb.com/news/a-s-name-cam-castro-general-manager), [Lake Erie College](https://lakeeriestorm.com/sports/baseball/roster/coaches/cameron-castro/514), [Yahoo Sports](https://sports.yahoo.com/articles/bet-pitching-development-cam-castro-183237512.html).
