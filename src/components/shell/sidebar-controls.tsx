'use client';

import { useSyncExternalStore } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UiScaleControl } from './ui-scale';

/**
 * The rail's footer, as the app shell's: the outbound links on the left, the
 * reader's own controls (theme and interface scale) as one segmented pill on
 * the right.
 */
export function SidebarControls() {
  const { menuItems } = useDocsLayout();
  const icons = menuItems.filter((item) => item.type === 'icon');

  return (
    <div className="flex items-center justify-between gap-1 border-t border-sidebar-border p-2">
      <div className="flex items-center gap-0.5">
        {icons.map((item, i) => (
          <Tooltip key={i}>
            <TooltipTrigger
              render={
                <a
                  href={item.url}
                  aria-label={item.label}
                  {...(item.external !== false && { target: '_blank', rel: 'noreferrer noopener' })}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
                    'text-muted-foreground [&_svg]:size-3.5',
                  )}
                >
                  {item.icon}
                </a>
              }
            />
            <TooltipContent>{item.label ?? item.text}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div
        role="group"
        className="flex w-fit items-center gap-0.5 rounded-full bg-segment-track p-0.5 ring-1 ring-foreground/8 [&_[data-slot=icon-button]]:rounded-full"
      >
        <ThemeToggle />
        <UiScaleControl iconOnly />
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The resolved theme is unknown on the server; render a stable glyph until
  // the client knows, so hydration does not mismatch.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  const dark = !mounted || resolvedTheme === 'dark';
  const label = `Switch to ${dark ? 'light' : 'dark'} theme`;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <IconButton
            icon={dark ? SunIcon : MoonIcon}
            label={label}
            size="sm"
            onClick={() => setTheme(dark ? 'light' : 'dark')}
          />
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function noop() {
  return () => {};
}
