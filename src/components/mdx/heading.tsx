'use client';

import { CheckIcon, LinkIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from '@/components/ui/icon-button';

/**
 * A prose heading with a quiet anchor. The heading text links to its own
 * hash; a muted ghost pill beside it copies the full URL and only appears
 * while the heading is hovered or the button is focused. No hue anywhere.
 */

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

function Heading({ as, className, children, ...props }: ComponentProps<'h1'> & { as?: HeadingTag }) {
  const As = as ?? 'h1';
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!props.id) {
    return (
      <As className={className} {...props}>
        {children}
      </As>
    );
  }

  const id = props.id;

  async function onCopy() {
    const url = new URL(window.location.href);
    url.hash = id;
    await navigator.clipboard.writeText(url.href);
    setCopied(true);
  }

  return (
    <As
      {...props}
      className={cn('group/heading flex scroll-m-28 flex-row items-center gap-1.5', className)}
    >
      <a data-card="" data-slot="heading-anchor" href={`#${id}`}>
        {children}
      </a>
      <IconButton
        icon={copied ? CheckIcon : LinkIcon}
        label={copied ? 'Copied link' : 'Copy link to section'}
        size="xs"
        variant="ghost"
        aria-live="polite"
        className={cn(
          'not-prose text-muted-foreground opacity-0 transition-opacity duration-fast',
          'group-hover/heading:opacity-100 focus-visible:opacity-100',
          copied && 'opacity-100',
        )}
        onClick={() => void onCopy()}
      />
    </As>
  );
}

export { Heading };
