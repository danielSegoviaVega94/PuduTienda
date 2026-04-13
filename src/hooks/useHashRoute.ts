import { useState, useEffect, useCallback } from 'react';

export type AdminSection = 'dashboard' | 'products' | 'boxes' | 'orders' | 'settings';

export type Route =
  | { page: 'storefront' }
  | { page: 'admin'; section: AdminSection };

const ADMIN_SECTIONS: Record<string, AdminSection> = {
  '': 'dashboard',
  'productos': 'products',
  'cajas': 'boxes',
  'pedidos': 'orders',
  'ajustes': 'settings',
};

function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');

  if (path.startsWith('admin')) {
    const sub = path.replace(/^admin\/?/, '');
    const section = ADMIN_SECTIONS[sub] ?? 'dashboard';
    return { page: 'admin', section };
  }

  return { page: 'storefront' };
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handler = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}

export function navigate(hash: string): void {
  window.location.hash = hash;
}

export function useAdminSection(): AdminSection {
  const route = useHashRoute();
  return route.page === 'admin' ? route.section : 'dashboard';
}
