import { cn } from "@/lib/cn"

/**
 * A keycap.
 *
 * Sans, not mono: at 10px a monospace glyph is wider than the cap around it,
 * and a row of shortcut hints ends up ragged. The desktop app learned this and
 * switched `<Kbd>` to `font-sans` while leaving the older CSS `.kbd` on mono.
 */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-control-xs w-fit min-w-control-xs items-center justify-center gap-1",
        "rounded-sm border border-border bg-card px-1.5",
        "font-sans text-2xs font-medium text-muted-foreground select-none",
        "[&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

/** Several keycaps that form one chord: ⌘ then K. */
function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <span
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
