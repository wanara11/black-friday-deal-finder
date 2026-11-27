// DealHound entrypoint (Node 22, standard library only).
//
// What it does: hand the static site in. It copies this repository's app/ and
// screenshots/ into the grader's output directory and writes dossier.json there
// with the vendored make.fun library, so the judge can read the site's first load,
// its source outline and its screenshots. The site itself is plain static files:
// index.html opens in a desktop browser or on a phone and loads nothing over the
// network; every deal it shows lives in app/data.js.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR set:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (Without it, the grader's /output is used.)
//
// Deterministic by design: it copies files and writes the dossier from them, with
// no clock, no randomness and no network, so two runs produce the same /output.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const appDir = join(here, "app");
const shotsDir = join(here, "screenshots");

// Fail loudly, before writing anything, when the site is incomplete.
for (const needed of [join(appDir, "index.html"), join(appDir, "data.js"), join(appDir, "main.js")]) {
  if (!existsSync(needed)) throw new Error(`missing required site file: ${needed}`);
}
const shots = existsSync(shotsDir) ? readdirSync(shotsDir).filter((f) => statSync(join(shotsDir, f)).isFile()) : [];
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`expected 3 or 4 screenshots, found ${shots.length}`);
}

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
cpSync(shotsDir, join(out, "screenshots"), { recursive: true });

// Same caps the gate enforces: the dossier is refused when app/ or screenshots/
// are past them, so an oversized entry fails here first, with the library's words.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log(`handed in ${shots.length} screenshots and the app to ${out}`);
