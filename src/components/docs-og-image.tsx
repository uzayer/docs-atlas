import type { ReactNode } from 'react';

interface DocsOgImageProps {
  description?: ReactNode;
  icon: ReactNode;
  site: ReactNode;
  title: ReactNode;
}

const accent = '#FFFFE2';
const accentMuted = 'rgba(255, 255, 226, 0.3)';

export function DocsOgImage({ description, icon, site, title }: DocsOgImageProps) {
  return (
    <div
      style={{
        backgroundColor: '#000',
        borderBottom: `18px solid ${accentMuted}`,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '4rem',
        width: '100%',
      }}
    >
      <p style={{ fontSize: '82px', fontWeight: 800, margin: 0 }}>{title}</p>
      <p
        style={{
          borderBottom: `10px dashed ${accentMuted}`,
          color: 'rgba(240, 240, 240, 0.8)',
          fontSize: '52px',
          margin: 0,
          marginTop: '16px',
          paddingBottom: '28px',
        }}
      >
        {description}
      </p>
      <div
        style={{
          alignItems: 'center',
          color: accent,
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          marginTop: 'auto',
        }}
      >
        {icon}
        <p style={{ fontSize: '56px', fontWeight: 600, margin: 0 }}>{site}</p>
      </div>
    </div>
  );
}
