'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { products } from '@/lib/products';

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const [shopOpen,   setShopOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query,      setQuery]      = useState('');
  const [scrolled,   setScrolled]   = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const results = query.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const newest = products.slice(0, 4);

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled ? 'bg-petal/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(42,8,0,0.08)]' : 'bg-petal'
        }`}
      >
        <nav className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-[72px]">

          {/* Left: shop nav */}
          <div className="hidden md:flex items-center gap-8">
            <div
              className="relative group"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-ink flex items-center gap-1.5 py-2 link-underline">
                Shop
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`}>
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Mega dropdown */}
              <div className={`absolute top-full left-0 w-[620px] bg-petal border border-cream shadow-xl pt-8 pb-10 px-10 transition-all duration-200 ${shopOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'}`}>
                <div className="grid grid-cols-2 gap-x-12">
                  <div>
                    <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-mauve mb-5">Shop by Category</p>
                    {[
                      { href: '/shop', label: 'Shop All' },
                      { href: '/shop?cat=clean', label: 'Cleanse' },
                      { href: '/shop?cat=treat', label: 'Treat' },
                      { href: '/shop?cat=moisturize', label: 'Moisturize' },
                    ].map(l => (
                      <Link key={l.href} href={l.href} onClick={() => setShopOpen(false)} className="block font-sans text-[0.8rem] text-ink py-1.5 link-underline">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                  <div>
                    <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-mauve mb-5">Newest Arrivals</p>
                    {newest.map(p => (
                      <Link key={p.slug} href={`/product/${p.slug}`} onClick={() => setShopOpen(false)} className="block font-sans text-[0.8rem] text-ink py-1.5 link-underline">
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bestseller feature */}
                <div className="mt-8 pt-8 border-t border-cream flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-sm bg-gradient-to-br ${newest[0].gradient} flex-shrink-0`} />
                  <div>
                    <p className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve mb-0.5">Shop Our Bestseller</p>
                    <Link href={`/product/${newest[0].slug}`} onClick={() => setShopOpen(false)} className="font-display text-xl text-ink link-underline">
                      {newest[0].name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/our-story" className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-ink link-underline">Our Story</Link>
            <Link href="/editorial" className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-ink link-underline">Editorial</Link>
          </div>

          {/* Centre: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-display text-[1.75rem] md:text-[2rem] font-medium tracking-[0.12em] uppercase text-ink">
            Kivana
          </Link>

          {/* Right: icons */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(o => !o)}
              className="hidden md:flex items-center justify-center w-8 h-8 hover:opacity-60 transition-opacity"
              aria-label="Search"
            >
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M11.5 11.5L15 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center justify-center w-8 h-8 hover:opacity-60 transition-opacity"
              aria-label={`Cart (${count} items)`}
            >
              <svg width="19" height="17" viewBox="0 0 19 17" fill="none">
                <path d="M1 1h2.5l2 9h9l2-7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8" cy="15" r="1" fill="currentColor" />
                <circle cx="14" cy="15" r="1" fill="currentColor" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ink text-cream text-[0.55rem] font-sans font-medium flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden flex flex-col gap-[5px] w-8 items-end"
              aria-label="Menu"
            >
              <span className={`block h-px bg-ink transition-all duration-300 ${mobileOpen ? 'w-6 rotate-45 translate-y-[8px]' : 'w-6'}`} />
              <span className={`block h-px bg-ink transition-all duration-300 ${mobileOpen ? 'opacity-0 w-4' : 'w-4'}`} />
              <span className={`block h-px bg-ink transition-all duration-300 ${mobileOpen ? 'w-6 -rotate-45 -translate-y-[8px]' : 'w-6'}`} />
            </button>
          </div>
        </nav>

        {/* Search panel */}
        <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-40' : 'max-h-0'}`}>
          <div className="border-t border-cream px-6 md:px-10 py-4 max-w-[1400px] mx-auto">
            <div className="relative max-w-xl mx-auto">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent border-b border-ink/30 py-2 pr-8 font-sans text-sm text-ink placeholder:text-ink/40 outline-none focus:border-ink transition-colors"
              />
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="absolute right-0 top-2.5 opacity-40">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            {results.length > 0 && (
              <div className="max-w-xl mx-auto mt-3 flex flex-wrap gap-3">
                {results.map(p => (
                  <Link
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    onClick={() => { setSearchOpen(false); setQuery(''); }}
                    className="font-sans text-xs text-ink bg-cream px-3 py-1.5 hover:bg-ink hover:text-cream transition-colors"
                  >
                    {p.name} — ${p.price}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[35] bg-petal transition-transform duration-400 ease-smooth flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="flex items-center justify-between px-6 h-16 border-b border-cream">
          <span className="font-display text-2xl font-medium tracking-widest uppercase text-ink">Kivana</span>
          <button onClick={() => setMobileOpen(false)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col px-8 py-10 gap-6 flex-1 overflow-y-auto">
          {[
            { href: '/shop', label: 'Shop All' },
            { href: '/shop?cat=clean', label: 'Cleanse' },
            { href: '/shop?cat=treat', label: 'Treat' },
            { href: '/shop?cat=moisturize', label: 'Moisturize' },
            { href: '/our-story', label: 'Our Story' },
            { href: '/editorial', label: 'Editorial' },
            { href: '/faq', label: 'FAQs' },
            { href: '/contact', label: 'Contact Us' },
          ].map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="font-display text-3xl font-light text-ink tracking-wide border-b border-cream pb-4"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="px-8 pb-10">
          <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-mauve">
            Free Shipping on orders over $95
          </p>
        </div>
      </div>
    </>
  );
}
