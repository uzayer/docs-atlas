'use client';

import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page';
import { buttonVariants } from '@tryatlas/design';

/**
 * A page's actions: copy its markdown, and the view options. A client module
 * because the package's `buttonVariants` lives in one, and a server
 * component can only render it, not call it.
 */
export function PageActions({ markdownUrl, githubUrl }: { markdownUrl: string; githubUrl: string }) {
  return (
    <>
      <MarkdownCopyButton
        markdownUrl={markdownUrl}
        className={buttonVariants({ variant: 'secondary', size: 'sm' })}
      />
      <ViewOptionsPopover
        className={buttonVariants({ variant: 'secondary', size: 'sm' })}
        markdownUrl={markdownUrl}
        githubUrl={githubUrl}
      />
    </>
  );
}
