import { isValidElement } from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/cn"

/**
 * The pattern-setter for every control in this system.
 *
 * Things that are deliberate here and should be copied, not re-litigated:
 *
 * - Sizes are the named control ladder (`h-control-*`), never `h-7`. The
 *   ladder is the only place a control height is written down.
 * - Hover changes `background-color` and nothing else, at `duration-fast`.
 *   An opacity modifier like `bg-primary/80` compiles to a `color-mix` that
 *   re-rasterises the glyph inside the button, which reads as a flicker.
 *   `bg-primary-hover` is a real token with a real light-mode counterpart.
 * - No focus ring. `globals.css` draws one `:focus-visible` outline for the
 *   whole system; a second ring here would render inside it.
 * - No `active:translate-y-px`. Controls in a dense UI do not bounce.
 * - Base UI has no `asChild` — pass `render` to change the element.
 *
 * DO NOT use this for navigation. `<Button render={<Link/>}>` produces an
 * anchor that Base UI then stamps with `role="button"`, so a screen reader
 * announces "button" for something that changes the page — and the link
 * affordances (open in new tab, the links rotor) go with it. A thing that
 * navigates is a link: render a real `<a>` or `<Link>` and style it with the
 * exported `buttonVariants`. That is what the export is for.
 */

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5",
    "rounded-full border border-transparent whitespace-nowrap select-none",
    "font-medium",
    // Named properties, not `transition-all`: the press scale needs a
    // transition, and animating everything would drag border-color and
    // colour along with it and make the glyph shimmer.
    "duration-fast transition-[background-color,transform] ease-out-strong",
    "active:scale-[0.99]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
    "aria-invalid:border-destructive",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** The one loud element on a screen. Use at most once per view. */
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        /** A filled but quiet control — the default for toolbars. */
        secondary:
          "bg-secondary text-foreground hover:bg-element-hover aria-expanded:bg-element-active",
        /** Bordered and transparent. Pairs with `default` as the cancel. */
        outline:
          "bg-card text-foreground ring-1 ring-foreground/15 hover:bg-element-hover aria-expanded:bg-element-active",
        /** No chrome until you touch it. Row actions, icon buttons. */
        ghost:
          "bg-transparent text-secondary-foreground hover:bg-element-hover hover:text-foreground aria-expanded:bg-element-active aria-expanded:text-foreground",
        /**
         * Tinted, not filled. A solid red button is louder than the primary
         * action on the same screen, which inverts the hierarchy on every
         * confirm dialog. The solid treatment belongs to AlertDialog's
         * confirm, where destruction genuinely is the primary action.
         */
        destructive:
          "bg-error-muted text-error hover:bg-error-muted hover:brightness-110",
        link: "bg-transparent text-foreground underline-offset-2 hover:underline",
      },
      size: {
        xs: "h-control-xs gap-1 px-1.5 text-2xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-control-sm px-2 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-control-md px-2.5 text-xs [&_svg:not([class*='size-'])]:size-4",
        lg: "h-control-lg px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
        xl: "h-control-xl px-4 text-sm [&_svg:not([class*='size-'])]:size-4.5",
        /** Square: one control height on both axes. Prefer <IconButton>. */
        icon: "size-control-md [&_svg:not([class*='size-'])]:size-4",
        "icon-xs": "size-control-xs [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-control-sm [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-control-lg [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant,
  size,
  nativeButton,
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  /**
   * Base UI warns — loudly, at runtime — when a button-role component renders
   * as something other than a real <button> while `nativeButton` is still
   * true, because that silently drops form submission and native keyboard
   * behaviour. A link-styled button is common enough (`render={<Link/>}`,
   * `render={<a/>}`) that making every call site remember the prop guarantees
   * someone forgets. Infer it from what is actually being rendered, and let
   * an explicit value win.
   */
  const rendersNativeButton =
    !isValidElement(render) || render.type === "button"

  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={nativeButton ?? rendersNativeButton}
      render={render}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
