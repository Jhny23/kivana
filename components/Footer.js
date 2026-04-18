import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-cream">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-3xl font-medium tracking-[0.12em] uppercase block mb-3">Kivana</span>
            <p className="font-sans text-[0.7rem] text-cream/50 leading-relaxed max-w-[200px]">Cruelty-free skincare for glowy, healthy skin.</p>
            <div className="flex items-center gap-4 mt-6">
              {[
                { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { label: 'TikTok', path: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.82 1.55V6.79a4.85 4.85 0 01-1.05-.1z' },
              ].map(s => (
                <a key={s.label} href="https://instagram.com" target="_blank" rel="noreferrer"
                  className="w-8 h-8 border border-cream/20 flex items-center justify-center hover:border-cream/60 transition-colors" aria-label={s.label}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="font-sans text-[0.58rem] tracking-[0.25em] uppercase text-cream/40 mb-5">Shop</p>
            <ul className="space-y-3">
              {[
                { href: '/shop',                    label: 'Shop All' },
                { href: '/shop?cat=clean',          label: 'Cleanse' },
                { href: '/shop?cat=treat',          label: 'Treat' },
                { href: '/shop?cat=moisturize',     label: 'Moisturize' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="font-sans text-[0.75rem] text-cream/60 hover:text-cream transition-colors link-underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover */}
          <div>
            <p className="font-sans text-[0.58rem] tracking-[0.25em] uppercase text-cream/40 mb-5">Discover</p>
            <ul className="space-y-3">
              {[
                { href: '/',            label: 'Home' },
                { href: '/our-story',   label: 'Our Story' },
                { href: '/editorial',   label: 'Editorial' },
                { href: '/faq',         label: 'FAQs' },
                { href: '/contact',     label: 'Contact Us' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="font-sans text-[0.75rem] text-cream/60 hover:text-cream transition-colors link-underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="font-sans text-[0.58rem] tracking-[0.25em] uppercase text-cream/40 mb-5">Help</p>
            <ul className="space-y-3">
              {[
                { href: '/returns',        label: 'Returns & Refunds' },
                { href: '/shipping',       label: 'Shipping Policy' },
                { href: '/faq',            label: 'FAQ' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms',          label: 'Terms of Use' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="font-sans text-[0.75rem] text-cream/60 hover:text-cream transition-colors link-underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-cream/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[0.6rem] text-cream/30 tracking-wide">© {year} Kivana. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {[
              { label: 'Clean', color: '#C09891' },
              { label: 'Vegan', color: '#C09891' },
              { label: 'Cruelty-Free', color: '#C09891' },
              { label: 'Sustainable', color: '#C09891' },
            ].map(v => (
              <span key={v.label} className="font-sans text-[0.55rem] tracking-[0.2em] uppercase text-cream/20 flex items-center gap-1">
                <span style={{ color: v.color }}>·</span> {v.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
