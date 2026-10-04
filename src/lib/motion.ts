/**
 * The motion vocabulary, as constants `motion` can take directly.
 *
 * Three springs, one ease, one stagger. These numbers are what make the chrome feel like one object rather than a set of
 * components that each picked their own curve.
 *
 *   SPRING_RAIL       the sidebar changing width, the dock opening
 *   SPRING_INDICATOR  a segmented pill or underline sliding between options
 *   SPRING_PILL       the sidebar's active row sliding between destinations
 *   EASE_PANEL        a panel entering; the CSS `--ease-out-strong` in array form
 */

export const SPRING_RAIL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
} as const
export const SPRING_DOCK = {
  type: "spring",
  stiffness: 380,
  damping: 40,
} as const
export const SPRING_INDICATOR = {
  type: "spring",
  stiffness: 520,
  damping: 38,
} as const
export const SPRING_PILL = {
  type: "spring",
  stiffness: 560,
  damping: 42,
} as const

export const EASE_PANEL = [0.22, 1, 0.36, 1] as const

/** Panels stagger down a page at these delays. Index by position. */
export const PANEL_STAGGER = [0, 0.05, 0.1, 0.15, 0.2, 0.25] as const

export const PANEL_ENTER = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
} as const
