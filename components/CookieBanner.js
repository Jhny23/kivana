'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kivana-cookie-consent');
    if (!consent) setShow(true);
  }, []);

  const accept = () => { localStorage.setItem('kivana-cookie-consent', 'accepted'); setShow(false); };
  const decline = () => { localStorage.setItem('kivana-cookie-consent', 'declined'); setShow(false); };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-cream border-t border-cream/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="font-sans text-xs text-cream/70 leading-relaxed max-w-2xl">
          We use cookies to improve your experience, analyse site traffic, and personalise content. By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.{' '}
          <a href="/privacy-policy" className="underline hover:text-cream transition-colors">Privacy Policy</a>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={decline} className="font-sans text-[0.65rem] tracking-[0.15em] uppercase px-4 py-2 border border-cream/20 text-cream/60 hover:border-cream/50 hover:text-cream transition-colors">
            Decline
          </button>
          <button onClick={accept} className="font-sans text-[0.65rem] tracking-[0.15em] uppercase px-4 py-2 bg-cream text-ink hover:bg-mauve hover:text-cream transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
