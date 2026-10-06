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
      // The team-era reorganisation (docs/team-era). Each rule also carries
      // the `.md` form, which src/proxy.ts would otherwise rewrite to a markdown
      // route that no longer exists.
      {
        // "Identity & Access" (accounts, organisations, members) became Team.
        source: '/docs/organisation/:path*',
        destination: '/docs/team/:path*',
        permanent: true,
      },
      {
        source: '/docs/organisation',
        destination: '/docs/team',
        permanent: true,
      },
      {
        source: '/docs/source-control/:page(timeline|timeline\\.md)',
        destination: '/docs/team/:page',
        permanent: true,
      },
      {
        source: '/docs/getting-started/:page(power-user|power-user\\.md)',
        destination: '/docs/product/:page',
        permanent: true,
      },
      {
        source: '/docs/team/organisations',
        destination: '/docs/team/organizations',
        permanent: true,
      },
      {
        source: '/docs/community/beta-programme',
        destination: '/docs/community/beta-program',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
