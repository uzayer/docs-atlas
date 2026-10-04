'use client';

import { useRef } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import { PanelLeftIcon } from 'lucide-react';
import {
  SidebarCollapseTrigger,
  SidebarContent,
  SidebarDrawerContent,
  SidebarDrawerOverlay,
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
  useFolderDepth,
} from 'fumadocs-ui/components/sidebar/base';
import { createPageTreeRenderer } from 'fumadocs-ui/components/sidebar/page-tree';
import { createLinkItemRenderer } from 'fumadocs-ui/components/sidebar/link-item';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import type { SidebarProps } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { cn } from '@/lib/cn';
import { SPRING_PILL } from '@/lib/motion';
import { buttonVariants } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ScrollFade } from '@/components/ui/scroll-fade';
import { SearchButton } from './search-button';
import { SidebarControls } from './sidebar-controls';

/**
 * The docs rail, drawn as the Atlas app shell draws its sidebar.
 *
 * Fumadocs still owns everything that is behaviour: the page tree, which row
 * is active, folders opening for the active page, collapsing on desktop with
 * a hover peek, the drawer below md, scrolling the active row into view. This
 * file only decides what those parts look like, through the `sidebar` slot.
 *
 *   ┌ canvas ──────────────┐
 *   │ ◆ Atlas          ⊟  │  the brand row sits on the canvas, above
 *   │ ┌─ panel ─────────┐ │  the curved panel the navigation lives in
 *   │ │ ⌕ Search docs ⌘K│ │
 *   │ │ Getting Started │ │
 *   │ │ ▌Overview       │ │  one active pill that slides between rows
 *   │ │ ├ Concepts      │ │  children hang off a rail with L-connectors
 *   │ │ ─────────────── │ │
 *   │ │ ⊕ 𝕏 ◐ T        │ │
 *   │ └─────────────────┘ │
 *   └──────────────────────┘
 */

/** The shared id the active pill animates between, as standards' rail does. */
const PILL_ID = 'docs-rail-pill';

function Item({ className, children, ...props }: React.ComponentProps<typeof SidebarItem>) {
  const depth = useFolderDepth();
  return (
    <SidebarItem
      className={cn(rowClass, depth > 0 && 'docs-rail-child', className)}
      {...props}
    >
      {props.active && <Pill />}
      <span className="relative min-w-0 flex-1">{children}</span>
    </SidebarItem>
  );
}

function FolderLink({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SidebarFolderLink>) {
  const depth = useFolderDepth();
  return (
    <SidebarFolderLink
      className={cn(rowClass, 'w-full', depth > 1 && 'docs-rail-child', className)}
      {...props}
    >
      {props.active && <Pill />}
      <span className="relative min-w-0 flex-1">{children}</span>
    </SidebarFolderLink>
  );
}

function FolderTrigger({
  className,
  ...props
}: React.ComponentProps<typeof SidebarFolderTrigger>) {
  return (
    <SidebarFolderTrigger
      className={(state) =>
        cn(rowClass, 'w-full', typeof className === 'function' ? className(state) : className)
      }
      {...props}
    />
  );
}

/** Children drop in on a hairline; each row's connector is drawn in docs.css. */
function FolderContent({
  className,
  ...props
}: React.ComponentProps<typeof SidebarFolderContent>) {
  return (
    <SidebarFolderContent
      className={(state) =>
        cn(
          'docs-rail relative ms-3.5 flex flex-col gap-px ps-3 pt-px',
          typeof className === 'function' ? className(state) : className,
        )
      }
      {...props}
    />
  );
}

/** A `---Section---` in meta.json: a labelled group, with air above it. */
function Separator({ className, ...props }: React.ComponentProps<typeof SidebarSeparator>) {
  return (
    <SidebarSeparator
      className={cn(
        'mt-6 mb-1.5 flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground first:mt-0 [&_svg]:size-3.5',
        className,
      )}
      {...props}
    />
  );
}

function Pill() {
  return (
    <motion.span
      aria-hidden="true"
      layoutId={PILL_ID}
      transition={SPRING_PILL}
      className="absolute inset-0 -z-10 rounded-md bg-sidebar-accent"
    />
  );
}

/**
 * One row, at 14px and 32px tall rather than the app rail's 11px and 28px:
 * these are page titles a reader scans, not destinations they already know.
 */
const rowClass = cn(
  'relative isolate flex min-h-8 items-center gap-2 rounded-md px-2 py-1 text-start text-sm text-muted-foreground wrap-anywhere',
  'duration-fast transition-colors ease-out-strong',
  'hover:bg-element-hover hover:text-foreground',
  'data-[active=true]:font-medium data-[active=true]:text-foreground data-[active=true]:hover:bg-transparent',
  '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg[data-icon]]:size-3.5 [&_svg[data-icon]]:text-muted-foreground',
);

const internal = {
  SidebarFolder,
  SidebarFolderContent: FolderContent,
  SidebarFolderLink: FolderLink,
  SidebarFolderTrigger: FolderTrigger,
  SidebarItem: Item,
};
const PageTree = createPageTreeRenderer({ ...internal, SidebarSeparator: Separator });
const LinkItem = createLinkItemRenderer(internal);

/** Everything inside the panel. Shared by the desktop rail and the drawer. */
function PanelBody({ components }: Pick<SidebarProps, 'components'>) {
  const { menuItems } = useDocsLayout();
  const links = menuItems.filter((item) => item.type !== 'icon');

  return (
    <>
      <div className="px-2 pb-2">
        <SearchButton />
      </div>
      <ScrollFade fade={24} className="min-h-0 flex-1 px-2 pt-1 pb-4">
        <LayoutGroup id="docs-rail">
          {links.length > 0 && (
            <div className="mb-4 flex flex-col gap-px">
              {links.map((item, i) => (
                <LinkItem key={i} item={item} />
              ))}
            </div>
          )}
          <div className="flex flex-col gap-px">
            <PageTree {...components} />
          </div>
        </LayoutGroup>
      </ScrollFade>
      <SidebarControls />
    </>
  );
}

const panelClass =
  'flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-shell-edge bg-background pt-2';

function Brand({ className }: { className?: string }) {
  const { slots } = useDocsLayout();
  if (!slots.navTitle) return null;
  return <slots.navTitle className={cn('inline-flex min-w-0 items-center gap-2 text-sm font-medium', className)} />;
}

export function DocsSidebar({ components, collapsible = true, className, ref: refProp, ...rest }: SidebarProps) {
  const ref = useRef<HTMLElement>(null);

  return (
    <>
      <SidebarContent>
        {({ collapsed, hovered, ref: asideRef, ...pointer }) => (
          <>
            <div
              data-sidebar-placeholder=""
              className="pointer-events-none sticky top-(--fd-docs-row-1) z-20 h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] [grid-area:sidebar] *:pointer-events-auto max-md:hidden"
            >
              {collapsed && <div className="absolute inset-y-0 start-0 w-4" {...pointer} />}
              <aside
                id="nd-sidebar"
                ref={(node) => {
                  ref.current = node;
                  asideRef.current = node;
                  if (typeof refProp === 'function') refProp(node);
                  else if (refProp) refProp.current = node;
                }}
                data-collapsed={collapsed}
                data-hovered={collapsed && hovered}
                inert={collapsed && !hovered}
                className={cn(
                  'absolute inset-y-0 start-0 flex w-full flex-col items-end',
                  '*:w-(--docs-sidebar-width)',
                  collapsed && [
                    'inset-y-2 w-(--docs-sidebar-width) transition-transform duration-slow ease-out-strong',
                    hovered
                      ? 'translate-x-2 rounded-xl bg-shell-canvas shadow-lg'
                      : '-translate-x-full',
                  ],
                  className,
                )}
                {...rest}
                {...pointer}
              >
                <div className="flex h-full flex-col p-2">
                  <div className="flex h-10 shrink-0 items-center gap-1 ps-2 pb-2">
                    <Brand className="me-auto" />
                    {collapsible && (
                                              <SidebarCollapseTrigger
                          // It is expanded whenever it is visible; the ghost
                          // button's aria-expanded fill would read as pressed.
                          className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
                            'aria-expanded:bg-transparent aria-expanded:text-muted-foreground aria-expanded:hover:bg-element-hover',
                          )}
                        >
                          <Icon icon={PanelLeftIcon} size="sm" />
                        </SidebarCollapseTrigger>
                    )}
                  </div>
                  <div className={panelClass}>
                    <PanelBody components={components} />
                  </div>
                </div>
              </aside>
            </div>

          </>
        )}
      </SidebarContent>

      {/* Below md the rail is a drawer, drawn on the canvas like the app's. */}
      <SidebarDrawerOverlay className="fixed inset-0 z-drawer scrim-soft backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
      <SidebarDrawerContent className="fixed inset-y-0 start-0 z-drawer flex w-[85%] max-w-80 flex-col bg-shell-canvas p-2 shadow-lg data-[state=closed]:animate-fd-sidebar-out data-[state=open]:animate-fd-sidebar-in">
        <div className="flex h-10 shrink-0 items-center gap-1 ps-2 pb-2">
          <Brand className="me-auto" />
        </div>
        <div className={panelClass}>
          <PanelBody components={components} />
        </div>
      </SidebarDrawerContent>
    </>
  );
}
