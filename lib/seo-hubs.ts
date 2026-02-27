export interface SEONavItem {
  href: string;
  title: string;
  description: string;
}

export const SEO_HUBS: SEONavItem[] = [
  {
    href: '/errors',
    title: 'JSON Error Fixes',
    description: 'Debug parse failures, syntax issues, and invalid payload patterns quickly.',
  },
  {
    href: '/languages',
    title: 'Language-Specific JSON Guides',
    description: 'JavaScript, Python, C#, and other implementation-specific workflows.',
  },
  {
    href: '/compare',
    title: 'Tool Comparisons',
    description: 'Practical comparisons for selecting the right JSON workflow and tool.',
  },
  {
    href: '/use-cases',
    title: 'Developer Use Cases',
    description: 'Applied guides for API debugging, logs, and large file workflows.',
  },
  {
    href: '/convert',
    title: 'Conversion Playbooks',
    description: 'JSON conversion edge cases including nested CSV and schema-safe transforms.',
  },
];
