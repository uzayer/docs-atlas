/**
 * The interface scale's constants and its pre-paint script, kept out of the
 * client module in ui-scale.tsx so the root layout (a server component) can
 * inline the script: an export of a "use client" module reaches the server
 * as a client reference, not as the string.
 */

export const UI_SCALE_MIN = 0.9
export const UI_SCALE_MAX = 1.4
export const UI_SCALE_STEP = 0.05
export const UI_SCALE_PRESETS = [
  { value: 0.9, label: "Compact" },
  { value: 1, label: "Default" },
  { value: 1.15, label: "Large" },
  { value: 1.3, label: "Larger" },
] as const

export const STORAGE_KEY = "atlas-ui-scale"

export function clamp(value: number): number {
  const stepped = Math.round(value / UI_SCALE_STEP) * UI_SCALE_STEP
  // Two decimals, so SSR and client serialise the same number.
  return (
    Math.round(Math.min(UI_SCALE_MAX, Math.max(UI_SCALE_MIN, stepped)) * 100) /
    100
  )
}

/** Runs before first paint, inlined into the head beside the theme script. */
export const uiScaleInitScript = `
(function () {
  try {
    var raw = parseFloat(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}) || "1");
    var v = isFinite(raw) ? Math.min(${UI_SCALE_MAX}, Math.max(${UI_SCALE_MIN}, raw)) : 1;
    document.documentElement.style.setProperty("--ui-scale", String(v));
  } catch (e) {}
})();
`

