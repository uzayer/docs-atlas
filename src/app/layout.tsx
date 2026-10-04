import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { cn } from '@/lib/cn';
import { UiScaleProvider } from '@/lib/ui-scale';
import { uiScaleInitScript } from '@/lib/ui-scale-init';
import { TooltipProvider } from '@/components/ui/tooltip';
import SearchDialog from '@/components/search-dialog';

// Standards' faces. Registered under their own variables; docs.css points
// standards' --font-sans / --font-mono stacks at them.
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.tryatlas.cc'),
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn(geist.variable, geistMono.variable)} suppressHydrationWarning>
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
            // Standards keys every theme off `data-theme`; Fumadocs' Shiki
            // and its own dark variant key off the `.dark` class. Both.
            attribute: ['class', 'data-theme'],
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
