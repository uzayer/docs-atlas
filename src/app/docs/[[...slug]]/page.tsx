import { getPageImageUrl, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { buttonVariants } from '@/components/ui/button';
import { PageFooter } from '@/components/shell/page-footer';
import { TopBarActions } from '@/components/shell/docs-frame';
import { DocsBreadcrumb } from '@/components/shell/docs-breadcrumb';
import { StatusBadge, StatusCallout } from '@/components/status';
import { isUnshipped } from '@/lib/status';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const status = isUnshipped(page.data.status) ? page.data.status : undefined;

  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`;
  const actions = (
    <>
      <MarkdownCopyButton
        markdownUrl={markdownUrl}
        className={buttonVariants({ variant: 'secondary', size: 'sm' })}
      />
      <ViewOptionsPopover
        className={buttonVariants({ variant: 'secondary', size: 'sm' })}
        markdownUrl={markdownUrl}
        githubUrl={githubUrl}
      />
    </>
  );

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
        // Sticks below the top bar rather than under it.
        container: {
          className: 'top-(--fd-docs-row-2) h-[calc(var(--fd-docs-height)-var(--fd-docs-row-2))] pt-10 xl:pt-12',
        },
      }}
      tableOfContentPopover={{ style: 'clerk' }}
      // The breadcrumb lives in the top bar (or, below md, above the title).
      breadcrumb={{ enabled: false }}
      slots={{ footer: PageFooter }}
      className="md:pt-10 xl:pt-12"
    >
      <TopBarActions>{actions}</TopBarActions>
      <DocsBreadcrumb className="md:hidden" />
      {/* A plain h1: DocsTitle hard-codes its own size, which outranks a utility. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h1 className="type-title">{page.data.title}</h1>
        {status ? <StatusBadge status={status} /> : null}
      </div>
      <DocsDescription className="mb-0 text-md font-normal text-muted-foreground">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row items-center gap-1.5 md:hidden">{actions}</div>
      <hr className="rule-dashed my-2" />
      <DocsBody>
        {status ? <StatusCallout status={status} /> : null}
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
