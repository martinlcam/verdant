import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';
import 'leaflet/dist/leaflet.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const alliance = Inter({
  variable: '--font-alliance',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Verdant | Urban Heat Intelligence',
  description:
    'Fighting urban heat islands through data-driven green infrastructure planning for Canadian cities',
  keywords: [
    'urban heat island',
    'climate resilience',
    'green infrastructure',
    'city planning',
    'heat mapping',
  ],
  authors: [{ name: 'Verdant Team' }],
  icons: {
    icon: '/favicons/LIGHT-GREEN-LOGO.svg',
  },
  openGraph: {
    title: 'Verdant | Urban Heat Intelligence',
    description: 'Fighting urban heat islands through data-driven green infrastructure planning',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${alliance.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
