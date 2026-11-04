import type { ReactNode } from 'react';

interface DocsOgImageProps {
  description?: ReactNode;
  icon: ReactNode;
  site: ReactNode;
  title: ReactNode;
}

/**
 * The share card, drawn as the docs are: a curved panel set into the canvas,
 * on the design package's Atlas dark theme.
 *
 * next/og renders this to a PNG with Satori, which cannot read CSS variables,
 * so the theme's values are written out as hex, copied from
 * @tryatlas/design's themes.css ([data-theme="atlas"][data-appearance="dark"]):
 */
const tokens = {
  shellCanvas: '#0a0a0a', // --sidebar, the canvas the docs' panels sit in
  shellEdge: '#1e1e1e', //   --border
  background: '#000000', //  --background
  foreground: '#ffffff', //  --foreground
  muted: '#585858', //       --muted-foreground
  rule: '#1e1e1e', //        a dashed section rule, at the border's weight
};

/** The Atlas mark's own color (src/app/icon.svg). Identity, so it keeps its hue. */
const markColor = '#FFFFE2';

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
            color: markColor,
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
