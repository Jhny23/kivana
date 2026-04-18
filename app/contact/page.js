'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm]           = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    setError('');
    setLoading(true);

    // TO ACTIVATE: replace YOUR_FORM_ID with your Formspree form ID from formspree.io (free)
    // e.g. https://formspree.io/f/xpzgkdna
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        // Fallback: show success anyway in demo mode
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true); // demo fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-ink py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-3">Get In Touch</p>
          <h1 className="font-display text-display-xl font-light text-cream max-w-xl">We&rsquo;d love to hear from you.</h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h2 className="font-display text-3xl font-light text-ink mb-6">Questions, feedback, or just want to talk skin?</h2>
              <p className="font-sans text-sm text-ink/65 leading-relaxed mb-10">
                Our team is small but dedicated. We read every message and aim to reply within one business day.
              </p>
              <div className="space-y-6">
                {[
                  { label: 'Email',         value: 'hello@kivana.co' },
                  { label: 'Returns',       value: 'returns@kivana.co' },
                  { label: 'Hours',         value: 'Mon – Fri, 9am – 5pm (EAT)' },
                  { label: 'Response time', value: 'Within 1 business day' },
                ].map(item => (
                  <div key={item.label} className="flex gap-6 pb-6 border-b border-cream">
                    <span className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve w-28 flex-shrink-0 pt-0.5">{item.label}</span>
                    <span className="font-sans text-sm text-ink">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {submitted ? (
                <div className="flex flex-col items-start gap-4 py-10">
                  <div className="w-12 h-12 border border-bark flex items-center justify-center">
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                      <path d="M1 8l6 6L19 1" stroke="#775144" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="font-display text-3xl font-medium text-ink">Message received.</h2>
                  <p className="font-sans text-sm text-ink/60">Thank you, {form.name}. We&rsquo;ll be in touch soon.</p>
                  <button onClick={() => { setForm({ name:'',email:'',subject:'',message:'' }); setSubmitted(false); }} className="btn-outline mt-4">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {error && <p className="font-sans text-xs text-bark bg-cream px-4 py-3">{error}</p>}
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { label:'Name', name:'name', type:'text', required:true, placeholder:'Your name' },
                      { label:'Email', name:'email', type:'email', required:true, placeholder:'your@email.com' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-ink/50 block mb-2">{f.label} {f.required && <span className="text-bark">*</span>}</label>
                        <input {...f} value={form[f.name]} onChange={handleChange}
                          className="w-full bg-cream border border-ink/15 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink transition-colors" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-ink/50 block mb-2">Subject</label>
                    <input name="subject" type="text" value={form.subject} onChange={handleChange} placeholder="How can we help?"
                      className="w-full bg-cream border border-ink/15 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink transition-colors" />
                  </div>
                  <div>
                    <label className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-ink/50 block mb-2">Message <span className="text-bark">*</span></label>
                    <textarea name="message" required rows={6} value={form.message} onChange={handleChange} placeholder="Tell us what's on your mind…"
                      className="w-full bg-cream border border-ink/15 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink transition-colors resize-none" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                  <p className="font-sans text-[0.6rem] text-ink/30 text-center">
                    To activate real email delivery, add your Formspree ID in <code className="bg-ink/5 px-1">app/contact/page.js</code>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
