import Link from 'fumadocs-core/link';
import type { ReactNode } from 'react';
import { GoChevron } from '@/components/design-client';
import { cn } from '@/lib/cn';

/**
 * A raised block linking to another page. Fumadocs' Card props (`title`,
 * `description`, `icon`, `href`, children) so existing MDX is unchanged.
 * Hover lifts the fill one step and strengthens the border; nothing moves but
 * the chevron.
 */

function Cards({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="cards"
      className={cn('not-prose my-6 grid grid-cols-1 gap-3 sm:grid-cols-2', className)}
      {...props}
    />
  );
}

type CardProps = Omit<React.ComponentProps<'a'>, 'title'> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

function Card({ title, description, icon, href, className, children, ...props }: CardProps) {
  const body = (
    <>
      {icon ? (
        <span
          data-slot="card-icon"
          className="mb-3 flex size-control-md items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground [&_svg]:size-4"
        >
          {icon}
        </span>
      ) : null}
      <span className="flex items-center gap-1.5 text-md font-medium text-foreground">
        <span className="min-w-0 truncate">{title}</span>
        {href ? <GoChevron className="text-muted-foreground" /> : null}
      </span>
      {description ? (
        <span className="mt-1 block text-md text-muted-foreground">{description}</span>
      ) : null}
      {children ? (
        <span className="mt-1 block text-md text-muted-foreground">{children}</span>
      ) : null}
    </>
  );

  const classes = cn(
    'group/go block rounded-xl border border-border bg-card p-4',
    'duration-fast ease-out-strong transition-[background-color,border-color]',
    href && 'hover:border-border-strong hover:bg-element-hover',
    className,
  );

  if (!href) {
    return (
      <div data-slot="card" className={classes}>
        {body}
      </div>
    );
  }

  return (
    <Link data-slot="card" data-card href={href} className={classes} {...props}>
      {body}
    </Link>
  );
}

export { Card, Cards };
export type { CardProps };
