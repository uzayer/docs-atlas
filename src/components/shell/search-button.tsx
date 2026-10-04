'use client';

import { SearchIcon } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

/**
 * Opens Fumadocs' search dialog. Standards' sidebar search well: a recessed
 * field at the panel's radius that opens a dialog rather than filtering in
 * place. Unlike the app, the shortcut is printed: a docs reader arrives cold
 * and has not learned ⌘K yet.
 */
export function SearchButton({ iconOnly = false, className }: { iconOnly?: boolean; className?: string }) {
  const { enabled, setOpenSearch } = useSearchContext();
  if (!enabled) return null;

  if (iconOnly) {
    return (
      <button
        type="button"
        aria-label="Search docs"
        aria-keyshortcuts="Meta+K"
        onClick={() => setOpenSearch(true)}
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), className)}
      >
        <Icon icon={SearchIcon} size="sm" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Search docs"
      aria-keyshortcuts="Meta+K"
      onClick={() => setOpenSearch(true)}
      className={cn(
        'flex h-control-lg w-full items-center gap-2 rounded-xl border border-border bg-surface ps-2.5 pe-1.5 text-xs text-disabled',
        'duration-fast transition-colors ease-out-strong hover:border-border-strong hover:text-muted-foreground',
        className,
      )}
    >
      <Icon icon={SearchIcon} size="xs" />
      <span className="flex-1 truncate text-start">Search docs…</span>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </button>
  );
}
