'use client';
import { useState, useEffect } from 'react';

const messages = [
  'Free Shipping on all orders over $95',
  'Clean · Vegan · Sustainable · Cruelty-Free',
  'New arrivals now in stock',
  'Use code KIVANA10 for 10% off your first order',
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [index,   setIndex]   = useState(0);
  const [fading,  setFading]  = useState(false);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex(i => (i + 1) % messages.length);
        setFading(false);
      }, 300);
    }, 4000);
    return () => clearInterval(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="bg-ink text-cream relative overflow-hidden">
      <div className="flex items-center justify-center py-2.5 px-12">
        <p
          className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-center transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {messages[index]}
        </p>

        {/* Prev */}
        <button
          onClick={() => setIndex(i => (i - 1 + messages.length) % messages.length)}
          className="absolute left-4 opacity-40 hover:opacity-100 transition-opacity p-1"
          aria-label="Previous message"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={() => setIndex(i => (i + 1) % messages.length)}
          className="absolute right-8 opacity-40 hover:opacity-100 transition-opacity p-1"
          aria-label="Next message"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dismiss */}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-2 opacity-40 hover:opacity-100 transition-opacity p-1"
          aria-label="Dismiss"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1 pb-1.5">
        {messages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all duration-300 ${i === index ? 'w-4 h-1 bg-mauve' : 'w-1 h-1 bg-cream/20'}`}
            aria-label={`Message ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
