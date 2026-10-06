'use client';

import { createContext, use, useState } from 'react';
import { createPortal } from 'react-dom';
import { PanelLeftIcon } from 'lucide-react';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { Container } from 'fumadocs-ui/layouts/docs/slots/container';
import { SidebarCollapseTrigger, SidebarTrigger } from 'fumadocs-ui/components/sidebar/base';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { SearchButton } from './search-button';
import { DocsBreadcrumb } from './docs-breadcrumb';

/**
 * The layout grid, full bleed: the rail pinned to the left edge and the page
 * panel running to the right one, so a wide screen has no dead canvas on
 * either side.
 *
 *   ┌ canvas ──────────────────────────────────────────────────────────┐
 *   │ rail │ ┌ panel ─────────────────────────────────────────────────┐ │
 *   │      │ │ Section › Page                       Copy · Open      │ │  top bar
 *   │      │ │            ┌ text ─────────────┐ ┌ toc ─┐            │ │
 *   │      │ │   1fr      │  48rem            │ │ 15rem│    1fr     │ │
 *   │      │ └────────────┴───────────────────┴─┴──────┴────────────┘ │
 *   └──────────────────────────────────────────────────────────────────┘
 *
 * The text and its TOC are one group centerd in the panel, rather than the
 * text centerd and the TOC pushed to the far edge.
 *
 * Fumadocs places the header, rail, page and TOC as siblings in named grid
 * areas, so nothing wraps "the page" to give it a background. The panel is
 * its own grid item instead, first in the DOM so everything paints over it.
 *
 * The window stays the scroll container, unlike the app shell's fixed
 * panels: anchor links, the TOC's scroll-spy and the browser's find all
 * depend on it, and a docs page is a document before it is an app.
 */

const GRID_TEMPLATE = `"sidebar header header header header"
"sidebar toc-popover toc-popover toc-popover toc-popover"
"sidebar . main toc ." 1fr / var(--fd-sidebar-col) minmax(0, 1fr) minmax(0, var(--docs-content-width)) var(--fd-toc-width) minmax(0, 1fr)`;

/** Where a page puts its actions: a slot in the top bar, filled by portal. */
const ActionsSlot = createContext<{
  slot: HTMLElement | null;
  setSlot: (node: HTMLElement | null) => void;
} | null>(null);

export function DocsFrame({ children, className, style, ...props }: React.ComponentProps<'div'>) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  return (
    <ActionsSlot value={{ slot, setSlot }}>
      <Container
        className={cn('bg-shell-canvas', className)}
        style={{ gridTemplate: GRID_TEMPLATE, ...style }}
        {...props}
      >
        <div
          aria-hidden="true"
          data-docs-panel=""
          className="pointer-events-none mx-2 mb-2 rounded-xl border border-shell-edge bg-background [grid-column:2/6] [grid-row:2/4] md:ms-0 md:mt-2 md:[grid-row:1/4] md:in-data-[sidebar-collapsed=true]:ms-2"
        />
        {children}
      </Container>
    </ActionsSlot>
  );
}

/** Renders a page's actions into the top bar. Below md they stay in the page. */
export function TopBarActions({ children }: { children: React.ReactNode }) {
  const context = use(ActionsSlot);
  if (!context?.slot) return null;
  return createPortal(children, context.slot);
}

/**
 * Below md: the brand, search and the drawer trigger, on the canvas.
 * From md: the panel's top bar, with where you are on the left and what the
 * page can do on the right. It is sticky, and it carries the panel's top
 * edge with it (a canvas strip above a rounded, ruled top), so the page
 * still reads as a sheet set into the frame once you scroll.
 */
export function DocsHeader(props: React.ComponentProps<'header'>) {
  const { slots } = useDocsLayout();
  const { collapsed } = slots.sidebar.useSidebar();
  const context = use(ActionsSlot);

  return (
    <header
      id="nd-subnav"
      {...props}
      className={cn(
        'sticky top-(--fd-docs-row-1) z-titlebar [grid-area:header]',
        'layout:[--fd-header-height:--spacing(12)] md:layout:[--fd-header-height:--spacing(14)]',
        'h-(--fd-header-height) bg-shell-canvas md:pt-2 md:pe-2 md:in-data-[sidebar-collapsed=true]:ps-2',
        props.className,
      )}
    >
      {/* Below md */}
      <div className="flex h-full items-center gap-1 ps-4 pe-2 md:hidden">
        {slots.navTitle && (
          <slots.navTitle className="me-auto inline-flex items-center gap-2 text-sm font-medium" />
        )}
        <SearchButton iconOnly />
        <SidebarTrigger className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}>
          <Icon icon={PanelLeftIcon} size="sm" />
        </SidebarTrigger>
      </div>

      {/* From md */}
      <div className="h-full rounded-t-xl border border-shell-edge border-b-hairline bg-background ps-4 pe-3 max-md:hidden">
        <div className="flex h-full min-w-0 items-center gap-2">
          {collapsed && (
            <div className="-ms-1 flex items-center gap-0.5">
              <SidebarCollapseTrigger className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}>
                <Icon icon={PanelLeftIcon} size="sm" />
              </SidebarCollapseTrigger>
              <SearchButton iconOnly />
              <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-hairline" />
            </div>
          )}
          <DocsBreadcrumb className="flex-1" />
          <div ref={context?.setSlot} className="flex shrink-0 items-center gap-1.5" />
        </div>
      </div>
    </header>
  );
}
