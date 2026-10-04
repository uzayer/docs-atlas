'use client';

import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/cn';

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
 * The site's palette, read from the standards roles (themes.css), in a form
 * mermaid can do colour arithmetic on.
 *
 * Standards writes these as `oklch(...)`, which mermaid's colour library does
 * not parse, and the browser keeps oklch when it serialises a computed
 * colour. So each one is painted into a single canvas pixel and read back as
 * sRGB bytes. Everything read here is achromatic, so the diagram carries no
 * hue in either theme.
 */
function siteColours() {
  const root = getComputedStyle(document.documentElement);
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const read = (name: string, fallback: string) => {
    const raw = root.getPropertyValue(name).trim();
    if (!raw || !ctx) return fallback;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = fallback;
    ctx.fillStyle = raw;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r}, ${g}, ${b}, ${Math.round((a / 255) * 100) / 100})`;
  };

  // Fallbacks only matter if the token layer failed to load; they are the
  // neutral ends of the ramp, not a palette.
  return {
    background: read('--background', 'rgb(255, 255, 255)'),
    foreground: read('--foreground', 'rgb(0, 0, 0)'),
    card: read('--card', 'rgb(255, 255, 255)'),
    muted: read('--muted', 'rgb(245, 245, 245)'),
    secondaryForeground: read('--secondary-foreground', 'rgb(64, 64, 64)'),
    mutedForeground: read('--muted-foreground', 'rgb(115, 115, 115)'),
    borderStrong: read('--border-strong', 'rgba(0, 0, 0, 0.18)'),
  };
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
          // Mermaid 12 defaults to the 'neo' look, which drops a shadow under
          // every node. Standards raises with rings, never shadows.
          look: 'classic',
          // Borders carry the structure, not fills: in light the ramp
          // saturates at white after the card, so nested boxes told apart by
          // fill would be invisible. Nodes sit on the muted step inside the
          // card frame, clusters on the page step, and every rule is the
          // strong border, the same ink a focused edge uses.
          themeVariables: {
            background: site.card,
            mainBkg: site.muted,
            primaryColor: site.muted,
            primaryTextColor: site.foreground,
            primaryBorderColor: site.borderStrong,
            secondaryColor: site.background,
            secondaryTextColor: site.foreground,
            secondaryBorderColor: site.borderStrong,
            tertiaryColor: site.background,
            tertiaryTextColor: site.foreground,
            tertiaryBorderColor: site.borderStrong,
            nodeBorder: site.borderStrong,
            nodeTextColor: site.foreground,
            clusterBkg: site.background,
            clusterBorder: site.borderStrong,
            titleColor: site.secondaryForeground,
            lineColor: site.mutedForeground,
            arrowheadColor: site.mutedForeground,
            textColor: site.foreground,
            edgeLabelBackground: site.card,
            fontSize: '13px',
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
      <pre
        className={cn(
          'not-prose code my-6 overflow-x-auto rounded-xl bg-card p-4 text-secondary-foreground ring-1 ring-foreground/10',
          className,
        )}
      >
        <code>{chart.trim()}</code>
      </pre>
    );
  }

  const wrapper = cn(
    'not-prose my-6 flex justify-center overflow-x-auto rounded-xl bg-card p-4 ring-1 ring-foreground/10',
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
      <span className="text-xs text-muted-foreground">Loading diagram…</span>
    </div>
  );
}
