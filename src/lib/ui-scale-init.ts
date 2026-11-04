/**
 * The interface scale's storage key and its pre-paint script, kept out of
 * the client module in ui-scale.tsx so the root layout (a server component)
 * can inline the script: an export of a "use client" module reaches the
 * server as a client reference, not as the string.
 *
 * The scale is CSS `zoom` on <html>, as the design package's Storybook and
 * desktop's WebView zoom apply it: the type and control scales are px, so a
 * root font size would only grow the rem spacing and the prose.
 */

export const STORAGE_KEY = 'atlas-ui-scale';

/** The package's UI_SCALE_MIN / UI_SCALE_MAX, as literals for the script. */
const MIN = 0.5;
const MAX = 2;

/** Runs before first paint, inlined into the head beside the theme script. */
export const uiScaleInitScript = `
(function () {
  try {
    var raw = parseFloat(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}) || "1");
    var v = isFinite(raw) ? Math.min(${MAX}, Math.max(${MIN}, raw)) : 1;
    if (v !== 1) document.documentElement.style.zoom = String(v);
  } catch (e) {}
})();
`;
