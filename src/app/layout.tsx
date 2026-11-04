import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import type { Metadata } from 'next';
import { TooltipProvider } from '@/components/design-client';
import { UiScaleProvider } from '@/lib/ui-scale';
import { uiScaleInitScript } from '@/lib/ui-scale-init';
import SearchDialog from '@/components/search-dialog';

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.tryatlas.cc'),
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    // Geist and Geist Mono come with the design package's stylesheet. The
    // theme is always Atlas; next-themes writes the appearance.
    <html lang="en" data-theme="atlas" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        {/* Before first paint, so a reader at 115% never sees a 100% frame.
            First in <body>, as next-themes places its own: an inline script
            here still runs before anything after it is parsed, and unlike
            one in <head> it is not re-rendered when a not-found boundary
            renders the root layout on the client. */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: uiScaleInitScript }} />
        <RootProvider
          search={{ SearchDialog }}
          theme={{
            // The design package's themes key off `data-appearance`;
            // Fumadocs' Shiki and its own dark variant key off `.dark`. Both.
            attribute: ['class', 'data-appearance'],
            defaultTheme: 'system',
            enableSystem: true,
            disableTransitionOnChange: true,
          }}
        >
          <UiScaleProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </UiScaleProvider>
        </RootProvider>
      </body>
    </html>
  );
}
