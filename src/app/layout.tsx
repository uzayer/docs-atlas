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
      <head>
        {/* Before first paint, so a reader at 115% never sees a 100% frame. */}
        <script dangerouslySetInnerHTML={{ __html: uiScaleInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
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
