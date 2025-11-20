'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
  const pathname = usePathname();
  
  let activeTab: 'home' | 'search' | 'home-evaluation' = 'search';
  
  if (pathname === '/') {
    activeTab = 'home';
  } else if (pathname?.startsWith('/home-evaluation')) {
    activeTab = 'home-evaluation';
  } else if (pathname?.startsWith('/search')) {
    activeTab = 'search';
  }

  return <Navbar activeTab={activeTab} />;
}

