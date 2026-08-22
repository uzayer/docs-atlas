# docs-atlas

Public documentation site for [Atlas](https://github.com/pacifio/atlas), source control for coding agents. Built with [Fumadocs](https://fumadocs.dev) on Next.js.

This repo has no product code, only docs content and the site that renders it.

## Commands

Bun is the runtime and package manager. Don't use npm, pnpm, or yarn.

```bash
bun install
bun dev              # next dev, http://localhost:3000
bun run build        # next build
bun start            # serve the production build
bun run types:check  # next typegen && tsc --noEmit
bun run lint         # oxlint
```

There's no test suite. `types:check` plus `lint` is the full verification pass. Content changes are validated by the build, not the linter: MDX frontmatter is checked against the page schema when the collection compiles.

## Structure

- `content/docs/` is the published doc tree. A folder's `meta.json` is an allowlist that drives sidebar order; a page you forget to list there won't appear.
- `src/lib/source.ts` wires the MDX collection and icon resolution. Every route reads from it.
- `src/lib/shared.ts` holds the route constants that connect the proxy, the OG image route, and the markdown route.
- Each page renders three ways from the same source: HTML at `/docs/...`, markdown at `/llms.mdx/docs/...`, and an OG image at `/og/docs/...`.

## Writing a page

Add an `.mdx` file under `content/docs/`, give it a `title` and a `description`, then list it in that folder's `meta.json`.

See `AGENTS.md` and `CLAUDE.md` for the fuller architecture and writing conventions.
