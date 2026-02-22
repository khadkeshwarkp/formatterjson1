/**
 * Category hub routes and labels for breadcrumbs and internal linking.
 * Existing tool URLs are unchanged; hubs are additive.
 */
export const HUBS = [
  { path: '/json-tools', label: 'JSON Tools' },
  { path: '/xml-tools', label: 'XML Tools' },
  { path: '/yaml-tools', label: 'YAML Tools' },
  { path: '/encoding-tools', label: 'Encoding Tools' },
  { path: '/utility-tools', label: 'Utility Tools' },
  { path: '/converters', label: 'Converters' },
] as const;

export type HubPath = (typeof HUBS)[number]['path'];

export const CATEGORY_TO_HUB: Record<string, { path: string; label: string }> = {
  json: { path: '/json-tools', label: 'JSON Tools' },
  yaml: { path: '/yaml-tools', label: 'YAML Tools' },
  xml: { path: '/xml-tools', label: 'XML Tools' },
  markup: { path: '/converters', label: 'Converters' },
  security: { path: '/converters', label: 'Converters' },
  encoding: { path: '/encoding-tools', label: 'Encoding Tools' },
  utility: { path: '/utility-tools', label: 'Utility Tools' },
};
