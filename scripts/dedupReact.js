#!/usr/bin/env node
/*
 * Dedup workspace duplicates of singleton-bearing packages.
 *
 * pnpm with `node-linker = hoisted` AND `@wagmi/connectors` having 7 optional
 * peers means each workspace package's closure hashes differently. pnpm then
 * creates a SEPARATE physical copy of `wagmi`, `@wagmi/core`, `react`, etc.
 * per closure under `node_modules/.pnpm/<pkg>@<ver>_<peerHash>/`. When two
 * physical copies of `wagmi` exist, two `WagmiContext` React Context objects
 * exist → `<WagmiProvider>` from one copy fills one Context, `useConfig` from
 * the other copy reads `null` → `WagmiProviderNotFoundError`.
 *
 * Same pattern hits `react` (different `useRef` dispatcher state),
 * `@tanstack/react-query` (different `QueryClientProvider` Context), etc.
 *
 * Fix: pick ONE canonical .pnpm closure per package, symlink every other
 * resolution path (root + each workspace package) at it. Idempotent.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pnpmDir = path.join(root, 'node_modules', '.pnpm');

if (!fs.existsSync(pnpmDir)) {
  console.log('[dedupReact] no .pnpm dir, skipping');
  process.exit(0);
}

const pnpmEntries = fs.readdirSync(pnpmDir);

// Each entry: pkgName, regex matching its .pnpm closure dirs.
// pickBest picks the closure with the most peer-deps resolved (longest
// suffix), so unioning closures into one tends to leave the others
// resolvable too.
const PACKAGES = [
  { name: 'react', re: /^react@\d/, exclude: /^react-/ },
  { name: 'react-dom', re: /^react-dom@\d.*_react@/ },
  { name: '@tanstack/react-query', re: /^@tanstack\+react-query@\d.*_react@/ },
  { name: 'wagmi', re: /^wagmi@\d/ },
  { name: '@wagmi/core', re: /^@wagmi\+core@\d/ },
  { name: '@wagmi/connectors', re: /^@wagmi\+connectors@\d/ },
];

function pickClosure({ re, exclude }) {
  const matches = pnpmEntries.filter((n) => re.test(n) && !exclude?.test(n));
  if (matches.length === 0) return null;
  // Pick longest name — that's the closure with the most resolved peers,
  // so other code paths that need any of those peers can still resolve them.
  matches.sort((a, b) => b.length - a.length);
  return matches[0];
}

function findWorkspaceLocations(pkgName) {
  const out = [path.join(root, 'node_modules', pkgName)];
  const pkgsDir = path.join(root, 'packages');
  if (fs.existsSync(pkgsDir)) {
    for (const ws of fs.readdirSync(pkgsDir)) {
      const candidate = path.join(pkgsDir, ws, 'node_modules', pkgName);
      if (fs.existsSync(candidate) || fs.existsSync(path.dirname(candidate))) {
        out.push(candidate);
      }
    }
  }
  return out;
}

function relinkAt(linkPath, target) {
  const lstat = fs.existsSync(linkPath) ? fs.lstatSync(linkPath) : null;
  if (lstat?.isSymbolicLink()) {
    if (fs.readlinkSync(linkPath) === target) return false;
  }
  if (lstat) {
    fs.rmSync(linkPath, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  fs.symlinkSync(target, linkPath);
  return true;
}

let changed = 0;
for (const pkg of PACKAGES) {
  const closure = pickClosure(pkg);
  if (!closure) {
    console.warn(`[dedupReact] no .pnpm closure for ${pkg.name}`);
    continue;
  }
  const canonicalAbs = path.join(pnpmDir, closure, 'node_modules', pkg.name);
  if (!fs.existsSync(canonicalAbs)) {
    console.warn(`[dedupReact] missing canonical: ${canonicalAbs}`);
    continue;
  }
  for (const linkPath of findWorkspaceLocations(pkg.name)) {
    const target = path.relative(path.dirname(linkPath), canonicalAbs);
    if (relinkAt(linkPath, target)) {
      changed++;
      console.log(
        `[dedupReact] linked ${path.relative(root, linkPath)} -> ${target}`,
      );
    }
  }
}

if (changed === 0) {
  console.log('[dedupReact] all symlinks already canonical');
}
