#!/usr/bin/env node
/**
 * Merge `build/_raw/manifest/_base_v{2,3}.json` + the per-browser overlay into
 * `dist/<browser>/manifest.json`, then drop the temporary `manifest/` folder.
 *
 * Mirrors the gulp task_merge_manifest + task_clean_tmps used by the prod
 * build, but runs as a plain node script so webpack-only dev builds also
 * produce a loadable extension.
 *
 * Usage:
 *   node scripts/merge-manifest.js --browser=chrome --manifest=mv3
 */

const fs = require('fs');
const path = require('path');

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, v] = a.replace(/^--/, '').split('=');
      return [k, v];
    })
);

const browser = args.browser || 'chrome';
const manifest = args.manifest || 'mv3';
const baseFile = manifest === 'mv2' ? '_base_v2' : '_base_v3';

const root = path.resolve(__dirname, '..');
const rawDir = path.join(root, 'build', '_raw');
const distDir = path.join(root, 'dist', browser);

// Copy raw assets first (mirrors `pnpm clean`'s `cp -r build/_raw/* dist/<browser>`).
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

fs.mkdirSync(distDir, { recursive: true });
for (const entry of fs.readdirSync(rawDir)) {
  copyRecursive(path.join(rawDir, entry), path.join(distDir, entry));
}

// Merge manifest fragments.
const base = JSON.parse(
  fs.readFileSync(path.join(rawDir, 'manifest', `${baseFile}.json`), 'utf8')
);
const overlay = JSON.parse(
  fs.readFileSync(path.join(rawDir, 'manifest', `${browser}.json`), 'utf8')
);

// Pull version from the extension package.json so we don't drift.
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const merged = { ...base, ...overlay, version: pkg.version };

fs.writeFileSync(
  path.join(distDir, 'manifest.json'),
  JSON.stringify(merged, null, 2)
);

// Drop the manifest source folder — Chrome warns about unknown files.
fs.rmSync(path.join(distDir, 'manifest'), { recursive: true, force: true });

console.log(`✔ Wrote ${path.relative(root, path.join(distDir, 'manifest.json'))}`);
