import type { Metadata } from 'next';
import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { NotFoundContent } from '@/components/shell/not-found';

export const metadata: Metadata = { title: 'Page not found' };

/** An unknown /docs path: the catch-all route calls notFound(), inside the frame. */
export default function NotFound() {
  return (
    <DocsPage toc={[]} breadcrumb={{ enabled: false }} footer={{ enabled: false }} className="md:pt-10 xl:pt-12">
      <NotFoundContent />
    </DocsPage>
  );
}
