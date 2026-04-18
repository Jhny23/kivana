'use client';
import Link from 'next/link';
import { editorials } from '@/lib/products';
import useReveal from '@/lib/useReveal';

export default function EditorialPage() {
  const heroRef  = useReveal();
  const bodyRef  = useReveal();

  return (
    <div>
      <section className="bg-ink py-20 md:py-28" ref={heroRef}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="reveal font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-3">Editorial</p>
          <h1 className="reveal reveal-delay-1 font-display text-display-xl font-light text-cream max-w-2xl">Stories about skin, sustainability &amp; simplicity.</h1>
        </div>
      </section>

      <section className="py-16 md:py-24" ref={bodyRef}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          {/* Featured */}
          <div className="reveal grid md:grid-cols-2 gap-0 mb-16 overflow-hidden">
            <div className={`aspect-[4/3] bg-gradient-to-br ${editorials[0].gradient}`} />
            <div className="bg-cream flex flex-col justify-center px-8 md:px-14 py-12">
              <span className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve mb-3">
                {editorials[0].date} · {editorials[0].readTime}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-medium text-ink mb-4 leading-snug">
                {editorials[0].title}
              </h2>
              <p className="font-sans text-sm text-ink/60 leading-relaxed mb-7">{editorials[0].excerpt}</p>
              <Link href={`/editorial/${editorials[0].slug}`} className="btn-outline self-start">Read Article</Link>
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {editorials.slice(1).map((article, i) => (
              <Link key={article.slug} href={`/editorial/${article.slug}`} className={`reveal reveal-delay-${i + 1} group`}>
                <div className={`aspect-[4/3] mb-4 bg-gradient-to-br ${article.gradient} group-hover:opacity-90 transition-opacity`} />
                <span className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve">
                  {article.date} · {article.readTime}
                </span>
                <h3 className="font-display text-xl font-medium text-ink mt-1.5 mb-2 leading-snug group-hover:text-bark transition-colors">
                  {article.title}
                </h3>
                <p className="font-sans text-sm text-ink/55 leading-relaxed line-clamp-2">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
