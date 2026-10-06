import { DownloadIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { DOWNLOADS, LATEST_RELEASE, RELEASES_URL, type Platform } from '@/lib/downloads';

/**
 * Download links for each platform, from src/lib/downloads.ts (the one place
 * a release's file names are written down).
 *
 * One raised block per platform: its name and requirement, then a filled
 * button for the primary file and quiet ones for the rest. These are links,
 * so they are anchors styled with `buttonVariants`, never `<Button>`.
 *
 * `compact` drops each platform to its primary file, for a page that only
 * needs to point at the download (the Get Started index); the install page
 * uses the full set.
 */

type InstallButtonsProps = {
  /** Which platforms, in order. Defaults to all three. */
  platforms?: Platform[];
  compact?: boolean;
  className?: string;
};

const ORDER: Platform[] = ['macos', 'windows', 'linux'];

function InstallButtons({ platforms = ORDER, compact = false, className }: InstallButtonsProps) {
  return (
    <div data-slot="install-buttons" className={cn('not-prose my-6', className)}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {platforms.map((platform) => {
          const { name, requirement, downloads } = DOWNLOADS[platform];
          const shown = compact ? downloads.slice(0, platform === 'macos' ? 2 : 1) : downloads;
          return (
            <div
              key={platform}
              className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{requirement}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                {shown.map((download, i) => (
                  <a
                    key={download.href}
                    href={download.href}
                    className={cn(
                      buttonVariants({ variant: i === 0 ? 'default' : 'outline', size: 'lg' }),
                      'w-full justify-between',
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Icon icon={DownloadIcon} size="md" />
                      <span className="truncate">{download.label}</span>
                    </span>
                    {download.detail ? (
                      <span className="font-mono text-xs font-normal opacity-70">{download.detail}</span>
                    ) : null}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Atlas {LATEST_RELEASE.version}.{' '}
        <a href={LATEST_RELEASE.url} className="underline underline-offset-2 hover:text-foreground">
          Release notes and checksums
        </a>
        {' · '}
        <a href={RELEASES_URL} className="underline underline-offset-2 hover:text-foreground">
          All releases
        </a>
      </p>
    </div>
  );
}

export { InstallButtons };
export type { InstallButtonsProps };
