'use client';

import { useMemo } from 'react';
import Link from 'fumadocs-core/link';
import { usePathname } from 'fumadocs-core/framework';
import { useFooterItems } from 'fumadocs-ui/utils/use-footer-items';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';

/**
 * Previous and next, as two raised blocks: `bg-card` with a ring, never a
 * shadow. The direction is a `micro` label; the page's own title carries it.
 */
export function PageFooter({ className, ...props }: React.ComponentProps<'nav'>) {
  // The tree also holds outbound links (Community → Discord, X, Facebook);
  // "next page" only ever means another page of these docs.
  const all = useFooterItems();
  const items = useMemo(() => all.filter((item) => !item.external && item.url.startsWith('/')), [all]);
  const pathname = usePathname();

  const { previous, next } = useMemo(() => {
    const normalise = (url: string) => url.replace(/\/$/, '');
    const index = items.findIndex((item) => normalise(item.url) === normalise(pathname));
    if (index === -1) return {};
    return { previous: items[index - 1], next: items[index + 1] };
  }, [items, pathname]);

  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn('mt-10 grid gap-2 border-t border-dashed border-border pt-6 sm:grid-cols-2', className)}
      {...props}
    >
      {previous ? <FooterLink item={previous} direction="previous" /> : <span className="max-sm:hidden" />}
      {next && <FooterLink item={next} direction="next" />}
    </nav>
  );
}

function FooterLink({
  item,
  direction,
}: {
  item: { url: string; name: React.ReactNode };
  direction: 'previous' | 'next';
}) {
  const isNext = direction === 'next';
  return (
    <Link
      href={item.url}
      className={cn(
        'group flex flex-col gap-1.5 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10',
        'duration-fast transition-colors ease-out-strong hover:bg-element-hover',
        isNext && 'items-end text-end',
      )}
    >
      <span className={cn('micro inline-flex items-center gap-1', isNext && 'flex-row-reverse')}>
        <Icon
          icon={isNext ? ChevronRightIcon : ChevronLeftIcon}
          size="xs"
          className={cn(
            'duration-base transition-transform ease-out-strong',
            isNext ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5',
          )}
        />
        {isNext ? 'Next' : 'Previous'}
      </span>
      <span className="text-sm font-medium text-foreground">{item.name}</span>
    </Link>
  );
}
