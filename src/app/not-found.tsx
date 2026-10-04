import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/shell/not-found';

export const metadata: Metadata = { title: 'Page not found' };

/**
 * Any URL outside /docs. There is no docs layout here, so the page draws its
 * own frame: one curved panel set into the canvas.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 bg-shell-canvas p-2">
      <div className="flex flex-1 items-center justify-center rounded-xl border border-shell-edge bg-background px-6">
        <NotFoundContent className="w-full max-w-md" />
      </div>
    </main>
  );
}
