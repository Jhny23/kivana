'use client';
import { useEffect, useRef } from 'react';

export default function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Find all .reveal elements — either the container itself or children
    const targets = el.classList.contains('reveal')
      ? [el]
      : el.querySelectorAll('.reveal');

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || '0px 0px -40px 0px' }
    );

    targets.forEach(t => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return ref;
}
