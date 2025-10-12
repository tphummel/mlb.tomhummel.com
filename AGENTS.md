# Editorial Guidelines for LLM Agents
- Always include `players` and `teams` arrays in the front matter of every post. Use kebab-case slugs for each entry.
- For TIL posts, keep the body short, direct, and information-dense. Prefer bullet lists or concise sentences that mirror provided facts.
- Use the term "WAR" consistently—do not distinguish between bWAR, fWAR, etc., unless explicitly instructed.
- Avoid editorial flourish or speculation; only include the exact facts supplied in the task description unless additional research is requested.

## Inline Shortcode Strategy Notes
- Favor inline shortcodes for light analysis work so the logic and output stay inside the content file. Define the shortcode with `{{<* name.inline >}}` immediately above its first use and avoid creating standalone shortcode templates unless the logic will be reused across multiple files.
- For checklist-style articles under `content/cards/`, keep the full checklist data (card number, date, player names, print runs, ownership flags, rookie flags, etc.) in the page front matter. The inline shortcodes should read from `.Params.checklist` to calculate stats and render tables.
- Emit summary metrics (totals, owned counts, rookie counts) from a single inline shortcode invocation that returns finished HTML, typically an unordered list, so the content file remains concise.
- When rendering the checklist table inline, handle optional fields (e.g., missing titles) gracefully and keep the column order consistent: owned indicator, card number, release date, player names, print run, and title on the right.
- Place a "Summary" heading above the stats block and a "Checklist" heading above the table to keep sectioning consistent across similar pages.
- Document any additional data requirements or presentation conventions next to the inline shortcode definitions to aid future updates.
