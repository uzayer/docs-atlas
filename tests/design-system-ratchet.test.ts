import { describe, it } from 'bun:test';
import { join } from 'node:path';
import { defineRatchetSuite, strictRules } from '@tryatlas/design/ratchet';

/**
 * The design-system ratchet, held over this site's own source.
 *
 * Every rule is at zero, and a rule at zero cannot quietly become one. The
 * rules live in `@tryatlas/design/ratchet`; `strictRules` is the notch the
 * web app holds (no raised shadows, no `[var(--…)]`, no `dark:`). The escape
 * hatch is friction, not a flag: `ratchet-allow: <reason>` on the line or in
 * the comment block above it, or a whole file below with its argument. An
 * exemption that stops suppressing anything fails too.
 */
defineRatchetSuite(
  {
    root: join(import.meta.dir, '..'),
    roots: ['src/app', 'src/components', 'src/lib', 'src/styles'],
    rules: strictRules,
    exemptFiles: {
      'src/lib/agent-icons.tsx':
        'Third-party agent marks whose colours are fixed by their owners, with no light or dark counterpart.',
      'src/lib/layout.shared.tsx':
        'The Discord and Facebook marks, whose fills are fixed by those brands’ guidelines.',
      'src/components/docs-og-image.tsx':
        'Rendered to a PNG by Satori, which reads neither CSS variables nor oklch(); the hex values mirror the dark tokens.',
      'src/components/mdx/mermaid.tsx':
        'mermaid bakes colours into the SVG it returns and cannot read CSS variables, so resolved token values are passed in.',
    },
    minFiles: 30,
    footer:
      'Scales and roles come from @tryatlas/design (its styles.css); docs-only CSS lives in src/styles/docs.css.',
  },
  { describe, it },
);
