import type { ReactNode } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';

/**
 * A screenshot of the app, in a frame.
 *
 * Files live in `public/screenshots/<section>/<page>-<what>.png` and are
 * referenced from the site root: `src="/screenshots/team/chat-channel.png"`.
 * Pass `srcDark` too when the shot exists in both appearances; the page
 * shows whichever matches the reader's theme (mdx.css swaps them on
 * `data-theme`, since a `dark:` variant is off limits to components).
 *
 * Leave `src` out while the shot does not exist yet: the frame renders as a
 * dashed placeholder that names what belongs there, so a page can be written
 * before its screenshots are taken.
 *
 * Plain `<img>` rather than next/image: the files are already sized PNGs from
 * public/, and next/image would need the dimensions on every use.
 */

type ScreenshotProps = {
  /** The light-appearance image (or the only one). Omit for a placeholder. */
  src?: string;
  /** The dark-appearance image, when the shot has one. */
  srcDark?: string;
  /** Required: what the image shows, for a reader who cannot see it. */
  alt: string;
  caption?: ReactNode;
  /** Intrinsic size in px. Optional, but it stops the page jumping on load. */
  width?: number;
  height?: number;
  className?: string;
};

function Screenshot({ src, srcDark, alt, caption, width, height, className }: ScreenshotProps) {
  const image = (variant: 'light' | 'dark' | 'only', source: string) => (
    // oxlint-disable-next-line nextjs/no-img-element -- see the docblock: sized files from public/
    <img
      data-variant={variant}
      src={source}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className="block h-auto w-full rounded-lg ring-1 ring-foreground/5"
    />
  );

  return (
    <figure data-slot="screenshot" className={cn('not-prose my-6', className)}>
      <div className="rounded-xl bg-card p-1.5 ring-1 ring-foreground/10">
        {src ? (
          srcDark ? (
            <>
              {image('light', src)}
              {image('dark', srcDark)}
            </>
          ) : (
            image('only', src)
          )
        ) : (
          <div
            role="img"
            aria-label={alt}
            className="flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 text-center text-sm text-muted-foreground"
          >
            <Icon icon={ImageIcon} size="lg" />
            <span>Screenshot: {alt}</span>
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export { Screenshot };
export type { ScreenshotProps };
