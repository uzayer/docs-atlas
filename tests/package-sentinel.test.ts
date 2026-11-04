import { describe, expect, it } from 'bun:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PACKAGE_SENTINEL_CLASS } from '@tryatlas/design';

/**
 * The last `next build` compiled the package's classes and fonts.
 *
 * Tailwind generates a class only from a file it scans. The package's own
 * classes reach the docs' CSS only through the `@source` in its styles.css;
 * lose that, or the import, and every primitive renders unstyled with the
 * build green. The sentinel is a class only the package's dist names, so its
 * rule is in the built CSS exactly when the package was scanned. Geist ships
 * with the package too (no Google Fonts), so its @font-face and woff2 files
 * must be in the build. Reads `.next/static`: run `bun run build` first.
 */

const STATIC = join(import.meta.dir, '..', '.next', 'static');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

describe('package sentinel', () => {
  if (!existsSync(STATIC)) throw new Error('No .next/static: run "bun run build" first.');
  const files = walk(STATIC);
  const css = files
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');

  it("the package's classes were compiled", () => {
    // An arbitrary-property class, `[--name:value]`, compiles to `--name: value`.
    // Never write the class out in this repo: Tailwind scans tests/ too, so
    // the literal here would generate the rule and the suite could not fail.
    const [name, value] = PACKAGE_SENTINEL_CLASS.slice(1, -1).split(':');
    expect(css).toMatch(new RegExp(`${name}\\s*:\\s*${value}`));
  });

  it("Geist comes from the package's @font-face", () => {
    expect(css).toMatch(/@font-face\s*\{[^}]*Geist Variable/);
    expect(files.some((file) => file.endsWith('.woff2'))).toBe(true);
  });
});
