import { Image as FrameworkImage } from 'fumadocs-core/framework';
import type { ImageProps } from 'fumadocs-core/framework';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * Prose elements whose wrapper is a component rather than a CSS rule. The
 * rules for what is inside them (cells, rows, quote text) live in mdx.css.
 */

/** A table on a raised block. The wrapper scrolls; the ring is its edge. */
function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div
      data-slot="mdx-table"
      className="prose-no-margin relative my-6 overflow-x-auto rounded-xl bg-card ring-1 ring-foreground/10"
    >
      <table className={className} {...props} />
    </div>
  );
}

/** An image framed like every other raised block. */
function Image({ className, ...props }: ComponentProps<'img'>) {
  return (
    <FrameworkImage
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
      // MDX hands the `img` slot plain attributes; a `src` is always a string
      // or a static import there, never the Blob the DOM type also allows.
      {...(props as ImageProps)}
      className={cn('rounded-xl ring-1 ring-foreground/10', className)}
    />
  );
}

export { Image, Table };
