'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UI_SCALE_DEFAULT, UI_SCALE_STEP, clampUiScale } from '@tryatlas/design';
import { STORAGE_KEY } from './ui-scale-init';

/**
 * Interface scale.
 *
 * The design package's scales are px, so the scale is CSS `zoom` on <html>
 * rather than a root font size: type, controls, spacing and prose grow
 * together. Persisted per browser; ui-scale-init.ts applies it before first
 * paint. The control itself is the package's `UiScaleControl`.
 */

type UiScaleContextValue = {
  scale: number;
  setScale: (next: number) => void;
};

const UiScaleContext = createContext<UiScaleContextValue | null>(null);

function stored(): number {
  if (typeof window === 'undefined') return UI_SCALE_DEFAULT;
  try {
    const raw = parseFloat(localStorage.getItem(STORAGE_KEY) ?? '1');
    return Number.isFinite(raw) ? clampUiScale(raw) : UI_SCALE_DEFAULT;
  } catch {
    return UI_SCALE_DEFAULT;
  }
}

export function UiScaleProvider({ children }: { children: React.ReactNode }) {
  const [scale, setScaleState] = useState(UI_SCALE_DEFAULT);

  useEffect(() => {
    setScaleState(stored());
  }, []);

  useEffect(() => {
    document.documentElement.style.zoom = scale === 1 ? '' : String(scale);
  }, [scale]);

  const setScale = useCallback((next: number) => {
    const value = clampUiScale(next);
    setScaleState(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // Storage being blocked is not a reason to refuse to scale.
    }
  }, []);

  // ⌘⌥= / ⌘⌥- / ⌘⌥0, the same chord the desktop app and browsers use.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey) || !e.altKey) return;
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setScale(scale + UI_SCALE_STEP);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setScale(scale - UI_SCALE_STEP);
      } else if (e.key === '0') {
        e.preventDefault();
        setScale(UI_SCALE_DEFAULT);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [scale, setScale]);

  const value = useMemo(() => ({ scale, setScale }), [scale, setScale]);

  return <UiScaleContext.Provider value={value}>{children}</UiScaleContext.Provider>;
}

export function useUiScale(): UiScaleContextValue {
  const ctx = useContext(UiScaleContext);
  if (!ctx) throw new Error('useUiScale must be used inside <UiScaleProvider>');
  return ctx;
}
