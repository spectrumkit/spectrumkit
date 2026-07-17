const fs = require('node:fs');
const path = require('node:path');

// The apps under `examples/` are standalone integration examples: they ship
// complete, self-sufficient package.json files so they can be copied out of the
// repo, or opened straight from `.codesandbox` / `.devcontainer`, and installed
// against the registry with no monorepo around them.
//
// Inside the monorepo we strip every dependency they share with the root
// package.json, so the workspace installs one copy of each shared dep (hoisted
// to the root `node_modules` by `node-linker=hoisted`) instead of resolving the
// same packages a second and third time under each example. The examples then
// resolve react/wagmi/next/etc. from the hoisted root -- phantom deps, which is
// fine here precisely because hoisting turns phantom-dep detection off anyway.
//
// Why bother, when `pnpm.overrides` already pins the stateful singletons
// (react, react-dom, wagmi, viem, @tanstack/react-query)? Because `overrides`
// does not cover everything the examples declare -- `next`, `vite`,
// `typescript`, `@vitejs/plugin-react`, `@types/*` are not in that block. For
// those, this hook plus the version-equality throw below is what keeps the
// examples from introducing a second resolution of a package the root already
// owns. Duplicating the React or wagmi resolution is not a tidiness problem
// here, it is a runtime bug: two React copies give "Invalid hook call", two
// wagmi copies give WagmiProviderNotFoundError.
//
// ---------------------------------------------------------------------------
// TRADEOFF -- READ BEFORE "FIXING" THIS.
//
// Because the shared deps never enter the install graph, `examples/*` never
// appear in the `Dependents` column of `pnpm outdated -r`, `pnpm audit`,
// `pnpm why`, or `pnpm update`. That looks alarming, and it is worth being
// precise about what it does and does not cost:
//
//   * A dep the example shares with the root is stripped -- but the throw below
//     makes the install FAIL unless the example's specifier is byte-identical
//     to the root's. The example therefore cannot drift; it is version-slaved
//     to the root, and the root IS fully visible to outdated/audit.
//   * A dep the example declares that the root does NOT declare is kept (see
//     the `!rootDependencies[dep]` branch) and so lands in the graph and IS
//     visible.
//
// Every example dependency falls into one bucket or the other. So an example
// cannot silently pin a vulnerable `next` that no tool reports: either the root
// pins it too, and `pnpm outdated` flags the root, or the specifiers differ and
// the install throws. The blindness is a reporting-cosmetic -- the two example
// names are missing from a column -- not a hole in dependency hygiene.
//
// The obvious "fix" (stop stripping, let the examples into the graph so the
// tooling names them) trades that cosmetic for a real risk of a fragmented tree
// and duplicate react/wagmi copies. Correctness of the tree beats tooling
// visibility. Don't make that trade without re-deriving the whole argument.
//
// Note `packages/example` is deliberately NOT covered here. It is the internal
// dev playground (private, driven by `pnpm dev`), never consumed outside this
// monorepo, so it has no standalone package.json to keep complete and no reason
// to be stripped. It duplicates root deps in the graph and shows up in
// `pnpm outdated` as `example`. That asymmetry is intended.
// ---------------------------------------------------------------------------

function readPackage(pkg) {
  // Match an explicit, workspace-derived set of names -- NOT a `/^with-/`
  // regex. `readPackage` runs for every package pnpm resolves, including
  // everything from the registry, so a name pattern would also strip the deps
  // of any published package that happened to start with "with-"
  // (`with-async-hook`, say), producing a broken install that is very hard to
  // trace back to this file.
  if (exampleAppNames().has(pkg.name)) {
    pkg.dependencies = omitRootDependencies(pkg.name, pkg.dependencies);
    pkg.devDependencies = omitRootDependencies(pkg.name, pkg.devDependencies);
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};

let exampleAppNamesCache;

// Derived from the `examples/*` workspace glob rather than hardcoded, so a new
// example app is covered the day it is added. An example that silently missed
// this list would duplicate the root's deps in the graph -- exactly the
// fragmentation this hook exists to prevent.
function exampleAppNames() {
  if (exampleAppNamesCache) {
    return exampleAppNamesCache;
  }

  const examplesDir = path.join(__dirname, 'examples');
  const names = new Set();

  let entries = [];
  try {
    entries = fs.readdirSync(examplesDir, { withFileTypes: true });
  } catch {
    // No examples/ directory: nothing to strip.
    exampleAppNamesCache = names;
    return names;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const manifestPath = path.join(examplesDir, entry.name, 'package.json');
    try {
      const { name } = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (name) names.add(name);
    } catch {
      // Not a package (or unreadable/malformed manifest): skip it. pnpm will
      // report the real error itself if it is meant to be a workspace project.
    }
  }

  exampleAppNamesCache = names;
  return names;
}

function omitRootDependencies(packageName, dependencies = {}) {
  const packageJson = require('./package.json');
  const rootDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const filteredDependencies = {};
  const allowedDuplicatePackages = [
    // None for now
  ];

  for (const dep of Object.keys(dependencies)) {
    if (!rootDependencies[dep] || allowedDuplicatePackages.includes(dep)) {
      // Keep the dependency in the app template's package.json since it's not in the
      // root package.json (or in the list of allowed duplicate packages).
      filteredDependencies[dep] = dependencies[dep];
    } else if (rootDependencies[dep] !== dependencies[dep]) {
      throw new Error(
        `Dependency ${dep} has different version in root package.json. Root: ${rootDependencies[dep]}, ${packageName}: ${dependencies[dep]}`,
      );
    }
  }

  return filteredDependencies;
}
