import type { IndexData, ManagedStore, TermsStore, UsageRef } from './types';

export type Entry = {
  id: string; text: string; implementation: 'managed' | 'hardcoded' | 'dynamic';
  path?: string; usage: UsageRef[]; shared?: boolean; review?: boolean; metadata?: any;
};

function flatten(value: unknown, prefix = ''): Array<{ path: string; text: string }> {
  if (typeof value === 'string') return [{ path: prefix, text: value }];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value).flatMap(([key, child]) => flatten(child, prefix ? `${prefix}.${key}` : key));
}

export function buildCatalog(managed: ManagedStore, terms: TermsStore, usage: IndexData): Entry[] {
  const ignored = new Set(['product_name', 'deprecated_terms', 'page_overrides']);
  const managedEntries = flatten(managed)
    .filter(item => !ignored.has(item.path.split('.')[0]))
    .map(item => {
      const refs = usage.managed[item.path] || [];
      return { id: `managed:${item.path}`, text: item.text, path: item.path, implementation: 'managed' as const, usage: refs, shared: refs.length > 1 };
    });
  const termEntries = Object.entries(terms)
    .filter(([key, value]) => key !== 'guidelines' && value && typeof value === 'object' && typeof value.text === 'string')
    .filter(([, value]) => !managedEntries.some(entry => entry.text.toLowerCase() === value.text.toLowerCase()))
    .map(([key, value]) => ({ id: `term:${key}`, text: value.text, path: key, implementation: 'managed' as const, usage: [], metadata: value }));
  const hardcoded = usage.hardcoded.map((item, i) => ({ id: `hardcoded:${i}:${encodeURIComponent(item.text)}`, text: item.text, implementation: 'hardcoded' as const, usage: [item] }));
  const dynamic = usage.dynamic.map((item, i) => ({ id: `dynamic:${i}`, text: item.parts.join(' '), implementation: 'dynamic' as const, usage: [item], review: item.confidence === 'review' }));
  return [...managedEntries, ...termEntries, ...hardcoded, ...dynamic];
}
