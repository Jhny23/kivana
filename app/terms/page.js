export const metadata = { title: 'Terms of Use — Kivana' };

const sections = [
  {
    heading: 'Acceptance of Terms',
    body: 'By accessing or using the Kivana website, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, please do not use our site.',
  },
  {
    heading: 'Products and Pricing',
    body: 'We reserve the right to modify product descriptions and pricing at any time without notice. Prices shown at checkout are final. In the event of a pricing error, we will notify you and offer a cancellation or the correct price.',
  },
  {
    heading: 'Orders and Payment',
    body: 'By placing an order, you represent that you are legally capable of entering into a binding contract and are at least 18 years old. Payment is processed securely at checkout. We accept major credit cards and other payment methods as listed.',
  },
  {
    heading: 'Shipping and Returns',
    body: 'Shipping timelines are estimates and not guaranteed. For returns, unused and unopened products may be returned within 30 days. If you experience a reaction, contact us directly.',
  },
  {
    heading: 'Intellectual Property',
    body: 'All content on this website — including text, images, logos, and design — is the property of Kivana and protected by applicable intellectual property laws. You may not reproduce or redistribute our content without written permission.',
  },
  {
    heading: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, Kivana shall not be liable for any indirect, incidental, or consequential damages arising from your use of our products or website.',
  },
];

export default function TermsPage() {
  return (
    <div>
      <section className="bg-cream py-16 md:py-24 border-b border-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-3">Legal</p>
          <h1 className="font-display text-display-lg font-light text-ink">Terms of Use</h1>
          <p className="font-sans text-sm text-ink/50 mt-3">Last updated: January 2025</p>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-10 space-y-10">
          {sections.map((s, i) => (
            <div key={i} className="border-b border-cream pb-10 last:border-0">
              <h2 className="font-display text-2xl font-medium text-ink mb-3">{s.heading}</h2>
              <p className="font-sans text-sm text-ink/65 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
