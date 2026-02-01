import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Alliance No 2 font
const alliance = localFont({
  src: [
    {
      path: '../public/fonts/Alliance No.2 Regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-alliance',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
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
