'use client';

import { useState, type ReactNode } from 'react';
import { PlayIcon, VideoIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';

/**
 * A video: a YouTube embed or an MP4.
 *
 * - `youtube="<id>"` shows the poster (yours, or YouTube's thumbnail) with a
 *   play button, and only loads the player when it is pressed. The embed is
 *   youtube-nocookie, so nothing from YouTube runs until the reader asks.
 * - `src="/videos/x.mp4"` is a native `<video>` with controls; `poster` is
 *   its still. It preloads metadata only.
 * - Neither yet: a dashed placeholder that names the video, so a page can
 *   reserve the slot before the video exists.
 *
 * Always 16:9.
 */

type VideoProps = {
  /** A YouTube video id (the `v=` value), not a URL. */
  youtube?: string;
  /** An MP4 under public/, or any URL a `<video>` can play. */
  src?: string;
  /** The still shown before playback. */
  poster?: string;
  /** Required: what the video shows. Labels the player and the placeholder. */
  title: string;
  caption?: ReactNode;
  className?: string;
};

function Video({ youtube, src, poster, title, caption, className }: VideoProps) {
  return (
    <figure data-slot="video" className={cn('not-prose my-6', className)}>
      <div className="rounded-xl bg-card p-1.5 ring-1 ring-foreground/10">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          {youtube ? (
            <YouTube id={youtube} poster={poster} title={title} />
          ) : src ? (
            <video
              src={src}
              poster={poster}
              title={title}
              aria-label={title}
              controls
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label={title}
              className="flex size-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 text-center text-sm text-muted-foreground"
            >
              <Icon icon={VideoIcon} size="lg" />
              <span>Video coming soon: {title}</span>
            </div>
          )}
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function YouTube({ id, poster, title }: { id: string; poster?: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 size-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${title}`}
      className="group/play absolute inset-0 flex size-full cursor-pointer items-center justify-center"
    >
      {/* oxlint-disable-next-line nextjs/no-img-element -- a remote still, never resized */}
      <img
        src={poster ?? `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      <span className="relative flex size-control-xl items-center justify-center rounded-full bg-primary text-primary-foreground ring-1 ring-foreground/10 duration-fast transition-[background-color,transform] ease-out-strong group-hover/play:scale-105 group-hover/play:bg-primary-hover">
        <Icon icon={PlayIcon} size="md" />
      </span>
    </button>
  );
}

export { Video };
export type { VideoProps };
