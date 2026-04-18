export const metadata = {
  title: 'Shipping Policy — Kivana',
  description: 'Kivana shipping times, costs, and delivery information.',
};

const regions = [
  { region: 'Kenya & East Africa', standard: '2–4 business days', express: '1–2 business days', free: 'Orders over $95' },
  { region: 'Rest of Africa',      standard: '5–10 business days', express: '3–5 business days', free: 'Orders over $120' },
  { region: 'Europe',              standard: '7–14 business days', express: '3–5 business days', free: 'Orders over $150' },
  { region: 'North America',       standard: '10–14 business days', express: '5–7 business days', free: 'Orders over $150' },
  { region: 'Rest of World',       standard: '14–21 business days', express: 'Not available',     free: 'Not available' },
];

const sections = [
  { heading: 'Processing Time', body: 'All orders are processed within 1–2 business days after payment is confirmed. Orders placed on weekends or public holidays will be processed the next business day. You will receive a shipping confirmation email with a tracking number once your order has been dispatched.' },
  { heading: 'Tracking Your Order', body: 'Once your order ships, you will receive an email with a tracking link. Please allow 24 hours for the tracking information to update after you receive the confirmation. If your tracking shows no movement after 5 business days, please contact us.' },
  { heading: 'Customs & Duties', body: 'For international orders, customs duties and import taxes may apply depending on your country. These fees are the responsibility of the customer and are not included in the order total or shipping cost. We cannot control or predict these charges.' },
  { heading: 'Lost or Delayed Shipments', body: "If your order has not arrived within the estimated timeframe, please first check your tracking link. If the parcel appears stuck or lost, contact us at hello@kivana.co and we'll investigate with the carrier within 2 business days." },
  { heading: 'Incorrect Address', body: 'Please double-check your shipping address at checkout. We are not responsible for orders shipped to an incorrect address provided by the customer. If you notice an error immediately after placing your order, contact us right away — we will do our best to correct it before dispatch.' },
];

export default function ShippingPage() {
  return (
    <div>
      <section className="bg-ink py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-3">Policies</p>
          <h1 className="font-display text-display-lg font-light text-cream">Shipping Policy</h1>
        </div>
      </section>

      {/* Rates table */}
      <section className="py-16 border-b border-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <h2 className="font-display text-2xl font-light text-ink mb-8">Shipping Rates &amp; Times</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-ink/20">
                  {['Region', 'Standard', 'Express', 'Free Shipping'].map(h => (
                    <th key={h} className="text-left py-3 pr-6 font-sans text-[0.6rem] tracking-[0.18em] uppercase text-mauve">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regions.map((r, i) => (
                  <tr key={i} className="border-b border-cream">
                    <td className="py-4 pr-6 font-medium text-ink">{r.region}</td>
                    <td className="py-4 pr-6 text-ink/65">{r.standard}</td>
                    <td className="py-4 pr-6 text-ink/65">{r.express}</td>
                    <td className="py-4 pr-6 text-bark">{r.free}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
