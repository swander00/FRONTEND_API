import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { AlertBanner } from '@/components/ui/banners/AlertBanner';
import { NavbarWrapper } from '@/components/layout/Header/NavbarWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Wander Property - Find Your Perfect Home",
  description: 'Search for properties and find your perfect home',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlertBanner />
        <NavbarWrapper />
        <main>{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

