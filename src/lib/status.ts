import type { LoaderPlugin } from 'fumadocs-core/source';

/**
 * Whether what a page describes is in Atlas today.
 *
 * Set in frontmatter as `status:`. Leaving it out means `shipped`, so only
 * the exceptions are written down. Every surface that shows status reads it
 * from here: the badge beside the title, the callout above the body, the
 * sidebar row, the markdown representation and the roadmap page.
 *
 * Kept free of JSX and server-only imports: the sidebar (a client
 * component) and the MDX schema (evaluated at build time) both import it.
 */

export const PAGE_STATUSES = ['shipped', 'in-progress', 'roadmapped'] as const;

export type PageStatus = (typeof PAGE_STATUSES)[number];

export const STATUS_LABEL: Record<PageStatus, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  roadmapped: 'Roadmapped',
};

/** One sentence for the top of a page, and for its markdown twin. */
export const STATUS_NOTICE: Record<Exclude<PageStatus, 'shipped'>, string> = {
  'in-progress': 'In progress: being built, and not in a release yet.',
  roadmapped: 'Roadmapped: not in Atlas yet.',
};

export const ROADMAP_URL = '/docs/community/roadmap';

export function isPageStatus(value: unknown): value is PageStatus {
  return typeof value === 'string' && (PAGE_STATUSES as readonly string[]).includes(value);
}

/** Shipped is the default and carries no mark; the other two are flagged. */
export function isUnshipped(status: unknown): status is Exclude<PageStatus, 'shipped'> {
  return isPageStatus(status) && status !== 'shipped';
}

/** A page-tree item, as the sidebar receives it, with the page's status. */
export type StatusTreeItem = { status?: PageStatus };

/**
 * Copies a page's frontmatter `status` onto its page-tree item, so the
 * sidebar can mark the row. Unlike Fumadocs' `statusBadgesPlugin`, it leaves
 * `name` alone: the breadcrumb, the page footer and search all print the
 * name, and a badge baked into it would follow the title everywhere.
 */
export function statusPlugin(): LoaderPlugin {
  return {
    name: 'atlas:page-status',
    transformPageTree: {
      file(node, filePath) {
        if (!filePath) return node;
        const file = this.storage.read(filePath);
        if (file?.format !== 'page') return node;
        const status = (file.data as { status?: unknown }).status;
        if (isPageStatus(status)) Object.assign(node, { status } satisfies StatusTreeItem);
        return node;
      },
    },
  };
}
