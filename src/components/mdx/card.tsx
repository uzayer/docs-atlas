import Link from 'fumadocs-core/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { GoChevron } from './go-chevron';

/**
 * A raised block linking to another page. Fumadocs' Card props (`title`,
 * `description`, `icon`, `href`, children) so existing MDX is unchanged.
 * Hover lifts the fill one step and strengthens the ring; nothing moves but
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
          className="mb-3 flex size-control-md items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-foreground/10 [&_svg]:size-4"
        >
          {icon}
        </span>
      ) : null}
      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <span className="min-w-0 truncate">{title}</span>
        {href ? <GoChevron className="text-muted-foreground" /> : null}
      </span>
      {description ? (
        <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
      ) : null}
      {children ? (
        <span className="mt-1 block text-sm text-muted-foreground">{children}</span>
      ) : null}
    </>
  );

  const classes = cn(
    'group/go block rounded-xl bg-card p-4 ring-1 ring-foreground/10',
    'duration-fast ease-out-strong transition-[background-color,box-shadow]',
    href && 'hover:bg-element-hover hover:ring-foreground/15',
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
