import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Mermaid } from '@/components/ui/mermaid';
import { Callout } from '@/components/mdx/callout';
import { Card, Cards } from '@/components/mdx/card';
import {
  CodeBlockPre,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from '@/components/mdx/code-block';
import { Heading } from '@/components/mdx/heading';
import { Image, Table } from '@/components/mdx/prose';

/**
 * Fumadocs' defaults, with every visible piece swapped for a standards
 * version. Props match the defaults, so content written for Fumadocs needs
 * no edits.
 */
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    pre: CodeBlockPre,
    CodeBlockTab,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    h1: (props) => <Heading as="h1" {...props} />,
    h2: (props) => <Heading as="h2" {...props} />,
    h3: (props) => <Heading as="h3" {...props} />,
    h4: (props) => <Heading as="h4" {...props} />,
    h5: (props) => <Heading as="h5" {...props} />,
    h6: (props) => <Heading as="h6" {...props} />,
    table: Table,
    img: Image,
    Callout,
    Card,
    Cards,
    Kbd,
    KbdGroup,
    Mermaid,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
