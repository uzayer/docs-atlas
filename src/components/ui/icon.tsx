import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/cn"

/**
 * The single seam every icon in the system passes through.
 *
 * Two rules it exists to enforce:
 *
 * 1. Icons come in five named sizes, never a raw pixel value. The desktop app
 *    let `size={n}` spread to ~960 call sites and ended up with eleven
 *    distinct icon sizes, of which 11px was somehow the most common. Naming
 *    the step is what keeps a toolbar's glyphs the same weight as the row
 *    below it.
 *
 * 2. Stroke width is 1.75, not Lucide's default 2. At 12-16px a 2px stroke
 *    closes up the counters and the glyph reads as a blob — noticeably
 *    heavier than the 500-weight text beside it.
 *
 * The sizes are Tailwind's spacing steps: xs = size-3, sm = size-3.5,
 * md = size-4, lg = size-4.5, xl = size-5.5 — rem, so they follow the
 * interface scale.
 */

export const ICON_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
} as const

/**
 * Sizes as classes, not as an SVG `size` attribute. A px attribute ignores
 * the interface scale; a rem class grows with it. The numbers above are
 * documentation of what each step is at scale 1.
 */
const ICON_CLASS: Record<IconSize, string> = {
  xs: "size-3",
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
  xl: "size-5.5",
}

export type IconSize = keyof typeof ICON_SIZES

export const ICON_STROKE_WIDTH = 1.75

type IconProps = {
  icon: LucideIcon
  size?: IconSize
  className?: string
} & Omit<React.ComponentProps<LucideIcon>, "size" | "strokeWidth" | "ref">

function Icon({ icon: Glyph, size = "md", className, ...props }: IconProps) {
  return (
    <Glyph
      data-slot="icon"
      aria-hidden="true"
      size={undefined}
      strokeWidth={ICON_STROKE_WIDTH}
      className={cn("shrink-0", ICON_CLASS[size], className)}
      {...props}
    />
  )
}

export { Icon }
