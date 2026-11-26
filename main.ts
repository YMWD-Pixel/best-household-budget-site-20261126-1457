// Hearth & Ledger — hand-in program (Node 22, standard library only).
//
// The site itself is plain static files in app/: index.html, one stylesheet
// and a handful of ES modules, with no build step and nothing loaded over the
// network. This program's only job is to assemble what the grader reads: it
// copies app/ and screenshots/ from this repository into the output
// directory and writes dossier.json there, using the vendored make.fun
// library. The library file vendor/makefun-frontend.ts must stay exactly as
// the kit shipped it: the scorer rebuilds the dossier with its own copy and
// the two must match byte for byte.
//
// Local runs use MAKEFUN_OUTPUT_DIR in place of /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and `node serve.ts` serves app/ at http://localhost:8080 for a look.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

function copyTree(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    const src = join(srcDir, entry.name);
    const dest = join(destDir, entry.name);
    if (entry.isDirectory()) copyTree(src, dest);
    else if (entry.isFile()) writeFileSync(dest, readFileSync(src));
    // Anything else (a symlink, a socket) is left out on purpose: the
    // scorer only accepts plain files and directories under app/.
  }
}

function dossierOptions() {
  // The scorer's caps, mirrored here so a local run refuses what the
  // scorer would refuse: at most 4 screenshots of 256 KiB, at most 993
  // entries and 16 MiB under app/, and a 160 KiB text budget for the dossier.
  return {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  };
}

const appOut = join(outDir, 'app');
copyTree(join(repoRoot, 'app'), appOut);
if (existsSync(join(repoRoot, 'screenshots'))) {
  copyTree(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'));
} else {
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
}

const appFiles = readdirSync(appOut, { recursive: true }).length;
if (!existsSync(join(appOut, 'index.html'))) throw new Error('app/index.html is missing');
if (!statSync(join(appOut, 'index.html')).isFile()) throw new Error('app/index.html is not a file');

writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, dossierOptions()));
console.log(`handed in ${appFiles} app entries to ${outDir}`);
