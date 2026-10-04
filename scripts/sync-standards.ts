/**
 * Copies Atlas Standards' stylesheets into src/styles/, verbatim, stamped
 * with the commit they came from.
 *
 *   bun run sync:standards              # from ../standards
 *   STANDARDS_DIR=/path bun run sync:standards
 *
 * Refuses to copy uncommitted styles: the stamp has to name a commit that
 * actually contains what was copied. docs.css and mdx.css are the docs' own
 * and are never touched.
 */

import { $ } from 'bun';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const FILES = ['tokens', 'themes', 'globals', 'utilities'] as const;

const root = resolve(import.meta.dir, '..');
const standards = resolve(process.env.STANDARDS_DIR ?? join(root, '..', 'standards'));
const from = join(standards, 'src', 'styles');
const to = join(root, 'src', 'styles');

const dirty = (await $`git -C ${standards} status --porcelain -- src/styles`.text()).trim();
if (dirty) {
  console.error(`Standards has uncommitted changes in src/styles:\n${dirty}\nCommit them first.`);
  process.exit(1);
}
const commit = (await $`git -C ${standards} rev-parse --short HEAD`.text()).trim();

let changed = 0;
for (const name of FILES) {
  const header = `/* Verbatim copy of atlas standards src/styles/${name}.css at ${commit}.\n   Do not edit here: change standards, then copy it across again.\n   Docs-only overrides live in docs.css. */\n\n`;
  const next = header + (await readFile(join(from, `${name}.css`), 'utf8'));
  const target = join(to, `${name}.css`);
  const current = await readFile(target, 'utf8').catch(() => '');
  if (current === next) continue;
  await writeFile(target, next);
  changed++;
  console.log(`updated ${name}.css`);
}

console.log(changed ? `Synced ${changed} file(s) from standards at ${commit}.` : `Already in sync with standards at ${commit}.`);
