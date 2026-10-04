import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  LightbulbIcon,
  XCircleIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';

/**
 * Standards' inline notice, at the reading size.
 *
 * Accepts Fumadocs' Callout props (`type`, `title`, `icon`) so MDX written
 * against the default component keeps working. The fill and the glyph carry
 * the status; the body stays in the reading ink, because a paragraph set
 * entirely in a status hue is hard to read for more than a line.
 */

type CalloutType = 'info' | 'warn' | 'warning' | 'error' | 'success' | 'idea';
type Tone = 'info' | 'warning' | 'error' | 'success';

const TONE_FOR_TYPE: Record<CalloutType, Tone> = {
  info: 'info',
  idea: 'info',
  warn: 'warning',
  warning: 'warning',
  error: 'error',
  success: 'success',
};

const ICON_FOR_TYPE: Record<CalloutType, LucideIcon> = {
  info: InfoIcon,
  idea: LightbulbIcon,
  warn: AlertTriangleIcon,
  warning: AlertTriangleIcon,
  error: XCircleIcon,
  success: CheckCircle2Icon,
};

const calloutVariants = cva(
  'my-6 flex items-start gap-3 rounded-xl px-4 py-3 text-sm text-secondary-foreground',
  {
    variants: {
      tone: {
        info: 'bg-info-muted [&>[data-slot=icon]]:text-info',
        warning: 'bg-warning-muted [&>[data-slot=icon]]:text-warning',
        error: 'bg-error-muted [&>[data-slot=icon]]:text-error',
        success: 'bg-success-muted [&>[data-slot=icon]]:text-success',
      },
    },
    defaultVariants: { tone: 'info' },
  },
);

type CalloutProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  type?: CalloutType;
  title?: ReactNode;
  /** A node replaces the glyph; `false` drops it. */
  icon?: ReactNode | false;
};

function Callout({ type = 'info', title, icon, className, children, ...props }: CalloutProps) {
  const known = type in TONE_FOR_TYPE ? type : 'info';
  return (
    <div
      data-slot="callout"
      data-tone={TONE_FOR_TYPE[known]}
      role="note"
      className={cn(calloutVariants({ tone: TONE_FOR_TYPE[known] }), className)}
      {...props}
    >
      {icon === false ? null : icon ? (
        <span data-slot="icon" className="mt-0.5 flex shrink-0 [&_svg]:size-4">
          {icon}
        </span>
      ) : (
        <Icon icon={ICON_FOR_TYPE[known]} size="md" className="mt-0.5" />
      )}
      <div className="prose-no-margin min-w-0 flex-1">
        {title ? <p className="font-medium text-foreground">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}

export { Callout, calloutVariants };
export type { CalloutProps, CalloutType };
