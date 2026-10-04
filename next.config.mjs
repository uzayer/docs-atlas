import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Bottom-left sits on top of the sidebar's footer controls.
  devIndicators: { position: 'bottom-right' },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/docs/getting-started',
        permanent: false,
      },
      {
        source: '/docs',
        destination: '/docs/getting-started',
        permanent: false,
      },
      {
        source:
          '/docs/agents/:agent(atlas|claude-code|codex|cursor|kilo-code|opencode)',
        destination: '/docs/agents',
        permanent: true,
      },
      {
        source: '/docs/context/mission-control',
        destination: '/docs/context/usage',
        permanent: true,
      },
      {
        source: '/docs/context/research',
        destination: '/docs/context/knowledge-base',
        permanent: true,
      },
      {
        source: '/docs/product/review',
        destination: '/docs/source-control/git',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
