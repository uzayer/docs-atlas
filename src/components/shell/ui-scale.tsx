"use client"

import { MinusIcon, PlusIcon, TypeIcon } from "lucide-react"
import { cn } from "@/lib/cn"

import {
  UI_SCALE_MAX,
  UI_SCALE_MIN,
  UI_SCALE_PRESETS,
  useUiScale,
} from "@/lib/ui-scale"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/**
 * The interface-scale control. Lives in the topbar cluster and the sidebar
 * footer.
 *
 * Preview glyphs are sized with type-scale classes, not an inline
 * `fontSize` — partly the ratchet, mostly because the preview should show
 * the real steps the scale moves through.
 */
const PREVIEW_CLASS = ["text-xs", "text-sm", "text-md", "text-lg"] as const

function UiScaleControl({
  className,
  iconOnly = false,
}: {
  className?: string
  /** Just the glyph, for a tight toolbar; the percentage stays in the label. */
  iconOnly?: boolean
}) {
  const { scale, setScale, step, reset } = useUiScale()
  const pct = Math.round(scale * 100)

  return (
    <Popover>
      <PopoverTrigger
        render={
          iconOnly ? (
            <IconButton
              icon={TypeIcon}
              label={`Interface scale, ${pct}%`}
              size="sm"
              className={className}
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className={cn("gap-1.5 text-muted-foreground", className)}
              aria-label={`Interface scale, ${pct}%`}
            >
              <TypeIcon />
              <span className="text-3xs tnum">{pct}%</span>
            </Button>
          )
        }
      />
      <PopoverContent align="end" className="w-58 gap-0 p-0">
        <div className="flex flex-col gap-0.5 px-3 pt-3 pb-2">
          <span className="text-xs font-medium">Interface scale</span>
          <span className="text-2xs text-muted-foreground">
            Everything grows together: type, controls, spacing.
          </span>
        </div>

        <div className="flex items-center gap-2 border-t border-hairline px-3 py-2">
          <IconButton
            icon={MinusIcon}
            label="Smaller"
            size="sm"
            variant="outline"
            disabled={scale <= UI_SCALE_MIN}
            onClick={() => step(-1)}
          />
          <span className="flex-1 text-center text-xs font-medium tnum">
            {pct}%
          </span>
          <IconButton
            icon={PlusIcon}
            label="Larger"
            size="sm"
            variant="outline"
            disabled={scale >= UI_SCALE_MAX}
            onClick={() => step(1)}
          />
        </div>

        <div className="flex flex-col gap-px border-t border-hairline p-1">
          {UI_SCALE_PRESETS.map((preset, i) => {
            const active = Math.abs(preset.value - scale) < 0.001
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => setScale(preset.value)}
                className={cn(
                  "flex h-7 items-center gap-2 rounded-md px-2 text-left text-xs",
                  "duration-fast transition-colors ease-out-strong",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-element-hover hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "w-5 text-center leading-none font-semibold",
                    PREVIEW_CLASS[i]
                  )}
                >
                  A
                </span>
                <span className="flex-1">{preset.label}</span>
                <span className="text-3xs text-muted-foreground tnum">
                  {Math.round(preset.value * 100)}%
                </span>
              </button>
            )
          })}
        </div>

        <div className="border-t border-hairline p-1">
          <Button variant="ghost" size="sm" className="w-full" onClick={reset}>
            Reset to default
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { UiScaleControl }
