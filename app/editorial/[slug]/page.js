import Link from 'next/link';
import { editorials } from '@/lib/products';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return editorials.map(e => ({ slug: e.slug }));
}

const articleContent = {
  'how-skincare-affects-climate': {
    intro: 'The skincare industry generates over 120 billion units of packaging globally every year. Most of it ends up in landfill. This is the uncomfortable truth behind many of the products lining our bathroom shelves — even the ones marketed as "natural" or "clean."',
    sections: [
      {
        heading: 'The Packaging Problem',
        body: 'Plastic is everywhere in skincare. Pumps, caps, tubes, seals — many of them mixed-material and impossible to recycle at home. The infrastructure simply doesn\'t exist to handle most of it. When brands say their packaging is "recyclable," they often mean technically recyclable, not practically recyclable.',
      },
      {
        heading: 'Ingredients and Carbon',
        body: 'It\'s not just packaging. Many synthetic ingredients require energy-intensive manufacturing processes. Certain emulsifiers, preservatives, and silicones leave traces that aquatic ecosystems struggle to break down. And the global logistics chain — from lab to warehouse to your door — adds significant carbon weight to every bottle.',
      },
      {
        heading: 'What You Can Actually Do',
        body: 'Simplify your routine. Fewer products means less packaging, lower carbon, lower cost. Choose brands who publish their sourcing and manufacturing practices. Look for PCR (post-consumer recycled) packaging, concentrated formats, and refillable systems. And don\'t underestimate the power of asking brands hard questions — consumer pressure works.',
      },
      {
        heading: 'Our Commitment',
        body: 'At Kivana, we\'re not perfect. But we\'re accountable. Every year we publish our packaging breakdown — what percentage is recycled, what percentage is recyclable, and where we\'re falling short. We\'re actively developing a refill system for our top three selling products. Progress over perfection, always.',
      },
    ],
  },
  'building-a-minimalist-routine': {
    intro: 'The skincare industry profits from complexity. The more steps, the more products, the more SKUs — the higher the average order value. But the science tells a different story: a streamlined routine, done consistently, outperforms a 12-step one followed erratically.',
    sections: [
      {
        heading: 'Start with the Basics',
        body: 'Every effective routine needs three things: a cleanser to remove what shouldn\'t be on your skin, a treatment to address your primary concern, and a moisturiser to seal it all in. That\'s it. Everything else is optional.',
      },
      {
        heading: 'Choose One Active, Use it Well',
        body: 'Vitamin C in the morning, retinol at night — you\'ve heard this. But the real key is using one active consistently for at least 8 weeks before judging results. Most people layer too many actives and wonder why their skin is irritated. Less really is more.',
      },
      {
        heading: 'Sunscreen is Non-Negotiable',
        body: 'If you use vitamin C, AHAs, retinol, or any brightening ingredient, SPF is not optional. UV is responsible for up to 80% of visible skin ageing. The most expensive serum in the world won\'t help if you\'re not protecting your skin from the sun.',
      },
    ],
  },
  'the-truth-about-clean-beauty': {
    intro: '"Clean beauty" is one of the most lucrative — and most misleading — phrases in the industry. Unlike "organic" or "cruelty-free," there is no legal or regulatory definition for "clean." Any brand can use the word on any product, with zero accountability.',
    sections: [
      {
        heading: 'What "Clean" Usually Means',
        body: 'In practice, "clean" typically refers to the absence of a subjective "no" list: parabens, sulfates, synthetic fragrances, phthalates. But the specific ingredients on that list vary wildly between brands. One brand\'s "clean" includes an ingredient another brand bans entirely.',
      },
      {
        heading: 'The Naturalistic Fallacy',
        body: 'Natural does not mean safe. Arsenic is natural. Many synthetic ingredients are more stable, more effective, and better-tested than their natural equivalents. The goal shouldn\'t be "natural vs synthetic" — it should be "safe, effective, and responsibly sourced."',
      },
      {
        heading: 'How to Actually Read a Label',
        body: 'Look for full INCI (International Nomenclature Cosmetic Ingredient) lists. Be sceptical of vague claims. Research individual ingredients on resources like the EWG Skin Deep database or Paula\'s Choice ingredient dictionary. And remember: concentration matters. An ingredient at 0.01% poses a very different risk than the same ingredient at 10%.',
      },
    ],
  },
};

export default function ArticlePage({ params }) {
  const editorial = editorials.find(e => e.slug === params.slug);
  if (!editorial) notFound();

  const content = articleContent[params.slug] || {
    intro: editorial.excerpt,
    sections: [],
  };

  return (
    <article>
      {/* Hero */}
      <div className={`aspect-[21/6] w-full bg-gradient-to-br ${editorial.gradient} min-h-[280px]`} />

      {/* Content */}
      <div className="max-w-[760px] mx-auto px-6 py-12 md:py-20">
        {/* Meta */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve">{editorial.date}</span>
          <span className="w-px h-3 bg-mauve/40" />
          <span className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve">{editorial.readTime}</span>
        </div>

        <h1 className="font-display text-display-lg font-light text-ink mb-8 leading-tight">
          {editorial.title}
        </h1>

        {/* Intro */}
        <p className="font-sans text-base text-ink/75 leading-relaxed mb-10 border-l-2 border-mauve pl-5">
          {content.intro}
        </p>

        {/* Sections */}
        <div className="space-y-10">
          {content.sections.map((section, i) => (
            <div key={i}>
              <h2 className="font-display text-2xl font-medium text-ink mb-3">{section.heading}</h2>
              <p className="font-sans text-sm text-ink/65 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Back */}
        <div className="mt-16 pt-10 border-t border-cream">
          <Link href="/editorial" className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-ink link-underline">
            ← Back to Editorial
          </Link>
        </div>
      </div>

      {/* More articles */}
      <section className="border-t border-cream py-16 md:py-20 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <h2 className="font-display text-2xl font-light text-ink mb-8">More from the editorial</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {editorials.filter(e => e.slug !== params.slug).map(article => (
              <Link key={article.slug} href={`/editorial/${article.slug}`} className="group">
                <div className={`aspect-[4/3] mb-4 bg-gradient-to-br ${article.gradient} group-hover:opacity-90 transition-opacity`} />
                <h3 className="font-display text-xl font-medium text-ink group-hover:text-bark transition-colors leading-snug">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
