import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';
import 'leaflet/dist/leaflet.css';

const alliance = localFont({
  src: './fonts/Alliance No.2 Regular.otf',
  variable: '--font-alliance',
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
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${alliance.variable} antialiased font-alliance`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
