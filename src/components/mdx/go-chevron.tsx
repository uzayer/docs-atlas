import { cn } from '@/lib/cn';

/**
 * Ported from standards. A chevron that says "this opens something". When
 * its trigger (any ancestor with `group/go`) is hovered, the chevron shifts
 * forward and its arms spread into an arrow. The motion values are tokens
 * (`--learn-*`, tokens.css). Hover-only, and reduced motion drops it.
 */
function GoChevron({ className }: { className?: string }) {
  const arm = cn(
    'origin-[10px_8px] [transform-box:view-box] [vector-effect:non-scaling-stroke]',
    'transition-transform duration-(--learn-out) ease-(--learn-ease)',
    'group-hover/go:duration-(--learn-in) motion-reduce:transition-none',
  );
  return (
    <span
      aria-hidden="true"
      data-slot="go-chevron"
      className={cn(
        'inline-flex shrink-0 transition-transform duration-(--learn-out) ease-(--learn-ease)',
        'group-hover/go:translate-x-(--learn-shift) group-hover/go:duration-(--learn-in)',
        'motion-reduce:transition-none',
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="overflow-visible"
      >
        <path d="M6 4L10 8" className={cn(arm, 'group-hover/go:rotate-(--learn-spread)')} />
        <path d="M10 8L6 12" className={cn(arm, 'group-hover/go:-rotate-(--learn-spread)')} />
      </svg>
    </span>
  );
}

export { GoChevron };
