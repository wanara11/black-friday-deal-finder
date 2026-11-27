# black-friday-deal-finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/wanara11/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/wanara11/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

DealHound — a static Black Friday / Cyber Monday deal finder. Every deal was checked by an AI agent at the store on 27 Nov 2026, with sale price, usual price, discount and a plain verdict on whether it is really a deal. Search and filter by category, store, discount and verdict; the same product is compared across stores. Runs offline from static files, on desktop and phone.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Then open `out/app/index.html` in a browser (or serve `out/app` with any static server). `main.ts` copies `app/` and `screenshots/` into the output directory and writes `dossier.json` there.

---

<sub>Entered on [make.fun](https://make.fun/?ref=9f9brj56&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
