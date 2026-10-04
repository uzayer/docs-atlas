/**
 * Tooltip motion, owned here rather than by the library.
 *
 * `OPEN_DELAY` is the pause before a tooltip appears — long enough that
 * crossing a toolbar does not fire six of them, short enough that a
 * deliberate hover feels answered.
 *
 * `WARM_WINDOW` is the grace period after one closes during which the next
 * opens instantly. It is what makes scanning a row of icon buttons feel like
 * reading a label track rather than waiting six separate times.
 */
export const TOOLTIP_OPEN_DELAY = 300
export const TOOLTIP_WARM_WINDOW = 300

/** Out is faster than in: a tooltip should get out of the way immediately. */
export const TOOLTIP_FADE_IN_MS = 125
export const TOOLTIP_FADE_OUT_MS = 80
