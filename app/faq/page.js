'use client';
import { useState } from 'react';
import { faqs } from '@/lib/products';

export default function FAQPage() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <section className="bg-cream py-20 md:py-28 border-b border-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-3">Support</p>
          <h1 className="font-display text-display-xl font-light text-ink max-w-xl">Frequently Asked Questions</h1>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <ul className="divide-y divide-cream">
            {faqs.map((faq, i) => (
              <li key={i}>
                <button className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                  <span className="font-display text-xl font-medium text-ink leading-snug">{faq.question}</span>
                  <span className={`flex-shrink-0 w-8 h-8 border border-ink/20 flex items-center justify-center transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div className={`accordion-content ${open === i ? 'open' : ''}`}>
                  <p className="font-sans text-sm text-ink/65 leading-relaxed pb-6">{faq.answer}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-16 bg-cream p-8 md:p-10 text-center">
            <h2 className="font-display text-2xl font-medium text-ink mb-2">Still have questions?</h2>
            <p className="font-sans text-sm text-ink/60 mb-6">Our team is happy to help. Reach out and we&rsquo;ll get back to you within 24 hours.</p>
            <a href="/contact" className="btn-primary">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
