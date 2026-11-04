'use client';

/**
 * The package components a server module renders, re-exported from one
 * client module. A server component that imports `@tryatlas/design`
 * directly reaches every "use client" module behind its barrel, and Next
 * ships all of them as client references: about half a megabyte of
 * components the docs never render. Imported here, the client bundle is
 * tree-shaken to these names.
 */
export { GoChevron, Kbd, KbdGroup, TooltipProvider } from '@tryatlas/design';
