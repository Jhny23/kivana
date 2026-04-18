'use client';
import Image from 'next/image';
import Link from 'next/link';
import useReveal from '@/lib/useReveal';

export default function OurStoryPage() {
  const heroRef    = useReveal();
  const bodyRef    = useReveal();
  const valuesRef  = useReveal();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink overflow-hidden py-24 md:py-40" ref={heroRef}>
        <div className="absolute inset-0">
          <Image src="/our-story-1.jpg" alt="Kivana story" fill className="object-cover opacity-30" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute -bottom-8 -right-8 font-display text-[20vw] font-medium text-cream/[0.03] leading-none select-none">STORY</span>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
          <p className="reveal font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-4">Our Story</p>
          <h1 className="reveal reveal-delay-1 font-display text-display-xl font-light text-cream max-w-2xl leading-tight">
            Born from a desire to do skincare differently.
          </h1>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-24 border-b border-cream" ref={bodyRef}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">
            <div>
              <h2 className="reveal font-display text-display-md font-light text-ink mb-6 leading-tight">
                We started with one simple question: why does caring for your skin have to hurt the planet?
              </h2>
              <div className="space-y-5 font-sans text-sm text-ink/65 leading-relaxed">
                <p className="reveal reveal-delay-1">Kivana began in a small kitchen in 2020, born from years of frustration with mainstream skincare. Plastic bottles piling up. Ingredient lists full of things we couldn&rsquo;t pronounce or trust. Products marketed as &ldquo;natural&rdquo; that were anything but.</p>
                <p className="reveal reveal-delay-2">Our founder, raised with a deep respect for both science and the environment, believed that truly effective skincare and sustainability were not opposing forces — they just needed to be brought together.</p>
                <p className="reveal reveal-delay-3">Every formula we create starts with the same three commitments: it must work, it must be clean, and it must leave less behind. That means rigorously vetted ingredients, minimised packaging, and full transparency about what goes into every product.</p>
              </div>
            </div>
            <div className="space-y-4 reveal reveal-delay-2">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src="/our-story-1.jpg" alt="Kivana products" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square overflow-hidden">
                  <Image src="/our-story-2.jpg" alt="Kivana skincare" fill className="object-cover" sizes="25vw" />
                </div>
                <div className="relative aspect-square overflow-hidden">
                  <Image src="/our-story-3.jpg" alt="Clean ingredients" fill className="object-cover" sizes="25vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-cream" ref={valuesRef}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="reveal font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-10">Our Commitments</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Clean Formulations',    body: "Every ingredient earns its place. We formulate without sulfates, parabens, synthetic fragrances, phthalates, or harsh alcohols. What we put in is backed by science. What we leave out is just as intentional." },
              { title: 'Plastic Accountability', body: "We are not going to pretend we have solved packaging. But we are actively reducing it. Our containers use post-consumer recycled materials, and we are rolling out refillable formats across our top sellers." },
              { title: 'True Transparency',     body: "We believe you deserve to know exactly what you are putting on your skin. Full ingredient lists, honest percentages, and no vague marketing claims. If we can't explain it plainly, we don't use it." },
            ].map((v, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1}`}>
                <span className="font-display text-6xl font-light text-ink/10">0{i + 1}</span>
                <div className="w-8 h-px bg-mauve my-4" />
                <h3 className="font-display text-2xl font-medium text-ink mb-3">{v.title}</h3>
                <p className="font-sans text-sm text-ink/60 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-display-md font-light text-ink mb-8">Ready to start your routine?</h2>
          <Link href="/shop" className="btn-primary">Shop All Products</Link>
        </div>
      </section>
    </div>
  );
}
