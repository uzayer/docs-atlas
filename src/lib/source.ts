import { loader } from 'fumadocs-core/source';
import { createElement } from 'react';
import { icons } from 'lucide-react';
import {
  ClaudeCodeIcon,
  CodexIcon,
  CursorIcon,
  KiloCodeIcon,
  OpenCodeIcon,
} from './agent-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  icon(icon) {
    const agentIcons = {
      ClaudeCode: ClaudeCodeIcon,
      Codex: CodexIcon,
      Cursor: CursorIcon,
      KiloCode: KiloCodeIcon,
      OpenCode: OpenCodeIcon,
      Atlas: () => createElement('img', { alt: '', className: 'size-4', src: '/icon.svg' }),
    };
    const AgentIcon = icon ? agentIcons[icon as keyof typeof agentIcons] : undefined;

    if (AgentIcon) return createElement(AgentIcon);

    const Icon = icon ? icons[icon as keyof typeof icons] : undefined;
    return Icon ? createElement(Icon) : undefined;
  },
});

export function getPageImageUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: '/' + [page.locale, ...docsImageRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: '/' + [page.locale, ...docsContentRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
