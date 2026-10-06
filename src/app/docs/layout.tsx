import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { SidebarProvider, SidebarTrigger, useSidebar } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { baseOptions } from '@/lib/layout.shared';
import { HeadingHighlight } from '@/components/heading-highlight';
import { DocsFrame, DocsHeader } from '@/components/shell/docs-frame';
import { DocsSidebar } from '@/components/shell/docs-sidebar';

/**
 * Fumadocs' docs layout with the Atlas shell in its slots: the frame, the
 * header below md, and the rail. Behavior (tree, collapse, drawer, search,
 * TOC) stays Fumadocs'; see src/components/shell/.
 */
export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      slots={{
        container: DocsFrame,
        header: DocsHeader,
        sidebar: {
          provider: SidebarProvider,
          root: DocsSidebar,
          trigger: SidebarTrigger,
          useSidebar,
        },
      }}
    >
      <HeadingHighlight />
      {children}
    </DocsLayout>
  );
}
