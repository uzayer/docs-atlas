/**
 * Writes content/docs/product/configuration.mdx from Atlas's settings
 * registry, stamped with the commit it came from.
 *
 *   bun run sync:settings              # from ../atlas
 *   ATLAS_DIR=/path bun run sync:settings
 *
 * The registry is `src-tauri/settings-registry.toml` in the atlas repo; `bun run
 * settings:gen` there exports it as `docs/reference/settings.json`, which is
 * what this reads. Every key, its default, and where to change it come from
 * that file, so this page cannot drift from the app the way a hand-written
 * table would. The prose around the table is here, in `INTRO`.
 *
 * Refuses an uncommitted registry, like sync:standards: the stamp has to name
 * a commit that actually contains what was copied. \`ALLOW_DIRTY=1\` writes the
 * page anyway for a local preview, stamped as uncommitted; never ship that.
 */

import { $ } from 'bun';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

interface Page {
  id: string;
  title: string;
  description: string;
}

interface Setting {
  key: string;
  type: string;
  status: 'live' | 'elsewhere' | 'file-only' | 'internal';
  page: string;
  section: string;
  title: string;
  summary: string;
  values?: string[];
  min?: number;
  max?: number;
  platforms?: string[];
  applies?: string;
  setIn?: string;
  project?: true;
  default: string | null;
}

const SOURCE = 'docs/reference/settings.json';
const root = resolve(import.meta.dir, '..');
const atlas = resolve(process.env.ATLAS_DIR ?? join(root, '..', 'atlas'));
const target = join(root, 'content', 'docs', 'product', 'configuration.mdx');

const dirty = (await $`git -C ${atlas} status --porcelain -- ${SOURCE}`.text()).trim();
if (dirty && !process.env.ALLOW_DIRTY) {
  console.error(`Atlas has uncommitted changes to ${SOURCE}:\n${dirty}\nCommit them first.`);
  process.exit(1);
}
const head = (await $`git -C ${atlas} rev-parse --short HEAD`.text()).trim();
const commit = dirty ? `${head} plus uncommitted changes` : head;
const registry = JSON.parse(await readFile(join(atlas, SOURCE), 'utf8')) as {
  pages: Page[];
  settings: Setting[];
};

const PLATFORM_NAMES: Record<string, string> = { macos: 'macOS', windows: 'Windows', linux: 'Linux' };

const INTRO = `Every Atlas preference lives in one file, \`~/.config/atlas/config.toml\`. Settings writes to it, and so can you: open it in any editor and Atlas picks up the change as soon as you save. You never need to restart unless a key below says so.

Atlas writes the file with a comment above every key saying what it does and what its default is, so the file explains itself. Your own comments, and keys Atlas does not recognize, survive every change Atlas makes. If an edit breaks the file, Atlas keeps running on the last settings that loaded cleanly, shows the error in Settings, and leaves the file exactly as you wrote it.

A development build reads \`~/.config/atlas-dev/config.toml\` instead. If \`$XDG_CONFIG_HOME\` is set, Atlas uses \`$XDG_CONFIG_HOME/atlas/config.toml\`.

\`\`\`toml title="~/.config/atlas/config.toml"
schemaVersion = 1

[settings]
enterToSend = false
themeMode = "dark"
\`\`\`

The keys sit under \`[settings]\`. Leave \`schemaVersion\` alone; Atlas manages it.`;

/** Keeps a cell on one table row and inside the docs' house style. */
const cell = (text: string) => text.replaceAll('|', '\\|').replaceAll(' — ', ', ').replaceAll('—', ', ');

function accepted(setting: Setting): string {
  if (setting.values) return setting.values.map((value) => `\`"${value}"\``).join(', ');
  if (setting.min !== undefined && setting.max !== undefined)
    return `${setting.type === 'integer' ? 'a whole number' : 'a number'} from ${setting.min} to ${setting.max}`;
  switch (setting.type) {
    case 'boolean':
      return '`true` or `false`';
    case 'string-list':
      return 'a list of strings';
    case 'optional-string':
      return 'a string, or leave it out';
    case 'table':
      return 'a table';
    default:
      return 'a string';
  }
}

function where(setting: Setting, page: Page): string {
  switch (setting.status) {
    case 'live':
      return `Settings → ${page.title} → **${setting.title}**`;
    case 'elsewhere':
      return cell(setting.setIn ?? '');
    case 'file-only':
      return 'This file only';
    default:
      return '';
  }
}

function notes(setting: Setting): string {
  const parts: string[] = [];
  if (setting.platforms) parts.push(`${setting.platforms.map((p) => PLATFORM_NAMES[p] ?? p).join(' and ')} only.`);
  if (setting.applies) parts.push(`Applies ${setting.applies}.`);
  if (setting.project) parts.push('A project can override it.');
  return parts.join(' ');
}

function table(rows: Setting[], page: Page): string {
  const lines = ['| Key | What it does | Default | Accepts | Where to change it |', '| --- | --- | --- | --- | --- |'];
  for (const setting of rows) {
    const summary = [setting.summary, notes(setting)].filter(Boolean).join(' ');
    lines.push(
      `| \`${setting.key}\` | ${cell(summary)} | ${setting.default === null ? 'not set' : `\`${cell(setting.default)}\``} | ${accepted(setting)} | ${where(setting, page)} |`,
    );
  }
  return lines.join('\n');
}

const sections: string[] = [];
for (const page of registry.pages) {
  const rows = registry.settings.filter(
    (setting) => setting.page === page.id && ['live', 'elsewhere', 'file-only'].includes(setting.status),
  );
  if (rows.length === 0) continue;
  sections.push(`## ${page.title}\n\n${page.description}\n\n${table(rows, page)}`);
}

const managed = registry.settings.filter((setting) => setting.status === 'internal');
const managedSection = `## Keys Atlas manages

Atlas writes these itself. You can read them, but there is nothing to change by hand.

${managed.map((setting) => `- \`${setting.key}\`: ${cell(setting.summary)}`).join('\n')}`;

const projectKeys = registry.settings.filter((setting) => setting.project);
const projectSection = `## Per-project settings

A project can override a few keys in its own \`.atlas/config.toml\`. The file holds only the keys that project changes, and it sits in the directory Atlas keeps out of git, so the overrides are yours, not your team's. Delete a line to go back to the value for all projects. Any other key in that file is ignored.

${projectKeys.map((setting) => `- \`${setting.key}\`: ${cell(setting.title)}`).join('\n')}

In Settings, the pages with these keys open with **Applying settings for All projects**. Pick a project there to change its values; see [Settings](/docs/product/settings#per-project-settings).`;

const page = `---
title: Configuration file
description: Every key in config.toml, its default, and where to change it.
icon: FileCog
---

{/* Generated by \`bun run sync:settings\` from atlas ${SOURCE} at ${commit}. Do not edit here: change src-tauri/settings-registry.toml in atlas, run \`bun run settings:gen\` there, commit, then sync again. */}

${INTRO}

${sections.join('\n\n')}

${projectSection}

${managedSection}

## Next

- [Settings](/docs/product/settings): the same preferences, in the app
- [Power user](/docs/product/power-user): keyboard shortcuts and \`keybindings.json\`
`;

const current = await readFile(target, 'utf8').catch(() => '');
if (current === page) {
  console.log(`Already in sync with atlas at ${commit}.`);
} else {
  await writeFile(target, page);
  console.log(`Wrote content/docs/product/configuration.mdx from atlas at ${commit}.`);
}
