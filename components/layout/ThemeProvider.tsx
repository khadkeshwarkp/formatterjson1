'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useWorkspaceStore } from '@/lib/store';
import * as gtag from '@/lib/gtag';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useWorkspaceStore((s) => s.theme);
  const pathname = usePathname();

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('black', theme === 'black');
  }, [theme]);

  // Track route changes in GA
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      gtag.pageview(pathname);
    }
  }, [pathname]);

  return <>{children}</>;
}
