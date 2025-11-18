'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
  const pathname = usePathname();
  
  const activeTab = pathname?.startsWith('/home-evaluation') 
    ? 'home-evaluation' 
    : 'search';

  return <Navbar activeTab={activeTab} />;
}

