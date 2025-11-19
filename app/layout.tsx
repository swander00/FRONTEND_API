import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { AlertBanner } from '@/components/ui/banners/AlertBanner';
import { NavbarWrapper } from '@/components/layout/Header/NavbarWrapper';
import { GoogleOneTapProvider } from '@/components/auth/GoogleOneTapProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "PropertyHub's - Canada's #1 Real Estate Platform",
  description: 'Search for properties in Canada',
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
        <GoogleOneTapProvider>
          <AlertBanner />
          <NavbarWrapper />
          <main>{children}</main>
          <Analytics />
        </GoogleOneTapProvider>
      </body>
    </html>
  );
}

