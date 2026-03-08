import { labels } from './en/labels';

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof result === 'string' ? result : path;
}

export const locale = (key: string): string => {
  return getNestedValue(labels as unknown as Record<string, unknown>, key);
};
