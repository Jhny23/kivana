'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { products, categories, editorials, testimonials } from '@/lib/products';
import useReveal from '@/lib/useReveal';

function Testimonials() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="bg-ink py-20 md:py-28 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="relative min-h-[160px] flex items-center justify-center">
          {testimonials.map((t, i) => (
            <div key={i} className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${i === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <p className="font-display text-2xl md:text-3xl font-light text-cream leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-mauve mt-6">— {t.author}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === idx ? 'w-6 h-1.5 bg-mauve' : 'w-1.5 h-1.5 bg-cream/20 hover:bg-cream/40'}`}
              aria-label={`Testimonial ${i + 1}`} />
          ))}
        </div>
        <div className="flex items-center justify-center gap-1 mt-6">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.6 4.8H14L9.7 8.9l1.6 4.8L7 11l-4.3 2.7 1.6-4.8L0 5.8h5.4L7 1z" fill="#C09891" />
            </svg>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = e => { e.preventDefault(); if (email) setSubmitted(true); };
  return (
    <section className="border-t border-cream py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="max-w-xl mx-auto text-center">
          {submitted ? (
            <>
              <p className="font-display text-3xl text-ink">Thank you.</p>
              <p className="font-sans text-sm text-ink/60 mt-2">You&rsquo;re on the list. Expect beautifully rare updates.</p>
            </>
          ) : (
            <>
              <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-mauve mb-3">Newsletter</p>
              <h2 className="font-display text-3xl md:text-4xl text-ink mb-2">Save 10% off your order</h2>
              <p className="font-sans text-sm text-ink/60 mb-8">Subscribe and get 10% off your first order.</p>
              <form onSubmit={handleSubmit} className="flex gap-0 max-w-sm mx-auto">
                <input type="email" required placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)}
                  className="flex-1 bg-cream border border-ink/20 border-r-0 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/40 outline-none focus:border-ink transition-colors" />
                <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const heroRef      = useReveal();
  const missionRef   = useReveal();
  const featuredRef  = useReveal();
  const valuesRef    = useReveal();
  const catsRef      = useReveal();
  const editorialRef = useReveal();
  const igRef        = useReveal();

  const featured  = products.slice(0, 4);
  const editorial = editorials[0];

  return (
    <>
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-end overflow-hidden bg-ink">
        {/* Hero background image */}
        <Image
          src="/hero-bg.jpg"
          alt="Kivana skincare — glowy healthy skin"
          fill
          priority
          className="object-cover object-center opacity-60"
          sizes="100vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-16 md:pb-24 w-full relative z-10">
          <div className="max-w-3xl">
            <p className="reveal font-sans text-[0.65rem] tracking-[0.3em] uppercase text-mauve mb-5">Cruelty-Free · Vegan · Sustainable</p>
            <h1 className="reveal reveal-delay-1 font-display text-display-xl font-light text-cream leading-[1.05] mb-8">
              Essential skincare<br /><em className="not-italic font-medium">for a glowy,</em><br />healthy skin.
            </h1>
            <p className="reveal reveal-delay-2 font-sans text-sm md:text-base text-cream/70 max-w-md leading-relaxed mb-10">
              Clean ingredients. Considered formulations. Packaging with less waste. Skincare that genuinely cares — for you and the planet.
            </p>
            <div className="reveal reveal-delay-3 flex flex-wrap gap-4">
              <Link href="/shop" className="btn-light">Shop Our Products</Link>
              <Link href="/our-story" className="btn-outline !border-cream/40 !text-cream hover:!bg-cream/10">Our Story</Link>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-ink/40 backdrop-blur-sm overflow-hidden py-3 border-t border-cream/10">
          <div className="marquee-track">
            {[...Array(2)].map((_, outer) => (
              <span key={outer} className="flex items-center whitespace-nowrap">
                {['Clean Ingredients', 'Vegan', 'Sustainable', 'Cruelty-Free', 'Dermatologist Tested', 'Plastic Conscious', 'Glowy Skin'].map((t, i) => (
                  <span key={i} className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-cream/50 px-8">
                    {t} <span className="mx-2 text-mauve">·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section ref={missionRef} className="py-20 md:py-28 border-b border-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="max-w-2xl">
            <p className="reveal font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-4">Our Mission</p>
            <h2 className="reveal reveal-delay-1 font-display text-display-lg font-light text-ink leading-tight">
              We are on a mission to help you reduce plastic waste in your skincare routine. It&rsquo;s simpler than it seems.
            </h2>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section ref={featuredRef} className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product, i) => (
              <div key={product.id} className={`reveal reveal-delay-${i + 1}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="py-16 md:py-20 bg-cream border-y border-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h2 className="font-display text-display-md font-light text-ink max-w-xl leading-tight">
            Starting a skincare routine can be overwhelming. We are here to simplify it and make your skin glow.
          </h2>
          <Link href="/our-story" className="btn-outline flex-shrink-0">Our Story</Link>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section ref={valuesRef} className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-14">
            <p className="reveal font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve">What We Stand For</p>
            <Link href="/shop" className="reveal btn-outline">Shop Our Products</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '01', label: 'Clean Ingredients', desc: 'Every ingredient is chosen for a reason. No fillers, no harmful chemicals.' },
              { num: '02', label: 'Vegan',             desc: "Almost all our products are 100% vegan. We're transparent when they're not." },
              { num: '03', label: 'Sustainable',       desc: 'PCR packaging, FSC paper, and an ongoing commitment to reduce our footprint.' },
              { num: '04', label: 'Cruelty-Free',      desc: 'Leaping Bunny certified. We never test on animals, full stop.' },
            ].map((v, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} flex flex-col gap-3`}>
                <span className="font-display text-5xl font-light text-ink/10">{v.num}</span>
                <div className="w-8 h-px bg-mauve" />
                <h3 className="font-display text-xl font-medium text-ink">{v.label}</h3>
                <p className="font-sans text-sm text-ink/55 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <Testimonials />

      {/* ── CATEGORIES ── */}
      <section ref={catsRef} className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="mb-12">
            <p className="reveal font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-3">Product Categories</p>
            <h2 className="reveal reveal-delay-1 font-display text-display-md font-light text-ink">Shop by Category</h2>
            <p className="reveal reveal-delay-2 font-sans text-sm text-ink/55 mt-2 max-w-md">Our skincare products are divided into cleanse, treat, and moisturize.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <Link key={cat.slug} href={`/shop?cat=${cat.slug}`}
                className={`reveal reveal-delay-${i + 1} group relative aspect-[3/4] overflow-hidden flex items-end`}>
                <div className={`absolute inset-0 bg-gradient-to-b ${cat.gradient} transition-transform duration-700 group-hover:scale-105`} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div className="relative z-10 p-6 md:p-8">
                  <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-cream/70 mb-1">Step {i + 1}</p>
                  <h3 className="font-display text-3xl font-medium text-cream mb-2">{cat.name}</h3>
                  <p className="font-sans text-xs text-cream/75 leading-relaxed max-w-xs hidden md:block">{cat.description}</p>
                  <span className="mt-4 hidden md:inline-block font-sans text-[0.6rem] tracking-[0.18em] uppercase text-cream border-b border-cream/50 pb-0.5 group-hover:border-cream transition-colors">
                    Shop {cat.name} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL FEATURE ── */}
      <section ref={editorialRef} className="pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-0 overflow-hidden">
            <div className={`aspect-[4/3] md:aspect-auto bg-gradient-to-br ${editorial.gradient} min-h-[300px]`} />
            <div className="flex flex-col justify-center bg-cream px-8 md:px-14 py-14 md:py-0">
              <p className="reveal font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-4">From the Editorial</p>
              <h2 className="reveal reveal-delay-1 font-display text-2xl md:text-3xl font-medium text-ink leading-snug mb-4">{editorial.title}</h2>
              <p className="reveal reveal-delay-2 font-sans text-sm text-ink/60 leading-relaxed mb-8">{editorial.excerpt}</p>
              <Link href={`/editorial/${editorial.slug}`} className="reveal reveal-delay-3 btn-outline self-start">Read Article</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="py-20 md:py-28 border-y border-cream">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-6">Everybody needs a skincare routine.</p>
          <blockquote className="font-display text-display-md font-light text-ink leading-snug">
            Take good care of your skin and hydrate. If you have good, glowing skin, everything else will fall into place.
          </blockquote>
        </div>
      </section>

      {/* ── INSTAGRAM ── */}
      <section ref={igRef} className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <p className="reveal font-display text-3xl font-medium text-ink">Your skin has never looked this good!</p>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="reveal reveal-delay-1 font-sans text-[0.65rem] tracking-[0.2em] uppercase text-mauve mt-1 inline-block hover:text-bark transition-colors">
                @kivana.skincare
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {[1,2,3,4,5,6].map(i => (
              <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer"
                className={`reveal reveal-delay-${i % 4 + 1} aspect-square overflow-hidden group relative`}>
                <Image src={`/ig-${i}.jpg`} alt={`Kivana on Instagram ${i}`} fill sizes="(max-width: 768px) 33vw, 17vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-300 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <rect x="1" y="1" width="18" height="18" rx="4" stroke="white" strokeWidth="1.2" />
                    <circle cx="10" cy="10" r="4" stroke="white" strokeWidth="1.2" />
                    <circle cx="15" cy="5" r="1" fill="white" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <Newsletter />
    </>
  );
}
