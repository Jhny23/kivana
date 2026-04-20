import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AnnouncementBar from '@/components/AnnouncementBar';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  title: { default: 'Kivana — Authentic Skincare', template: '%s — Kivana' },
  description: 'Essential cruelty-free skincare for a glowy and healthy skin. Clean ingredients, vegan, sustainable.',
  keywords: 'skincare, cruelty-free, vegan, clean beauty, serum, cleanser, moisturizer, Kivana',
  metadataBase: new URL('https://www.kivana.co'),
  openGraph: {
    title: 'Kivana — Authentic Skincare',
    description: 'Essential cruelty-free skincare for a glowy and healthy skin.',
    type: 'website',
    images: [{ url: '/hero-bg.jpg', width: 1200, height: 630, alt: 'Kivana Skincare' }],
  },
  twitter: { card: 'summary_large_image', title: 'Kivana', description: 'Authentic skincare for glowy skin.' },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
