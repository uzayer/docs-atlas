import { Button as ButtonPrimitive } from "@base-ui/react/button"
import type { LucideIcon } from "lucide-react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/cn"

import { buttonVariants } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import type { IconSize } from "@/components/ui/icon"

/**
 * A square, icon-only button.
 *
 * `label` is required and becomes the accessible name. This is the whole
 * reason the component exists as a separate export: an icon-only `<Button>`
 * has no text node, so nothing stops it shipping unlabeled, and a toolbar of
 * unlabeled glyphs is unusable with a screen reader. Making the prop
 * required moves that from a review comment to a type error.
 *
 * The glyph sits one step below the square, so a 28px button carries a 16px
 * icon with 6px of breathing room on each side.
 */

type IconButtonSize = "xs" | "sm" | "md" | "lg"

/** The md square is spelled `icon` in the button ladder, not `icon-md`. */
const SQUARE_FOR_SIZE = {
  xs: "icon-xs",
  sm: "icon-sm",
  md: "icon",
  lg: "icon-lg",
} as const satisfies Record<
  IconButtonSize,
  NonNullable<VariantProps<typeof buttonVariants>["size"]>
>

const GLYPH_FOR_SIZE = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "md",
} as const satisfies Record<IconButtonSize, IconSize>

type IconButtonProps = Omit<ButtonPrimitive.Props, "children"> &
  Pick<VariantProps<typeof buttonVariants>, "variant"> & {
    icon: LucideIcon
    /** The accessible name. Required — see the note above. */
    label: string
    size?: IconButtonSize
  }

function IconButton({
  className,
  icon,
  label,
  variant = "ghost",
  size = "md",
  ...props
}: IconButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="icon-button"
      aria-label={label}
      className={cn(
        buttonVariants({ variant, size: SQUARE_FOR_SIZE[size] }),
        className
      )}
      {...props}
    >
      <Icon icon={icon} size={GLYPH_FOR_SIZE[size]} />
    </ButtonPrimitive>
  )
}

export { IconButton }
