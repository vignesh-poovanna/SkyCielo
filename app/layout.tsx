import type { Metadata, Viewport } from 'next';
import './globals.css';
import EnquireModal from '@/components/EnquireModal';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'SkyCielo - Exceptional European themed properties in Bangalore',
  description: 'SkyCielo represents the finest residential properties across Bangalore. Discover homes of extraordinary character and craftsmanship.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}<EnquireModal /></body>
    </html>
  );
}
