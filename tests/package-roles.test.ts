import { describe, expect, it } from 'bun:test';
import { Glob } from 'bun';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { D23_RENAMES } from '@tryatlas/design';

/**
 * Every CSS variable the docs read exists.
 *
 * An unknown `var(--name)` is not an error anywhere: the declaration is
 * dropped and the element renders transparent or unstyled. A role the
 * package renames (its D23 table) or removes therefore breaks the docs with
 * every gate green. This suite lists the names declared by the package, by
 * Tailwind's theme and by the docs' own CSS, and fails on any name a docs
 * file reads that none of them declares, or that is an old D23 name.
 */

const ROOT = join(import.meta.dir, '..');
const DOCS_CSS = ['src/styles/docs.css', 'src/styles/mdx.css', 'src/app/global.css'];
const DECLARING_CSS = [
  ...DOCS_CSS,
  'node_modules/tailwindcss/theme.css',
  ...[...new Glob('node_modules/@tryatlas/design/src/styles/*.css').scanSync({ cwd: ROOT })],
];

/** Set at runtime by someone else: Fumadocs, Tailwind, Shiki, Base UI. */
const EXTERNAL_PREFIXES = ['--fd-', '--color-fd-', '--tw-', '--shiki-'];
const BASE_UI_RUNTIME = new Set([
  '--available-height',
  '--available-width',
  '--transform-origin',
  '--anchor-width',
  '--anchor-height',
]);
const OLD_D23_NAMES = new Set(Object.keys(D23_RENAMES).map((name) => `--${name}`));

const read = (file: string) => readFileSync(join(ROOT, file), 'utf8');
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

function declared(): Set<string> {
  const names = new Set<string>();
  for (const file of DECLARING_CSS) {
    for (const m of stripComments(read(file)).matchAll(/(--[\w-]+)\s*:/g)) names.add(m[1]);
  }
  return names;
}

function used(): { file: string; name: string }[] {
  const uses: { file: string; name: string }[] = [];
  for (const file of DOCS_CSS) {
    for (const m of stripComments(read(file)).matchAll(/var\(\s*(--[\w-]+)/g)) uses.push({ file, name: m[1] });
  }
  for (const file of new Glob('src/**/*.tsx').scanSync({ cwd: ROOT })) {
    for (const m of read(file).matchAll(/(?:var\(\s*|\()(--[\w-]+)\)?/g)) uses.push({ file, name: m[1] });
  }
  return uses;
}

const external = (name: string) =>
  BASE_UI_RUNTIME.has(name) || EXTERNAL_PREFIXES.some((prefix) => name.startsWith(prefix));

describe('package roles', () => {
  const names = declared();
  const uses = used();

  it('reads something', () => {
    expect(uses.length).toBeGreaterThan(20);
  });

  it('every variable the docs read is declared', () => {
    const missing = uses.filter(({ name }) => !external(name) && !names.has(name));
    expect(missing.map(({ file, name }) => `${file}: ${name}`)).toEqual([]);
  });

  it('no variable the docs read is an old D23 name', () => {
    const stale = uses.filter(({ name }) => OLD_D23_NAMES.has(name));
    expect(stale.map(({ file, name }) => `${file}: ${name} (renamed in @tryatlas/design)`)).toEqual([]);
  });
});
