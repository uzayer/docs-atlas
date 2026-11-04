'use client';

import Link from 'fumadocs-core/link';
import { CircleDashedIcon, HammerIcon } from 'lucide-react';
import { Badge, Icon } from '@tryatlas/design';
import { cn } from '@/lib/cn';
import { Callout } from '@/components/mdx/callout';
import { ROADMAP_URL, STATUS_LABEL, STATUS_NOTICE, type PageStatus } from '@/lib/status';

/**
 * How a page's `status` is drawn. Three tones, one per status:
 *
 * - shipped: the success chip. Only the roadmap prints it; a shipped page
 *   is the default and carries no mark.
 * - in-progress: the info chip.
 * - roadmapped: a dashed, unfilled chip. Dashed is this system's mark for
 *   "not here yet" (empty states and drop targets), and it reads
 *   quieter than any filled chip, which is the point.
 */

const VARIANT = {
  shipped: 'success',
  'in-progress': 'info',
  roadmapped: 'outline',
} as const;

type StatusBadgeProps = {
  status: PageStatus;
  size?: 'sm' | 'md';
  className?: string;
};

function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  return (
    <Badge
      data-status={status}
      variant={VARIANT[status]}
      size={size}
      className={cn(status === 'roadmapped' && 'border-dashed text-muted-foreground', className)}
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}

/** The notice at the top of a page that is not in Atlas yet. */
function StatusCallout({ status }: { status: Exclude<PageStatus, 'shipped'> }) {
  return (
    <Callout
      type="info"
      data-status={status}
      icon={<Icon icon={status === 'roadmapped' ? CircleDashedIcon : HammerIcon} size="md" />}
      className="mt-0"
    >
      <p>
        <span className="font-medium text-foreground">{STATUS_NOTICE[status]}</span> Follow progress
        on the <Link href={ROADMAP_URL}>roadmap</Link>.
      </p>
    </Callout>
  );
}

export { StatusBadge, StatusCallout };
export type { StatusBadgeProps };
