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
import { z } from 'zod';
import { PAGE_STATUSES, ROADMAP_URL, STATUS_NOTICE, isUnshipped, statusPlugin } from './status';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    // `status` marks a page whose feature is not in Atlas yet; see ./status.ts.
    schema: pageSchema.extend({ status: z.enum(PAGE_STATUSES).optional() }),
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
  plugins: [statusPlugin()],
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
  // MDX comments ({/* TODO(phase-2): … */} notes to writers) are for the
  // source only; the processed text keeps them verbatim.
  const processed = (await page.data.getText('processed')).replace(/\{\/\*[\s\S]*?\*\/\}\n*/g, '');
  // The HTML page says so in a callout the markdown never sees; say it here.
  const status = isUnshipped(page.data.status)
    ? `> ${STATUS_NOTICE[page.data.status]} Follow progress on the roadmap: ${ROADMAP_URL}\n\n`
    : '';

  return `# ${page.data.title} (${page.url})

${status}${processed}`;
}
