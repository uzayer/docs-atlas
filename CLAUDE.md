# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this repo is

The public documentation site for **Atlas**, the desktop app whose source lives in the GitHub repo `pacifio/atlas`. This repo contains no product code, only docs content and the Fumadocs site that renders it.

Atlas is positioned as **source control for coding agents**: agents run against your codebase, every commit becomes a checkpoint linked back to the session that produced it, and the timeline is the per-project record of both.

## Commands

Bun is the runtime and the package manager (`bun.lock` is the lockfile). Do not use npm, pnpm, or yarn.

```bash
bun install
bun dev              # next dev, http://localhost:3000
bun run build        # next build
bun start            # serve the production build
bun run types:check  # next typegen && tsc --noEmit
bun run lint         # oxlint
bun run test         # the design-system ratchet (bun test)
bun run sync:standards  # re-copy standards' stylesheets from ../standards
```

`types:check`, `lint` and `test` are the full verification pass. `types:check` must run `next typegen` first because route types under `.next/types` are generated. The only test is `tests/design-system-ratchet.test.ts`, standards' ratchet held over `src/`: no colour literals, raised shadows, `dark:` variants, stock Tailwind palettes or arbitrary sizes in components. Escape a line with `ratchet-allow: <reason>` only when the token layer genuinely cannot express it.

Content changes are validated by the build, not the linter: MDX frontmatter is checked against `pageSchema` when `bun run build` (or `bun dev`) compiles the collection.

## Architecture

Next.js 16 App Router + Fumadocs. Source lives under `src/`, content under `content/`, and the `@/*` path alias maps to `./src/*`.

**`src/lib/source.ts` is the hub.** It declares the MDX collection with `defineDocs({ dir: 'content/docs' })` and wraps it in Fumadocs' `loader()`. Every route reads from the exported `source`. It also owns icon resolution: a page's frontmatter `icon` is looked up first in the local agent icon map (`ClaudeCode`, `Codex`, `Cursor`, `KiloCode`, `OpenCode`, `Atlas`, from `src/lib/agent-icons.tsx`), then falls back to a `lucide-react` name. An unknown icon string silently renders nothing.

**`src/lib/shared.ts` holds the constants that wire routes together.** `docsRoute`, `docsImageRoute`, and `docsContentRoute` are consumed by `proxy.ts`, the OG route, and the markdown route alike. Change a URL prefix there, not in the routes.

**The site serves each page in three representations**, all generated from the same `source`:

- HTML at `/docs/[[...slug]]`
- Markdown at `/llms.mdx/docs/[[...slug]]/content.md`, plus `/llms.txt` and `/llms-full.txt`
- An OG image at `/og/docs/[...slug]/image.png`

`proxy.ts` (Next.js proxy, the file formerly called middleware) rewrites `/docs/...` to the markdown representation when the request either ends in `.md` or sends an `Accept` header preferring markdown, and sets `Vary: Accept`. So a `/docs/*` URL is content-negotiated, not one fixed response.

**Search** is Fumadocs' built-in static index at `src/app/api/search/route.ts`, derived from `source` with no external service.

**Layout chrome** (nav brand, GitHub URL, social links) lives once in `src/lib/layout.shared.tsx` and is spread into the docs layout. There is no home page: `/` redirects to `/docs/getting-started` in `next.config.mjs`.

## Design system

The site wears **Atlas Standards** (`../standards`), the design system for Atlas products. Fumadocs keeps the behaviour; standards decides the look.

- `src/styles/{tokens,themes,globals,utilities}.css` are **verbatim copies** of standards' `src/styles/`, with the source commit in each header. Never edit them here: change standards, commit there, then `bun run sync:standards` (it refuses uncommitted styles, so the stamp always names a real commit).
- `src/styles/docs.css` is the only bridge. It maps every Fumadocs `--color-fd-*` onto a standards role, sets the reading scale (prose at 15px via `--tw-prose-size`, against standards' 12px app body) and draws the frame. `src/styles/mdx.css` holds the content components' CSS.
- Theme is written to **both** `class` and `data-theme` on `<html>` (`RootProvider` in `src/app/layout.tsx`): standards keys off `data-theme`, Fumadocs' Shiki and `dark:` off `.dark`.
- The shell is Fumadocs' `DocsLayout` with standards components in its **slots** (`src/components/shell/`): `DocsFrame` (container; owns the full-bleed grid template, with the text column and TOC centred together in the page panel), `DocsHeader` (the brand bar below md, the sticky top bar with breadcrumb and page actions from md; a page fills the actions with `<TopBarActions>`), `DocsSidebar` (built from `fumadocs-ui/components/sidebar/base` parts, so tree, collapse, drawer and auto-scroll stay Fumadocs'), and `PageFooter`. Restyle through a slot before reaching for `@fumadocs/cli` to eject.
- `src/components/ui/` holds standards primitives (button, icon, icon-button, popover, tooltip, kbd, scroll-fade), copied with `cn` from `@/lib/cn`. Use them rather than Fumadocs' own `buttonVariants`.
- The window stays the scroll container (unlike the app shell's fixed panels) so anchors, TOC scroll-spy and find-in-page work.

## Content

`content/docs/` is the published tree. `title` is the only required frontmatter field, but write a `description` on every page too: it renders as the page subtitle and feeds the OG image. `icon` is optional.

`content/private/roadmap.mdx` is deliberately outside `content/docs/`, so it is tracked in git but never built or served. It is the one place unshipped work is written down. Keep it out of `content/docs/`.

**Sidebar order is driven by `meta.json`, and `pages` is an allowlist.** Fumadocs sorts a folder alphabetically by default, but once a `meta.json` defines `pages`, only the listed items render. A page you add and forget to list simply will not appear.

The root `content/docs/meta.json` uses the full syntax: `---Section Name---` inserts a separator label, `...folder` splices in that folder's own ordered pages, and `source-control/timeline` is referenced by full path because that folder has no `meta.json`. `[Discord](https://...)` adds an external link (see `community/meta.json`). Two escape hatches this repo does not use yet: a bare `...` appends everything not explicitly listed, and `!name` excludes an item.

Available MDX components come from `src/components/mdx.tsx`: Fumadocs' default set with the standards-styled overrides layered on top. Internal links are written as absolute site paths such as `/docs/getting-started/concepts#session`; `createRelativeLink` also allows relative file paths.

## Writing conventions

These are house rules for docs prose, and they have been corrected before:

- **No em dashes.** Use a period, colon, comma, parentheses, or a conjunction.
- **No walls of text.** Most paragraphs are one or two sentences.
- **Domain terms stay lowercase in prose**: checkpoint, session, timeline, project. Capitalize only in a heading or a link whose text mirrors one.
- **Every page describes what Atlas does today.** Unshipped work belongs in `content/private/roadmap.mdx` and nowhere else.
- **Strategy stays out of the docs.** No competitor names, no positioning arguments, no funding or roadmap framing.

Verify product claims against the actual Atlas app source at `~/Developer/atlas` (Tauri: `src-tauri/` and `crates/` are Rust, `src/features/*` is the frontend). Do not trust that repo's `ARCHITECTURE.md`, it is stale.

## Agent skills

### Issue tracker

Issues are tracked in the Atlas Linear workspace through the `linear-atlas` MCP. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default five-label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context domain-doc layout. See `docs/agents/domain.md`.
