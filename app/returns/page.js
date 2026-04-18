export const metadata = {
  title: 'Returns & Refunds — Kivana',
  description: 'Our hassle-free 30-day return policy. Learn how to return a Kivana product.',
};

const sections = [
  { heading: '30-Day Return Window', body: 'We accept returns within 30 days of your delivery date. Items must be unused, unopened, and in their original packaging. We are unable to accept returns on opened products unless they have caused an adverse reaction.' },
  { heading: 'How to Start a Return', body: 'Email us at returns@kivana.co with your order number and reason for return. We will respond within 1 business day with a prepaid return label and instructions. Do not send items back without first contacting us.' },
  { heading: 'Refund Processing', body: 'Once we receive and inspect your return, we will issue a full refund to your original payment method within 5–7 business days. You will receive an email confirmation when your refund has been processed.' },
  { heading: 'Adverse Reactions', body: "Your skin's safety is our priority. If a product has caused an unexpected reaction, please contact us immediately at hello@kivana.co — even outside the 30-day window. We will arrange a full refund or replacement and may request photos for our quality team." },
  { heading: 'Damaged or Incorrect Items', body: 'If your order arrived damaged or you received the wrong item, please contact us within 7 days of delivery with a photo. We will ship a replacement at no cost to you immediately.' },
  { heading: 'Non-Returnable Items', body: 'For hygiene reasons, opened skincare products cannot be returned unless they caused a reaction. Gift cards and promotional items marked as final sale are non-returnable.' },
  { heading: 'Exchanges', body: 'We do not currently offer direct exchanges. Please return the item for a refund and place a new order for the product you want.' },
];

export default function ReturnsPage() {
  return (
    <div>
      <section className="bg-cream py-16 md:py-24 border-b border-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-3">Policies</p>
          <h1 className="font-display text-display-lg font-light text-ink">Returns &amp; Refunds</h1>
          <p className="font-sans text-sm text-ink/50 mt-3">30-day hassle-free returns</p>
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
          <div className="bg-cream p-8 text-center">
            <h2 className="font-display text-2xl font-medium text-ink mb-2">Need to make a return?</h2>
            <p className="font-sans text-sm text-ink/60 mb-6">Our team will make it as easy as possible.</p>
            <a href="mailto:returns@kivana.co" className="btn-primary">Email returns@kivana.co</a>
          </div>
        </div>
      </section>
    </div>
  );
}
