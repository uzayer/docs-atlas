import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cn } from "@/lib/cn"

import {
  TOOLTIP_OPEN_DELAY,
  TOOLTIP_WARM_WINDOW,
} from "@/components/ui/tooltip-timing"

/**
 * A tooltip.
 *
 * Inverted: the foreground ink as the fill and the page colour as the text —
 * a dark chip with white text on the light theme, a light chip with black
 * text on the dark one — so a label never blends into the surface it
 * floats over.
 *
 * `arrow` adds a notch pointing at the trigger. Use it where the label
 * stands in for text that is missing — a collapsed rail's icons — so the
 * tip reads as attached to its row rather than floating near it.
 *
 * Timing comes from `tooltip-timing.ts`. See the note there about the warm
 * window; it is the difference between a usable icon toolbar and an unusable
 * one.
 */

function TooltipProvider({
  delay = TOOLTIP_OPEN_DELAY,
  closeDelay = 0,
  timeout = TOOLTIP_WARM_WINDOW,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      closeDelay={closeDelay}
      timeout={timeout}
      {...props}
    />
  )
}

const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  arrow = false,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    /** The bordered-notch variant; see above. */
    arrow?: boolean
  }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        // The notch sticks out 8px; leave room for it.
        sideOffset={
          arrow && typeof sideOffset === "number" ? sideOffset + 4 : sideOffset
        }
        className="isolate z-tooltip"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5",
            "rounded-md bg-foreground text-background shadow-md",
            arrow ? "px-2.5 py-1 text-xs" : "px-2 py-1 text-2xs",
            "text-balance",
            // A keycap inside a tooltip drops its own border — the tooltip
            // already has one, and two hairlines 2px apart read as a smudge.
            "has-data-[slot=kbd]:pr-1 **:data-[slot=kbd]:border-transparent",
            // …and takes the inverted ink, so it is not a card-coloured
            // chip sitting on the inverted fill.
            "**:data-[slot=kbd]:bg-background/15 **:data-[slot=kbd]:text-background/75",
            "data-open:animate-scale-in data-closed:animate-scale-out",
            className
          )}
          {...props}
        >
          {children}
          {arrow && (
            <TooltipPrimitive.Arrow
              className={cn(
                "flex",
                "data-[side=top]:-bottom-2",
                "data-[side=bottom]:-top-2 data-[side=bottom]:rotate-180",
                "data-[side=right]:-left-3.25 data-[side=right]:rotate-90",
                "data-[side=left]:-right-3.25 data-[side=left]:-rotate-90"
              )}
            >
              <ArrowSvg />
            </TooltipPrimitive.Arrow>
          )}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

/**
 * The notch, pointing down (the `top` side); the Arrow rotates it for the
 * others. Filled in the tooltip's own ink, so notch and chip are one shape.
 */
function ArrowSvg() {
  return (
    <svg
      width="20"
      height="10"
      viewBox="0 0 20 10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V0H0V2H1.4651C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z"
        className="fill-foreground"
      />
      <path
        d="M11.1363 8.14124C10.3757 8.82575 9.22111 8.82578 8.46041 8.14122L3.60361 3.77011C3.05281 3.27432 2.33791 2.99999 1.59681 2.99999L4.24171 3L9.12941 7.39793C9.50971 7.7402 10.087 7.7402 10.4674 7.39793L15.3544 3L18 2.99999C17.2589 2.99999 16.544 3.27432 15.9931 3.77011L11.1363 8.14124Z"
        className="fill-foreground"
      />
      <path
        d="M9.6667 6.65461L14.5235 2.28352C15.4416 1.45721 16.6331 1 17.8683 1H20V2H17.8683C16.8801 2 15.9269 2.36577 15.1924 3.02682L10.3356 7.39793C9.9553 7.74021 9.378 7.7402 8.9977 7.39793L4.1409 3.02682C3.4064 2.36577 2.4532 2 1.4651 2H0V1H1.4651C2.7002 1 3.8917 1.45722 4.8099 2.28352L9.6667 6.65461Z"
        className="fill-foreground"
      />
    </svg>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
