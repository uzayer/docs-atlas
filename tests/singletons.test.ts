import { describe, expect, it } from 'bun:test';
import { existsSync, readdirSync, realpathSync } from 'node:fs';
import { join } from 'node:path';

/**
 * One copy of every package that holds React context.
 *
 * A second React, Base UI or design package renders fine in development and
 * breaks hooks, tooltips or theming in production, with nothing in the build
 * saying so. `bun install` can leave a nested duplicate after a version bump;
 * this suite walks every node_modules and counts the real directories.
 */

const ROOT = join(import.meta.dir, '..');
const SINGLETONS = ['react', 'react-dom', '@base-ui/react', '@tryatlas/design', 'motion'];

function copies(): Map<string, Set<string>> {
  const found = new Map<string, Set<string>>(SINGLETONS.map((name) => [name, new Set()]));
  const visit = (modules: string) => {
    if (modules.includes('/next/dist/compiled/')) return;
    for (const entry of readdirSync(modules, { withFileTypes: true })) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
      const dirs = entry.name.startsWith('@')
        ? readdirSync(join(modules, entry.name)).map((name) => `${entry.name}/${name}`)
        : [entry.name];
      for (const name of dirs) {
        const dir = join(modules, name);
        found.get(name)?.add(realpathSync(dir));
        const nested = join(dir, 'node_modules');
        if (existsSync(nested)) visit(nested);
      }
    }
  };
  visit(join(ROOT, 'node_modules'));
  return found;
}

describe('singletons', () => {
  const found = copies();
  for (const name of SINGLETONS) {
    it(`one copy of ${name}`, () => {
      expect([...found.get(name)!]).toHaveLength(1);
    });
  }
});
