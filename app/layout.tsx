import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkyCielo — Exceptional European Homes',
  description: 'SkyCielo represents the finest residential properties across Europe. Discover homes of extraordinary character and craftsmanship.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
