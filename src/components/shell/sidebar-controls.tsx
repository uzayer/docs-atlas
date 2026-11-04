'use client';

import { useSyncExternalStore } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  IconButton,
  SegmentedIconGroup,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  UiScaleControl,
  iconButtonVariants,
} from '@tryatlas/design';
import { cn } from '@/lib/cn';
import { useUiScale } from '@/lib/ui-scale';

/**
 * The rail's footer, as the app shell's: the outbound links on the left, the
 * reader's own controls (theme and interface scale) as one segmented pill on
 * the right.
 */
export function SidebarControls() {
  const { menuItems } = useDocsLayout();
  const icons = menuItems.filter((item) => item.type === 'icon');
  const { scale, setScale } = useUiScale();

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
                  // The marks arrive as bare SVGs; size them as IconButton
                  // sizes its glyph at `sm`.
                  className={cn(iconButtonVariants({ variant: 'ghost', size: 'sm' }), '[&_svg]:size-3')}
                >
                  {item.icon}
                </a>
              }
            />
            <TooltipContent>{item.label ?? item.text}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <SegmentedIconGroup>
        <ThemeToggle />
        <UiScaleControl iconOnly scale={scale} onScaleChange={setScale} />
      </SegmentedIconGroup>
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
