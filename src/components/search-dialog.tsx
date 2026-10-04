'use client';

import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { fetchClient } from 'fumadocs-core/search/client/fetch';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import type { SearchLink, SharedProps, TagItem } from 'fumadocs-ui/contexts/search';
import {
  SearchDialog as SearchRoot,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  TagsList,
  TagsListItem,
  useSearch,
} from 'fumadocs-ui/components/dialog/search';
import type { SearchItemType } from 'fumadocs-ui/components/dialog/search';
import { cn } from '@/lib/cn';

/**
 * Fumadocs' default search dialog, rebuilt from its composable parts in
 * standards' dialog chrome: a scrim, a popover-step panel with a ring and
 * the dialog shadow (`shadow-lg`, the only elevation a dialog may cast), the
 * `z-modal` layer, hairline dividers, an input at the reading size and an
 * Esc keycap instead of an outlined button.
 *
 * Search behaviour (the fetch client, the debounce, keyboard navigation,
 * result rendering) is Fumadocs', untouched. Props match
 * DefaultSearchDialogProps, minus the deprecated `type: 'static'`, so it
 * drops into RootProvider's `search.SearchDialog`.
 */

export interface SearchDialogProps extends SharedProps {
  links?: SearchLink[];
  defaultTag?: string;
  tags?: TagItem[];
  /** Search API URL. Defaults to Fumadocs' `/api/search`. */
  api?: string;
  delayMs?: number;
  footer?: ReactNode;
  allowClear?: boolean;
}

export default function SearchDialog({
  defaultTag,
  tags = [],
  api,
  delayMs,
  allowClear = false,
  links = [],
  footer,
  ...props
}: SearchDialogProps) {
  const { locale } = useI18n();
  const [tag, setTag] = useState(defaultTag);
  const { search, setSearch, query } = useDocsSearch({
    client: fetchClient({ api, locale, tag }),
    delayMs,
  });

  const defaultItems = useMemo<SearchItemType[] | null>(() => {
    if (links.length === 0) return null;
    return links.map(([name, url]) => ({ type: 'page', id: name, content: name, url }));
  }, [links]);

  useOnChange(defaultTag, (value) => setTag(value));

  return (
    <SearchRoot search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <Dialog.Portal>
        <Dialog.Backdrop
          data-slot="search-overlay"
          className="fixed inset-0 z-overlay scrim data-closed:animate-fade-out data-open:animate-fade-in"
        />
        <SearchPanel>
          <SearchDialogHeader className="gap-2.5 px-4 py-3">
            <SearchDialogIcon className="size-4" />
            <SearchDialogInput className="text-sm placeholder:text-muted-foreground" />
            <EscKey />
          </SearchDialogHeader>
          <SearchDialogList items={query.data !== 'empty' ? query.data : defaultItems} />
          {tags.length > 0 || footer ? (
            <SearchDialogFooter className="bg-transparent">
              {tags.length > 0 ? (
                <TagsList tag={tag} onTagChange={setTag} allowClear={allowClear}>
                  {tags.map((item) => (
                    <TagsListItem key={item.value} value={item.value}>
                      {item.name}
                    </TagsListItem>
                  ))}
                </TagsList>
              ) : null}
              {footer}
            </SearchDialogFooter>
          ) : null}
        </SearchPanel>
      </Dialog.Portal>
    </SearchRoot>
  );
}

/**
 * The panel. Mirrors Fumadocs' SearchDialogContent (its id is how the result
 * list finds the panel to listen for arrow keys, and focus goes to the input
 * on open) with standards' dialog classes in place of Fumadocs'.
 */
function SearchPanel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Dialog.Popup
      id="fd-search-dialog-content"
      ref={ref}
      aria-describedby={undefined}
      initialFocus={(interaction) => {
        const input = ref.current?.querySelector<HTMLInputElement>('input[data-fd-search-dialog-input]');
        if (interaction === 'touch') {
          input?.focus({ preventScroll: true });
          return false;
        }
        return input ?? true;
      }}
      data-slot="search-dialog"
      className={cn(
        'fixed inset-x-2 top-4 z-modal mx-auto max-w-xl overflow-hidden md:top-24',
        'rounded-xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/10 outline-none',
        'data-closed:animate-scale-out data-open:animate-scale-in',
        // Hairlines between header, list and footer; none under an empty list.
        '*:border-b *:border-hairline *:last:border-b-0 *:data-[empty=true]:border-b-0',
        '*:has-[+:last-child[data-empty=true]]:border-b-0',
      )}
    >
      <Dialog.Title className="sr-only">Search</Dialog.Title>
      {children}
    </Dialog.Popup>
  );
}

/** Close, drawn as standards' keycap so it reads as the shortcut it is. */
function EscKey() {
  const { onOpenChange } = useSearch();
  return (
    <button
      type="button"
      aria-label="Close search"
      onClick={() => onOpenChange(false)}
      className={cn(
        'inline-flex h-control-xs min-w-control-xs cursor-pointer items-center justify-center',
        'rounded-sm border border-border bg-card px-1.5 text-2xs font-medium text-muted-foreground',
        'duration-fast transition-colors ease-out-strong hover:text-foreground',
      )}
    >
      Esc
    </button>
  );
}
