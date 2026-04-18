import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[10rem] font-light text-ink/[0.06] leading-none select-none">404</p>
      <h1 className="font-display text-display-md font-light text-ink -mt-8 mb-4">Page not found</h1>
      <p className="font-sans text-sm text-ink/55 max-w-sm mb-8">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved. Let&rsquo;s get you back on track.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/" className="btn-primary">Back to Home</Link>
        <Link href="/shop" className="btn-outline">Shop All</Link>
      </div>
    </div>
  );
}
