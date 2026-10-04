'use client';

import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

/**
 * What a reader sees at a URL that is not a page: what happened, and the two
 * ways forward, the start of the docs and search. Search first, because a
 * reader who followed a stale link usually knows what they were after.
 */
export function NotFoundContent({ className }: { className?: string }) {
  const { enabled, setOpenSearch } = useSearchContext();

  return (
    <div className={cn('flex flex-col items-start gap-3', className)}>
      <span className="micro">404</span>
      <h1 className="type-title">Page not found</h1>
      <p className="text-md text-muted-foreground">
        This page may have moved, or the link may be mistyped.
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        {enabled && (
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            className={buttonVariants({ variant: 'default', size: 'lg' })}
          >
            <Icon icon={SearchIcon} size="sm" />
            Search the docs
          </button>
        )}
        <Link
          href="/docs/getting-started"
          className={buttonVariants({ variant: enabled ? 'secondary' : 'default', size: 'lg' })}
        >
          Go to Getting Started
        </Link>
      </div>
    </div>
  );
}
