export const metadata = { title: 'Privacy Policy — Kivana' };

const sections = [
  {
    heading: 'Information We Collect',
    body: 'We collect information you provide directly, such as your name, email address, and shipping details when you place an order or sign up for our newsletter. We also collect browsing data automatically through cookies and analytics tools to improve your experience.',
  },
  {
    heading: 'How We Use Your Information',
    body: 'We use your information to process and fulfil orders, communicate with you about your purchases, send promotional emails (only if you opted in), and improve our products and website. We do not sell your personal data to third parties.',
  },
  {
    heading: 'Cookies',
    body: 'Our site uses cookies to remember your preferences, understand how you navigate the site, and deliver relevant content. You can manage cookie preferences in your browser settings at any time.',
  },
  {
    heading: 'Data Retention',
    body: 'We retain your data for as long as necessary to provide you with our services and comply with legal obligations. You may request deletion of your personal data at any time by contacting us.',
  },
  {
    heading: 'Your Rights',
    body: 'Depending on your location, you may have the right to access, correct, or delete the personal data we hold about you. To exercise these rights, please contact us at hello@kivana.co.',
  },
  {
    heading: 'Changes to this Policy',
    body: 'We may update this policy from time to time. We will notify you of significant changes by email or by posting a notice on our website.',
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <section className="bg-cream py-16 md:py-24 border-b border-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-3">Legal</p>
          <h1 className="font-display text-display-lg font-light text-ink">Privacy Policy</h1>
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
