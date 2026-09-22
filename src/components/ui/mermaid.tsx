'use client';

import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

/**
 * Renders a mermaid diagram.
 *
 * mermaid is loaded on demand rather than imported at the top level, so it
 * stays out of the bundle of every page that has no diagram on it. The chart
 * is re-rendered when the site theme changes, because mermaid bakes its
 * colours into the SVG it returns rather than reading them from CSS.
 *
 * A chart that fails to parse falls back to its own source. A diagram is
 * never the only copy of what a page says, so a broken one should show what
 * it meant and leave the rest of the page intact.
 */
/**
 * The site's palette, in a form mermaid can do colour arithmetic on.
 *
 * Fumadocs writes these as `lab(...)` and as hex with an alpha pair, neither of
 * which mermaid's colour library parses. Assigning a value to `color` and
 * reading it back makes the browser normalise it to `rgb()` or `rgba()` first.
 */
function siteColours() {
  const probe = document.createElement('span');
  probe.style.display = 'none';
  document.body.append(probe);
  const root = getComputedStyle(document.documentElement);

  const read = (name: string, fallback: string) => {
    const raw = root.getPropertyValue(name).trim();
    if (!raw) return fallback;
    probe.style.color = '';
    probe.style.color = raw;
    return getComputedStyle(probe).color || fallback;
  };

  try {
    return {
      background: read('--color-fd-background', '#ffffff'),
      foreground: read('--color-fd-foreground', '#000000'),
      card: read('--color-fd-card', '#ffffff'),
      muted: read('--color-fd-muted', '#f4f4f5'),
      mutedForeground: read('--color-fd-muted-foreground', '#71717a'),
      border: read('--color-fd-border', '#e4e4e7'),
    };
  } finally {
    probe.remove();
  }
}

export function Mermaid({ chart, className }: { chart: string; className?: string }) {
  const rawId = useId();
  const id = `mermaid${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        const site = siteColours();
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          suppressErrorRendering: true,
          theme: 'base',
          // Borders carry the structure, not fills. In the light palette
          // background, card and muted are all within four values of each
          // other, so nested boxes distinguished by fill would be invisible.
          themeVariables: {
            background: site.card,
            mainBkg: site.card,
            primaryColor: site.card,
            primaryTextColor: site.foreground,
            primaryBorderColor: site.mutedForeground,
            secondaryColor: site.background,
            tertiaryColor: site.background,
            nodeBorder: site.mutedForeground,
            clusterBkg: site.background,
            clusterBorder: site.mutedForeground,
            lineColor: site.mutedForeground,
            textColor: site.foreground,
            edgeLabelBackground: site.card,
            fontSize: '14px',
          },
          fontFamily: 'inherit',
          // wrappingWidth defaults to 200px, which re-wraps labels that already
          // carry their own <br/>. Raise it and let the chart decide its breaks.
          flowchart: { htmlLabels: true, curve: 'basis', wrappingWidth: 400 },
        });
        const { svg: rendered } = await mermaid.render(id, chart.trim());
        if (!cancelled) {
          setSvg(rendered);
          setFailed(false);
        }
      } catch (error) {
        // The fallback below is quiet on the page, so say something here:
        // otherwise a mistyped chart ships as a code block and nobody notices.
        console.error('[Mermaid] chart failed to render', error);
        if (!cancelled) {
          setSvg(null);
          setFailed(true);
        }
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  if (failed) {
    return (
      <pre className={cn('overflow-x-auto', className)}>
        <code>{chart.trim()}</code>
      </pre>
    );
  }

  const wrapper = cn(
    'not-prose my-6 flex justify-center overflow-x-auto rounded-lg border bg-fd-card p-4',
    '[&_svg]:h-auto [&_svg]:max-w-full',
    className,
  );

  // React rejects children alongside dangerouslySetInnerHTML, so the loaded and
  // loading states are two elements rather than one with a conditional prop.
  if (svg) {
    return (
      <div
        data-slot="mermaid"
        className={wrapper}
        // Produced by mermaid at securityLevel 'strict', which strips scripts
        // and event handlers, from chart text authored in this repo rather
        // than supplied by a reader.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  return (
    <div data-slot="mermaid" className={wrapper}>
      <span className="text-sm text-fd-muted-foreground">Loading diagram…</span>
    </div>
  );
}
