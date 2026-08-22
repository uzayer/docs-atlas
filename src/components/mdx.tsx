import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Kbd,
    KbdGroup,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
