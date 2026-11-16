import { useSyncExternalStore } from 'react';

const read = () => (location.hash.replace(/^#/, '') || '/');
export function useRoute(): string[] {
  const path = useSyncExternalStore(
    (cb) => { addEventListener('hashchange', cb); return () => removeEventListener('hashchange', cb); },
    read,
  );
  return path.split('/').filter(Boolean);
}
export function go(path: string) {
  location.hash = path;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
