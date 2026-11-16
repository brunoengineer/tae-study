/// <reference types="vite/client" />

// @types/react-dom is optional (not always available offline) — minimal declaration for the client entry.
declare module 'react-dom/client' {
  import type { ReactNode } from 'react';
  export interface Root { render(children: ReactNode): void; unmount(): void }
  export function createRoot(container: Element | DocumentFragment): Root;
}
