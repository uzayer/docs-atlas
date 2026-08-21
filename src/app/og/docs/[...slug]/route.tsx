import { getPageImageUrl, source } from '@/lib/source';
import { DocsOgImage } from '@/components/docs-og-image';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { appName } from '@/lib/shared';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const revalidate = false;

const atlasBrandmark = readFile(join(process.cwd(), 'public/atlas-brandmark.png'), 'base64').then(
  (data) => `data:image/png;base64,${data}`,
);

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DocsOgImage
      title={page.data.title}
      description={page.data.description}
      site={appName}
      icon={<img alt="" src={await atlasBrandmark} style={{ height: '120px', width: '120px' }} />}
    />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
