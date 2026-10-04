'use client';

import { Fragment, useMemo } from 'react';
import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { useTreeContext, useTreePath } from 'fumadocs-ui/contexts/tree';
import { cn } from '@/lib/cn';

/**
 * Where you are: section › folders › page.
 *
 * Fumadocs' own breadcrumb walks folders only. This site's sections are
 * `---Section---` separators in meta.json, not folders, so its breadcrumb
 * shows a bare page title. This one finds the separator that the page's
 * top-level ancestor sits under, and leads with it.
 */
export function DocsBreadcrumb({ className }: { className?: string }) {
  const { root } = useTreeContext();
  const path = useTreePath();

  const crumbs = useMemo(() => {
    if (path.length === 0) return [];
    const section = sectionOf(root.children, path[0]);
    const all = [
      ...(section ? [{ name: section, url: undefined as string | undefined }] : []),
      ...path.map((node) => ({
        name: node.name,
        url: node.type === 'folder' ? node.index?.url : node.type === 'page' ? node.url : undefined,
      })),
    ];
    // A content folder is usually titled after the separator it sits under
    // (context/ is "Context" under ---Context---); say it once.
    return all.filter((crumb, i) => i === 0 || crumb.name !== all[i - 1].name);
  }, [root, path]);

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex min-w-0 items-center gap-1.5 text-xs', className)}>
      {crumbs.map((crumb, i) => {
        const last = i === crumbs.length - 1;
        return (
          <Fragment key={i}>
            {i > 0 && (
              <span aria-hidden="true" className="text-disabled">
                /
              </span>
            )}
            {crumb.url && !last ? (
              <Link
                href={crumb.url}
                className="truncate text-muted-foreground duration-fast transition-colors ease-out-strong hover:text-foreground"
              >
                {crumb.name}
              </Link>
            ) : (
              <span
                aria-current={last ? 'page' : undefined}
                className={cn('truncate', last ? 'font-medium text-foreground' : 'text-muted-foreground')}
              >
                {crumb.name}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

/** The name of the last separator before `node` among the root's children. */
function sectionOf(children: PageTree.Node[], node: PageTree.Node): PageTree.Node['name'] | undefined {
  let section: PageTree.Node['name'] | undefined;
  for (const child of children) {
    if (child.type === 'separator') section = child.name;
    if (child === node || child.$id === node.$id) return section;
  }
  return undefined;
}
