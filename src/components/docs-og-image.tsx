import type { ReactNode } from 'react';

interface DocsOgImageProps {
  description?: ReactNode;
  icon: ReactNode;
  site: ReactNode;
  title: ReactNode;
}

/**
 * The share card, drawn as the docs are: a curved panel set into the canvas,
 * on standards' dark theme.
 *
 * next/og renders this to a PNG with Satori, which reads neither CSS variables
 * nor oklch(), so the standards greys are written out as hex. Each is the
 * exact sRGB of its token (achromatic OKLCH converts as L³ through the sRGB
 * transfer curve):
 */
const tokens = {
  shellCanvas: '#0f0f0f', // --shell-canvas    oklch(0.17 0 0)
  shellEdge: '#262626', //   --shell-edge      oklch(0.27 0 0)
  background: '#020202', //  --background      oklch(0.08 0 0)
  foreground: '#f5f5f5', //  --foreground      oklch(0.97 0 0)
  muted: '#868686', //       --muted-foreground oklch(0.62 0 0)
  rule: '#262626', //        a dashed section rule, at the edge's weight
};

/** The Atlas mark's own colour (src/app/icon.svg). Identity, so it keeps its hue. */
const markColour = '#FFFFE2';

export function DocsOgImage({ description, icon, site, title }: DocsOgImageProps) {
  return (
    <div
      style={{
        backgroundColor: tokens.shellCanvas,
        display: 'flex',
        height: '100%',
        padding: '20px',
        width: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: tokens.background,
          border: `2px solid ${tokens.shellEdge}`,
          borderRadius: '28px',
          color: tokens.foreground,
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          padding: '64px 72px',
        }}
      >
        <p style={{ fontSize: '76px', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
          {title}
        </p>
        <p
          style={{
            borderBottom: `3px dashed ${tokens.rule}`,
            color: tokens.muted,
            fontSize: '40px',
            lineHeight: 1.3,
            margin: 0,
            marginTop: '20px',
            paddingBottom: '36px',
          }}
        >
          {description}
        </p>
        <div
          style={{
            alignItems: 'center',
            color: markColour,
            display: 'flex',
            flexDirection: 'row',
            gap: '18px',
            marginTop: 'auto',
          }}
        >
          {icon}
          <p style={{ color: tokens.foreground, fontSize: '40px', fontWeight: 500, margin: 0 }}>{site}</p>
          <p style={{ color: tokens.muted, fontSize: '40px', fontWeight: 400, margin: 0 }}>Docs</p>
        </div>
      </div>
    </div>
  );
}
