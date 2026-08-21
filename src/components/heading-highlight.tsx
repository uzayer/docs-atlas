'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const HIGHLIGHT_CLASS = 'heading-highlight-flash';
const HIGHLIGHT_DURATION_MS = 3200;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function highlight(id: string) {
  const el = document.getElementById(decodeURIComponent(id));
  if (!el) return;

  el.classList.remove(HIGHLIGHT_CLASS);
  void el.offsetWidth; // reflow, so re-triggering the same id restarts the animation
  el.classList.add(HIGHLIGHT_CLASS);
  window.setTimeout(() => el.classList.remove(HIGHLIGHT_CLASS), HIGHLIGHT_DURATION_MS);

  const rect = el.getBoundingClientRect();
  const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
  if (!inView) {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  }
}

function readHashTarget(href: string, currentPathname: string) {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return null;

  const path = href.slice(0, hashIndex);
  const hash = href.slice(hashIndex + 1);
  const samePage = path === '' || path === currentPathname;
  return samePage && hash ? hash : null;
}

// Fumadocs' MDX links render through Next's `<Link>`, which updates the URL via the
// History API rather than a real navigation. That never fires `hashchange`, so a click
// listener is the only reliable way to catch same-page and client-routed anchor jumps.
export function HeadingHighlight() {
  const pathname = usePathname();
  const lastHash = useRef<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== lastHash.current) {
      lastHash.current = hash;
      highlight(hash);
    }
  }, [pathname]);

  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash.slice(1);
      lastHash.current = hash;
      if (hash) highlight(hash);
    }

    function onClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement | null)?.closest('a[href*="#"]');
      if (!anchor) return;

      const hash = readHashTarget(anchor.getAttribute('href') ?? '', window.location.pathname);
      if (!hash) return;

      lastHash.current = hash;
      requestAnimationFrame(() => highlight(hash));
    }

    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
