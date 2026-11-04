'use client';

import { SearchIcon } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Icon, Kbd, KbdGroup, iconButtonVariants } from '@tryatlas/design';
import { cn } from '@/lib/cn';

/**
 * Opens Fumadocs' search dialog. Desktop's sidebar search well: a recessed
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
        className={cn(iconButtonVariants({ variant: 'ghost', size: 'sm' }), className)}
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
        'flex h-control-lg w-full items-center gap-2 rounded-xl border border-border bg-panel ps-2.5 pe-1.5 text-sm text-disabled',
        'duration-fast transition-colors ease-out-strong hover:border-border-strong hover:text-muted-foreground',
        className,
      )}
    >
      <Icon icon={SearchIcon} size="sm" />
      <span className="flex-1 truncate text-start">Search docs…</span>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </button>
  );
}
