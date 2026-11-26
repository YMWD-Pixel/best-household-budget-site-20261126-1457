# best-household-budget-site-20261126-1457

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/YMWD-Pixel/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/YMWD-Pixel/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hearth & Ledger — a household budget site. Track what a family of four earns and spends, set a monthly limit for every part of household life, save toward goals, and see what the numbers mean — all in the browser, with nothing sent anywhere.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the dashboard, transactions, budgets, goals and insights are all there, with real figures for the Rivera household's November 2026. Add, edit and delete transactions, change a budget limit, add to a goal: every page updates at once, and the figures persist in the browser's local storage. `shoot.py` retakes the four screenshots under `screenshots/` with headless Chromium.

## How it is built

- `app/` — the site itself: plain static files, no build step, no network requests. `index.html` is the shell, `style.css` the design, `data.js` the household's figures, `store.js` state and persistence, `charts.js` hand-drawn SVG charts, `views.js` the five sections, `app.js` the hash router and wiring.
- `main.ts` — the hand-in program (Node 22): copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
- `vendor/makefun-frontend.ts` — the kit's copy, unchanged.

---

<sub>Entered on [make.fun](https://make.fun/?ref=fxcrjdqj&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
