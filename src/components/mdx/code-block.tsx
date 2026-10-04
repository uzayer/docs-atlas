'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { createContext, use, useEffect, useRef, useState } from 'react';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import {
  CodeBlockTab,
  CodeBlockTabs as FdCodeBlockTabs,
  CodeBlockTabsList as FdCodeBlockTabsList,
  CodeBlockTabsTrigger as FdCodeBlockTabsTrigger,
  Pre,
} from 'fumadocs-ui/components/codeblock';
import { cn } from '@/lib/cn';
import { IconButton } from '@/components/ui/icon-button';

/**
 * A fenced code block in standards' chrome: a raised block (card fill, ring,
 * rounded-xl), Geist Mono at the code size, a quiet title bar when the fence
 * has `title="…"`, and a ghost pill copy button.
 *
 * The figure keeps the `shiki` class and the line-number counter Fumadocs
 * sets, so its shiki.css (dual themes, line highlights, diff notation, focus,
 * line numbers) applies unchanged. Only the chrome is ours.
 */

/** Set by CodeBlockTabs so a block inside a tab drops its own frame. */
const InTabs = createContext(false);

type CodeBlockProps = Omit<ComponentProps<'figure'>, 'title'> & {
  title?: ReactNode;
  /** Shiki's icon for the language: HTML when a string. */
  icon?: ReactNode;
  allowCopy?: boolean | 'true' | 'false';
  'data-line-numbers'?: boolean;
  'data-line-numbers-start'?: number;
};

function CodeBlock({
  title,
  icon,
  allowCopy = true,
  className,
  children,
  style,
  ...props
}: CodeBlockProps) {
  const inTabs = use(InTabs);
  const areaRef = useRef<HTMLDivElement>(null);
  const copy = allowCopy !== false && allowCopy !== 'false';

  const viewportStyle = {
    // Room on the right of each line for the floating copy button.
    '--padding-right': !title && copy ? 'calc(var(--spacing) * 10)' : undefined,
    counterSet: props['data-line-numbers']
      ? `line ${Number(props['data-line-numbers-start'] ?? 1) - 1}`
      : undefined,
  } as CSSProperties;

  return (
    <figure
      dir="ltr"
      data-slot="code-block"
      tabIndex={-1}
      {...props}
      style={style}
      className={cn(
        'shiki not-prose group/code relative overflow-hidden',
        inTabs ? 'rounded-none bg-transparent' : 'my-6 rounded-xl bg-card ring-1 ring-foreground/10',
        className,
      )}
    >
      {title ? (
        <div
          data-slot="code-block-title"
          className="flex h-control-lg items-center gap-2 border-b border-hairline ps-4 pe-1.5 text-xs text-muted-foreground"
        >
          {typeof icon === 'string' ? (
            <span
              className="flex [&_svg]:size-3.5"
              // Shiki's language icon, generated at build time from the fence.
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          ) : (
            icon
          )}
          <figcaption className="code min-w-0 flex-1 truncate font-normal">{title}</figcaption>
          {copy ? <CopyButton areaRef={areaRef} /> : null}
        </div>
      ) : copy ? (
        <CopyButton
          areaRef={areaRef}
          className={cn(
            'absolute top-1.5 right-1.5 z-panel bg-card',
            'opacity-0 transition-opacity duration-fast group-hover/code:opacity-100 focus-visible:opacity-100',
            'pointer-coarse:opacity-100 data-copied:opacity-100',
          )}
        />
      ) : null}
      <div
        ref={areaRef}
        role="region"
        tabIndex={0}
        aria-label={typeof title === 'string' ? title : 'Code'}
        className="mono max-h-150 overflow-auto py-3.5 text-xs leading-5 focus-visible:outline-none"
        style={viewportStyle}
      >
        {children}
      </div>
    </figure>
  );
}

function CopyButton({
  areaRef,
  className,
}: {
  areaRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function onClick() {
    const pre = areaRef.current?.querySelector('pre');
    if (!pre) return;
    // Same rule as Fumadocs: notation marked nd-copy-ignore is not code.
    const clone = pre.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.nd-copy-ignore').forEach((node) => node.replaceWith('\n'));
    await navigator.clipboard.writeText(clone.textContent ?? '');
    setCopied(true);
  }

  return (
    <IconButton
      icon={copied ? CheckIcon : CopyIcon}
      label={copied ? 'Copied' : 'Copy code'}
      size="sm"
      variant="ghost"
      aria-live="polite"
      data-copied={copied || undefined}
      className={cn('text-muted-foreground', className)}
      onClick={() => void onClick()}
    />
  );
}

/** The `pre` slot of the MDX map: rehype-code's props land on the figure. */
function CodeBlockPre(props: ComponentProps<'pre'> & Omit<CodeBlockProps, keyof ComponentProps<'pre'>>) {
  const { children, ...rest } = props;
  return (
    <CodeBlock {...(rest as CodeBlockProps)}>
      <Pre>{children}</Pre>
    </CodeBlock>
  );
}

function CodeBlockTabs({ className, children, ...props }: ComponentProps<typeof FdCodeBlockTabs>) {
  return (
    <FdCodeBlockTabs
      {...props}
      className={(state) =>
        cn(
          'my-6 overflow-hidden rounded-xl border-0 bg-card ring-1 ring-foreground/10',
          typeof className === 'function' ? className(state) : className,
        )
      }
    >
      <InTabs value>{children}</InTabs>
    </FdCodeBlockTabs>
  );
}

function CodeBlockTabsList({ className, ...props }: ComponentProps<typeof FdCodeBlockTabsList>) {
  return (
    <FdCodeBlockTabsList
      {...props}
      className={(state) =>
        cn(
          'border-b border-hairline px-2',
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
}

function CodeBlockTabsTrigger({ className, ...props }: ComponentProps<typeof FdCodeBlockTabsTrigger>) {
  return (
    <FdCodeBlockTabsTrigger
      {...props}
      className={(state) =>
        cn(
          'h-control-lg text-xs',
          state.active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
}

export {
  CodeBlock,
  CodeBlockPre,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
};
