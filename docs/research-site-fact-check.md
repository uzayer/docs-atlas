# Atlas documentation fact-check

Audited 2026-09-21 against the 36-page pre-change `content/docs` tree, Atlas source at commit [`c9f0c0e0`](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e), and current first-party ACP sources. The implementation status below reflects the corrected 28-page working tree.

## Bottom line

The pre-change site had 36 documentation pages. The source-control, organisation, and most theme reference pages were broadly consistent with the current source. The Agents section was not: it described a retired five-agent “built-in” architecture, repeated vendor-owned setup material, and overstated feature uniformity between ACP agents. Two other pages documented features that have been removed from the current app: Research and the standalone Review product.

There is also one product-versus-positioning conflict that cannot be fixed honestly in copy alone:

- The live ACP registry currently contains **41 agents**, including two `uvx`-only agents: `fast-agent` and `minion-code`. The Atlas registry parser supports only `binary` and `npx`, and explicitly drops entries with neither. Atlas therefore exposes at most **39 of the current 41 registry entries**, before platform availability is considered. The statement “Atlas supports all agents in the ACP registry” is false for the audited build. Either add `uvx` support or qualify the claim. Sources: [live ACP registry](https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json), [ACP registry format](https://github.com/agentclientprotocol/registry/blob/main/FORMAT.md), [Atlas registry parser](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-agent-store/src/registry.rs).

## Implemented outcome in this worktree

The first correction pass has already resolved most high-priority documentation drift:

- The six per-agent pages, including the separate Atlas Agent page, were removed. `agents/index.mdx` now consolidates the native Atlas Agent and external ACP-agent model, while `agents/registry.mdx` owns install/manage details. Redirects preserve the removed URLs.
- The replacement copy correctly distinguishes the native agent, installed registry agents, and featured one-click install offers; it qualifies models, modes, authentication, session restoration, images, terminals, and shared memory by advertised capabilities.
- Registry copy now states lazy first-connect downloads, current `uvx` limitations, platform-specific availability, removal/cache semantics, and the checksum badge’s narrow meaning.
- Quickstart, concepts, welcome, memory, chat, settings, organisation, usage metrics, cross-platform file-manager wording, and the 13-of-15 light-theme count were corrected.
- The removed Research and standalone Review product pages were deleted with compatibility redirects, and Mission Control was renamed to the product's current **Usage** name.

The material product finding still open is missing runtime support for `uvx`-only registry entries. The in-progress theme edits were left intact apart from the verified light-variant and platform wording corrections.

## Priority findings

### P0 — replace the Agents information architecture

Atlas no longer ships five external “built-in agents.” Its accepted architecture says that a fresh install has only the native agent; every external agent exists only after the user installs a registry entry (or explicitly accepts a detected binary). The picker separately features a small, changing set of registry agents as one-click install offers; being featured does not make them built in. Sources: [ADR-0002](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/docs/adr/0002-no-default-acp-agents.md), [featured-agent implementation](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src/features/agents/lib/featured-agents.ts), [catalog implementation](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/catalog.rs).

That invalidates the organising premise of:

- `content/docs/agents/index.mdx`
- `content/docs/agents/claude-code.mdx`
- `content/docs/agents/codex.mdx`
- `content/docs/agents/cursor.mdx`
- `content/docs/agents/kilo-code.mdx`
- `content/docs/agents/opencode.mdx`
- the “Pick an agent” section of `content/docs/getting-started/quickstart.mdx`
- the “built-in agent” branch in `content/docs/getting-started/concepts.mdx`

Recommended replacement:

1. Keep one product-owned **Agents** page that explains the native Atlas Agent, ACP registry agents, featured install offers, authentication, negotiated capabilities, and the shared Atlas surfaces.
2. Keep **Discover agents** only if it documents the registry UI; otherwise merge it into Agents.
3. Delete the five vendor pages and redirect their URLs to the Agents page. Registry metadata already owns each agent’s name, version, description, repository, website, icon, and distribution, and registry versions are refreshed automatically. Sources: [ACP registry format](https://github.com/agentclientprotocol/registry/blob/main/FORMAT.md), [registry update policy](https://github.com/agentclientprotocol/registry/blob/main/README.md).
4. Cover Atlas Agent in a dedicated section of the consolidated Agents page because it is the one product-owned, non-ACP runtime.

### P0 — correct registry install and support claims

`content/docs/agents/registry.mdx` contains three material errors:

- It says binary agents download immediately on **Install**. Current Atlas only writes the installed-agent map at that point; the binary is fetched lazily on first connection. Source: [Atlas registry install command](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/registry.rs).
- It says `uvx` agents download on first run, but Atlas has no `uvx` registry variant and drops `uvx`-only entries. Sources: [Atlas registry parser](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-agent-store/src/registry.rs), [ACP registry format](https://github.com/agentclientprotocol/registry/blob/main/FORMAT.md).
- It documents a **Built-in** badge and claims five IDs are built in. The current catalog explicitly never emits the old `builtin` kind. Source: [Atlas catalog implementation](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/catalog.rs).

The **Unverified** explanation is accurate: registry SHA-256 values are optional and Atlas marks binary distributions without one. Sources: [ACP registry format](https://github.com/agentclientprotocol/registry/blob/main/FORMAT.md), [Atlas registry view](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/registry.rs).

### P0 — remove or replace pages for deleted features

`content/docs/context/research.mdx` describes an arXiv/Semantic Scholar search-and-save product that is not registered in the current application. Its Rust commands and React panel were deleted in commit [`c60b6a3a`](https://github.com/pacifio/atlas/commit/c60b6a3af46d048802982b437b3f6a9b47632e52). The current “Research” layout is only a saved arrangement of Knowledge, Agents, and Browser tabs, not the paper-search feature. Source: [current layout template](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src/features/layout/templates.ts).

`content/docs/product/review.mdx` describes a standalone model-review product whose crate, Tauri command, panel, API, and store were deleted in the same commit. The current app can still ask an agent to review changes, but it does not have the documented standalone report product with provider selection, per-file risk cards, saved reports, and architecture diagrams. Sources: [removal commit](https://github.com/pacifio/atlas/commit/c60b6a3af46d048802982b437b3f6a9b47632e52), [current registered Tauri commands](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/lib.rs).

Delete/redirect both pages unless those features are being restored before the docs release. Also remove their incoming links from Knowledge Base, Mission Control/Usage, Chat, Git, and navigation metadata.

### P1 — describe ACP capability differences, not universal parity

The current copy repeatedly says every agent gets the same models, modes, session restoration, images, terminals, and other behavior. ACP deliberately negotiates these features. Text and resource links are baseline; images, audio, embedded context, session loading, filesystem operations, terminal operations, and several other features are capability-gated. Sources: [ACP overview](https://agentclientprotocol.com/protocol/v1/overview), [ACP initialization and capabilities](https://agentclientprotocol.com/protocol/v1/initialization), [ACP session loading](https://agentclientprotocol.com/protocol/v1/session-setup).

The safe product claim is: Atlas can install and run registry-distributed ACP agents, and integrates each capability the agent advertises. Do not promise that all agents expose the same features.

### P1 — remove stale vendor setup instructions

The per-agent pages have already drifted from their owners and from Atlas:

- Claude is now a registry `npx` package around the Claude Agent SDK, not Atlas’s old bespoke “official installer” path. Sources: [live registry record](https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json), [Claude ACP adapter](https://github.com/agentclientprotocol/claude-agent-acp).
- Cursor and Kilo are installable directly from registry distributions, so requiring users to install their CLIs manually is no longer the normal Atlas path. Source: [live registry records](https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json).
- The Codex page says Atlas cannot reconstruct prior conversations and frames screenshots as absent elsewhere in the section. Current `codex-acp` documents images and `session/load` reconstruction. Source: [Codex ACP README](https://github.com/agentclientprotocol/codex-acp/blob/main/README.md).
- The pages pin old behavioral snapshots (Cursor `2026.07.23`, Kilo `7.4.20`, OpenCode `1.3.15`) while the live registry currently reports Cursor `2026.09.18`, Kilo `7.7.5`, and OpenCode `1.18.31`. A historical “verified with” note is not inherently false, but it is not a durable support contract. Source: [live ACP registry](https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json).

Use each registry card’s repository or website for setup and agent-specific behavior instead of copying those instructions into Atlas docs. The registry’s authentication policy also permits different login UX between agents. Sources: [ACP registry authentication](https://github.com/agentclientprotocol/registry/blob/main/AUTHENTICATION.md), [ACP registry format](https://github.com/agentclientprotocol/registry/blob/main/FORMAT.md).

### P1 — “Mission Control” is now Usage and is no longer Claude/Codex-only

`content/docs/context/mission-control.mdx` uses the retired product name **Mission Control**; the current tab, command palette, header, and exports call it **Usage**. It also says the dashboard tracks only Claude Code, Codex, and Review. Current Atlas reads usage from its own checkpoint record and intentionally counts every agent the same way when that agent reports token usage. The page calls the count “requests,” while the implementation explicitly records messages and says Atlas does not know how many provider HTTP requests an agent made. Sources: [Usage UI](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src/features/usage), [Atlas usage implementation](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/usage.rs).

Replace “requests” with the exact UI metric and state the real limitation: only Atlas-run sessions with reported usage are counted; unknown/unpriced models contribute tokens but zero estimated cost.

### P1 — built-in theme light-variant count is obsolete

`content/docs/themes/index.mdx` says only Rosé Pine has a light variant and the other 14 built-ins are dark-only. The current source contains light variants for **13 of 15** built-in themes; only Monokai and Vesper are dark-only. The warning and related guidance in `content/docs/themes/authoring.mdx` need updating. Source: [built-in theme directory](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-theme/themes).

The larger theme model remains accurate: 15 built-ins, 45 required base tokens, eight optional palette hues, and 73 public theme keys. Sources: [theme format implementation](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-theme/src/lib.rs), [generated theme-key reference](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/docs/reference/theme-keys.md).

### P2 — make cross-platform wording explicit

The site uses macOS-only key labels and nouns throughout (`⌘`, `⌥`, Finder, “light Mac”) without saying those instructions are macOS-specific. Atlas officially supports Windows as well. The Kbd component renders the supplied text verbatim; it does not translate shortcuts by platform. Sources: [Atlas supported platforms](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/README.md#download), [docs Kbd component](https://github.com/uzayer/docs-atlas/blob/5efe4adeb8af49f4a58882c0aef6595182b98c0c/src/components/ui/kbd.tsx).

Affected most visibly: `getting-started/power-user`, `getting-started/quickstart`, `product/chat`, `product/explorer`, `product/settings`, `product/terminal`, `themes/index`, `themes/authoring`, and `themes/icon-themes`. Either add a site-wide “shortcuts shown for macOS” note plus Windows equivalents where they differ, or make shortcut rendering platform-aware. Use “file manager” in prose unless the action is genuinely macOS-only.

## Page-by-page audit

This table records the 36-page pre-change audit and, where applicable, the correction now present in the working tree. “No contradiction found” means the page’s material claims matched the cited source during this source review. It is not a substitute for an end-to-end UI test.

| Page | Result | Finding / evidence |
| --- | --- | --- |
| `agents/atlas.mdx` | Resolved: consolidated | Native/non-ACP content now lives on the unified Agents page; the static provider list was removed. [Native agent source](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-native-agent) |
| `agents/claude-code.mdx` | Resolved: removed | Registry agent, not a product-owned built-in; setup and feature details belong to the adapter. [Claude ACP](https://github.com/agentclientprotocol/claude-agent-acp) |
| `agents/codex.mdx` | Resolved: removed | Registry agent; session/image claims had drifted. [Codex ACP](https://github.com/agentclientprotocol/codex-acp/blob/main/README.md) |
| `agents/cursor.mdx` | Resolved: removed | Registry binary already owns installation metadata; version snapshot was stale. [Live registry](https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json) |
| `agents/index.mdx` | Resolved: rewritten | The prior “built-in agents” model contradicted ADR-0002 and current catalog. [ADR-0002](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/docs/adr/0002-no-default-acp-agents.md) |
| `agents/kilo-code.mdx` | Resolved: removed | Registry metadata supports binary and `npx`; version snapshot was stale. [Live registry](https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json) |
| `agents/opencode.mdx` | Resolved: removed | Registry metadata owns install/setup/version; version snapshot was stale. [Live registry](https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json) |
| `agents/registry.mdx` | Resolved: rewritten | The prior binary install timing, `uvx` support, and Built-in badge claims were wrong. [Atlas registry command](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/registry.rs) |
| `context/agent-preferences.mdx` | No contradiction found | Twelve-category extraction and source-span editing are represented in the memory-policy implementation. [Atlas memory policy](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/memory_policy.rs) |
| `context/knowledge-base.mdx` | No contradiction found | Storage, indexing, and note context agree with the knowledge and memory commands. [Atlas knowledge command](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/knowledge.rs) |
| `context/memory.mdx` | No contradiction found | On-device indexing and cross-agent memory match the implementation and ADR. [Shared-memory ADR](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/docs/adr/0010-shared-memory-is-pulled-through-the-tool-server.md) |
| `context/mission-control.mdx` | Resolved: renamed | The page now uses the current **Usage** product name and route. The old URL redirects. [Atlas Usage source](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src/features/usage) |
| `context/research.mdx` | Resolved: removed | The documented paper-search feature and commands were removed from the product; the obsolete page was deleted and redirected. [Removal commit](https://github.com/pacifio/atlas/commit/c60b6a3af46d048802982b437b3f6a9b47632e52) |
| `context/skills.mdx` | No contradiction found | Scope, linking, packs, and skills.sh discovery align with the skills command. [Atlas skills command](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/skills.rs) |
| `getting-started/concepts.mdx` | Resolved: corrected | Removed the retired external “built-in” category and qualified shared-memory behavior. [Atlas catalog](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/catalog.rs) |
| `getting-started/index.mdx` | Resolved: revised | Now links to the unified Agents explanation and avoids identical-capability claims. [ACP capabilities](https://agentclientprotocol.com/protocol/v1/initialization) |
| `getting-started/power-user.mdx` | Resolved: clarified | Added platform scope for the macOS shortcut notation. [Atlas platform support](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/README.md#download) |
| `getting-started/quickstart.mdx` | Resolved: rewritten | External agents are now described as installed registry entries/featured offers. [Featured agents](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src/features/agents/lib/featured-agents.ts) |
| `organisation/accounts.mdx` | No contradiction found | Device flow, local credential handling, and avatar caching agree with the auth implementation. [Atlas auth source](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/auth) |
| `organisation/members.mdx` | No contradiction found | Roles and invite-management claims match the organisation feature source. [Atlas organisation feature](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src/features/organisations) |
| `organisation/organisations.mdx` | No contradiction found | Local/cloud organisation behavior agrees with the organisation source reviewed. [Atlas organisation commands](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands) |
| `product/chat.mdx` | Resolved: qualified | Token usage and resume behavior now depend on what an agent reports/advertises. [ACP capabilities](https://agentclientprotocol.com/protocol/v1/initialization) |
| `product/editor.mdx` | No contradiction found | Reload protection, highlighting, blame, and unified theming agree with editor source. [Atlas editor feature](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src/features/editor) |
| `product/explorer.mdx` | Resolved: revised | Feature set was consistent; Finder-only nouns were made platform-neutral. [Atlas explorer source](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src/features/explorer) |
| `product/review.mdx` | Resolved: removed | The standalone review crate, command, panel, API, and store were removed from the product; the obsolete page was deleted and redirected. [Removal commit](https://github.com/pacifio/atlas/commit/c60b6a3af46d048802982b437b3f6a9b47632e52) |
| `product/settings.mdx` | Resolved: corrected | Sections, API-key scope, and platform-specific shortcut wording now match current source. [Settings navigation](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src/features/settings/components/settings-panel.tsx) |
| `product/terminal.mdx` | Resolved: clarified | zsh-only block integration and continuous-stream fallback are accurate; platform-specific shortcut scope was added. [Atlas terminal source](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-terminal/src/lib.rs) |
| `source-control/capture.mdx` | No contradiction found | Local opt-in capture, health states, imports, and pre-write redaction align with capture source. [Atlas capture command](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src-tauri/src/commands/capture.rs) |
| `source-control/git.mdx` | No contradiction found | Material git and diff claims match the current feature surface. [Atlas git feature](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/src/features/git) |
| `source-control/timeline.mdx` | No contradiction found | Checkpoint matching and non-hook observation agree with the checkpoint implementation. [Atlas checkpoint crate](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-checkpoint) |
| `themes/authoring.mdx` | Resolved: revised | Format is correct; obsolete light-variant and “light Mac” guidance was updated. [Built-in themes](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-theme/themes) |
| `themes/compatibility.mdx` | No contradiction found | Manual shadcn mapping matches the import/reference implementation. [Theme import reference](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/docs/reference/theme-import.md) |
| `themes/icon-themes.mdx` | Resolved: clarified | Format subset, Material version, Open VSX source, and sanitizer constraints match the implementation; path/shortcut platform scope was added. [Icon-theme crate](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-icon-theme) |
| `themes/importing.mdx` | No contradiction found | Supported import/export formats and lossy-conversion descriptions match the reference implementation. [Theme import source](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-theme/src/import) |
| `themes/index.mdx` | Resolved: corrected | The prior “only Rosé Pine has light” statement was false; the page now says 13 of 15 built-ins do. [Built-in themes](https://github.com/pacifio/atlas/tree/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/crates/atlas-theme/themes) |
| `themes/tokens.mdx` | No contradiction found | The 45/8/73 model and fallback rules agree with generated source. [Theme-key reference](https://github.com/pacifio/atlas/blob/c9f0c0e0eabbacd22aa8b9cfbe51831d5b08455e/docs/reference/theme-keys.md) |

## Proposed Agents page outline

This is intentionally product-level and avoids copying vendor docs:

1. **Choose an agent** — Atlas Agent is native; every external agent comes from the ACP registry.
2. **Featured agents** — explain that featured cards are shortcuts into the same registry install flow, not a separate support tier.
3. **Discover and install** — search live registry metadata; show platform availability, distribution type, checksum warning, and install state.
4. **Authenticate** — Atlas presents the auth methods the agent advertises; exact steps belong to the agent.
5. **Capabilities vary** — show capability-derived UI for images, session loading, terminals, models, modes, and commands.
6. **What Atlas adds** — project context, Atlas’s session record, checkpoints, and shared-memory integration, stated with any real capability/reporting limitations.
7. **Remove an agent** — uninstall the runnable agent/cache while keeping Atlas’s historical sessions and metadata.
8. **Atlas Agent** — keep native-agent account, model, and runtime behavior as a section on this consolidated page.

Avoid a prose list of registry agents, counts, versions, or install commands. Link to the live registry and render current metadata in-product. The registry is specifically designed to be the machine-readable authority for that information. Sources: [ACP registry page](https://agentclientprotocol.com/get-started/registry), [ACP registry format](https://github.com/agentclientprotocol/registry/blob/main/FORMAT.md).

## Verification limits

This was a source-and-spec audit, not a manual click-through of all 36 pages against a release binary. “No contradiction found” pages should still receive a smoke pass for labels, empty states, and platform-specific UI before publication. The volatile surfaces most worth automating are the registry distribution variants, featured-agent IDs, provider catalog, theme counts/variants, settings section labels, and shortcut rendering.
