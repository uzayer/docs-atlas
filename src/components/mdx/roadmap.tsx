import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import Link from 'fumadocs-core/link';
import { CheckCircle2Icon, CircleDashedIcon, CircleDotIcon, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { GoChevron } from './go-chevron';
import type { PageStatus } from '@/lib/status';

/**
 * The roadmap page's lists.
 *
 *   ## In progress
 *   <RoadmapList status="in-progress">
 *     <RoadmapItem title="Mobile" href="/docs/team/mobile">…</RoadmapItem>
 *   </RoadmapList>
 *
 * The section heading stays a markdown `##`, so it lands in the TOC. The list
 * hands its `status` to every item that does not set its own, which decides
 * the glyph: a check, a dot, a dashed ring. The same three tones as the
 * status chips (src/components/status.tsx).
 */

const GLYPH: Record<PageStatus, { icon: LucideIcon; className: string }> = {
  shipped: { icon: CheckCircle2Icon, className: 'text-success' },
  'in-progress': { icon: CircleDotIcon, className: 'text-info' },
  roadmapped: { icon: CircleDashedIcon, className: 'text-muted-foreground' },
};

type RoadmapItemProps = {
  title: ReactNode;
  /** The docs page for it, when there is one. */
  href?: string;
  /** Inherited from the list when left out. */
  status?: PageStatus;
  /** A short tag on the right: the release it shipped in, say. */
  meta?: ReactNode;
  children?: ReactNode;
};

function RoadmapItem({ title, href, status = 'roadmapped', meta, children }: RoadmapItemProps) {
  const glyph = GLYPH[status];
  return (
    <li data-slot="roadmap-item" data-status={status} className="flex gap-3 px-4 py-3">
      <Icon icon={glyph.icon} size="md" className={cn('mt-0.5', glyph.className)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          {href ? (
            <Link
              href={href}
              className="group/go inline-flex min-w-0 items-center gap-1 text-sm font-medium text-foreground hover:underline hover:underline-offset-2"
            >
              <span className="truncate">{title}</span>
              <GoChevron className="text-muted-foreground" />
            </Link>
          ) : (
            <span className="text-sm font-medium text-foreground">{title}</span>
          )}
          {meta ? <span className="ms-auto shrink-0 text-xs text-muted-foreground">{meta}</span> : null}
        </div>
        {children ? <div className="mt-0.5 text-sm text-muted-foreground">{children}</div> : null}
      </div>
    </li>
  );
}

function RoadmapList({ status, children }: { status: PageStatus; children: ReactNode }) {
  return (
    <ul
      data-slot="roadmap-list"
      className="not-prose my-6 divide-y divide-hairline overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
    >
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<RoadmapItemProps>, {
              status: (child.props as RoadmapItemProps).status ?? status,
            })
          : child,
      )}
    </ul>
  );
}

export { RoadmapItem, RoadmapList };
export type { RoadmapItemProps };
