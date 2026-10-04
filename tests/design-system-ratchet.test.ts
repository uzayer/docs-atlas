import { describe, expect, it } from 'bun:test';
import { Glob } from 'bun';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The ratchet, from Atlas Standards (tests/design-system-ratchet.test.ts),
 * held over this site's own components.
 *
 * Every rule is at zero, and a rule at zero cannot quietly become one. The
 * escape hatch is friction, not a flag: append `ratchet-allow: <reason>` to
 * the line with at least 20 characters explaining why the token layer could
 * not express it.
 *
 * The rules match standards' word for word, so a component can move between
 * the two repos without being restyled.
 */

const ROOT = join(import.meta.dir, '..');
const SCANNED = ['src/components/**/*.tsx', 'src/app/**/*.tsx', 'src/lib/**/*.tsx'];

/** Files the rules cannot apply to, each with a reason of its own. */
const EXEMPT: Record<string, string> = {
  // Agent and product marks. Their colours are the marks; they are not theme
  // values and have no light/dark counterpart.
  'src/lib/agent-icons.tsx': 'third-party marks whose colours are fixed by their owners',
  'src/lib/layout.shared.tsx': 'Discord and Facebook marks whose fills are fixed by brand guidelines',
  // Rendered to a PNG by the OG route, outside the page and its CSS, so it
  // cannot read a token.
  'src/components/docs-og-image.tsx': 'rendered to an image, where CSS variables do not exist',
  'src/app/og/docs/[...slug]/route.tsx': 'rendered to an image, where CSS variables do not exist',
  // mermaid bakes colours and sizes into the SVG it returns. The component
  // resolves the tokens at runtime and hands mermaid the values; the
  // literals are only the fallbacks for a token that fails to resolve.
  'src/components/ui/mermaid.tsx': 'mermaid cannot read CSS variables, so resolved token values are passed in',
};

type Rule = { name: string; pattern: RegExp; why: string };

const RULES: Rule[] = [
  {
    name: 'arbitrary-text-size',
    pattern: /text-\[[^\]]*(?:px|rem|em)\]/,
    why: 'Use a step from the type scale (text-4xs … text-2xl).',
  },
  {
    name: 'arbitrary-radius',
    pattern: /rounded(?:-[a-z]+)?-\[(?!inherit\])[^\]]+\]/,
    why: 'Use rounded-sm / -md / -lg / -xl / -full.',
  },
  {
    name: 'arbitrary-shadow',
    pattern: /shadow-\[[^\]]+\]/,
    why: 'Use shadow-md (menus) or shadow-lg (dialogs).',
  },
  {
    name: 'arbitrary-z-index',
    pattern: /\bz-\[[^\]]+\]/,
    why: 'Use a named layer: z-panel, z-drawer, z-overlay, z-modal, z-popover, z-toast, z-tooltip.',
  },
  {
    name: 'bare-z-index',
    pattern: /\bz-(?:[5-9]\d|\d{3,})\b/,
    why: 'A z-index at or above 50 must be a named layer, not a number.',
  },
  {
    name: 'colour-literal',
    pattern: /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(|\bcolor-mix\(/,
    why: 'Colour belongs in src/styles (themes.css or docs.css). Components name a role.',
  },
  {
    name: 'raised-shadow',
    pattern: /\bshadow-(?:2?xs|sm|xl|2xl|black|white)(?:\/\d+)?\b/,
    why: 'Elevation is a ring, not a shadow. Only shadow-md (menus) and shadow-lg (dialogs) cast.',
  },
  {
    name: 'arbitrary-var',
    pattern: /\[var\(--/,
    why: 'Map the variable in @theme and use the utility, or the (--x) shorthand for layout values.',
  },
  {
    name: 'white-black-utility',
    pattern: /\b(?:bg|text|border|ring|fill|stroke|divide|outline)-(?:white|black)\b/,
    why: 'white and black do not invert. Use foreground/background or an element-* overlay.',
  },
  {
    name: 'tailwind-palette',
    pattern:
      /\b(?:bg|text|border|ring|fill|stroke|divide|outline|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
    why: 'Stock Tailwind ramps are not themed. Use a role token.',
  },
  {
    name: 'inline-numeric-style',
    pattern: /\b(?:zIndex|fontSize|boxShadow|borderRadius)\s*:\s*['"`]?\d/,
    why: 'Inline numeric styles bypass the token layer entirely.',
  },
  {
    name: 'dark-variant',
    pattern: /\bdark:[a-z[]/,
    why: 'The token layer already inverts. A dark: override is a second source of truth.',
  },
];

const ALLOW = /ratchet-allow:\s*(.{20,})/;
const COMMENT = /^\s*(?:\/\/|\/\*|\*)/;

function files(): string[] {
  return SCANNED.flatMap((pattern) => [...new Glob(pattern).scanSync({ cwd: ROOT })]);
}

function scan() {
  const violations: { file: string; line: number; text: string; rule: Rule }[] = [];
  for (const file of files()) {
    if (file in EXEMPT) continue;
    readFileSync(join(ROOT, file), 'utf8')
      .split('\n')
      .forEach((text, i) => {
        if (ALLOW.test(text) || COMMENT.test(text)) return;
        for (const rule of RULES) {
          if (rule.pattern.test(text)) violations.push({ file, line: i + 1, text: text.trim(), rule });
        }
      });
  }
  return violations;
}

describe('design-system ratchet', () => {
  const violations = scan();

  it('scans something', () => {
    expect(files().length).toBeGreaterThan(0);
  });

  for (const rule of RULES) {
    it(`${rule.name} is at zero`, () => {
      const hits = violations
        .filter((v) => v.rule === rule)
        .map((v) => `${v.file}:${v.line}  ${v.text}\n    → ${rule.why}`);
      expect(hits).toEqual([]);
    });
  }
});
