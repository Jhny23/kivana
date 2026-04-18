'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductClient({ product }) {
  const { addItem } = useCart();
  const [qty,        setQty]      = useState(1);
  const [tab,        setTab]      = useState('description');
  const [added,      setAdded]    = useState(false);
  const [activeImg,  setActiveImg] = useState(product.image || null);

  const hasImage = product.image && product.image !== '';
  const soldOut  = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 3;
  const related  = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const thumbs   = hasImage ? [...new Set([product.image, product.imageHover].filter(Boolean))] : [];

  const handleAdd = () => {
    if (soldOut) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'how-to-use',  label: 'How to Use'  },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Brand', name: 'Kivana' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: soldOut
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      url: `https://www.kivana.co/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10 font-sans text-[0.65rem] tracking-[0.12em] uppercase text-ink/40">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?cat=${product.category}`} className="hover:text-ink transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-20">

          {/* Images */}
          <div className="flex gap-4">
            {thumbs.length > 1 && (
              <div className="flex flex-col gap-2 flex-shrink-0">
                {thumbs.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(src)}
                    className={`relative w-16 h-16 overflow-hidden border-2 transition-colors ${activeImg === src ? 'border-ink' : 'border-transparent hover:border-ink/30'}`}
                  >
                    <Image src={src} alt={`${product.name} view ${i + 1}`} fill sizes="64px" className="object-cover object-center" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex-1 sticky top-24">
              <div className="relative aspect-square w-full overflow-hidden bg-cream">
                {hasImage ? (
                  <Image
                    src={activeImg || product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className={`object-cover object-center transition-all duration-500 ${soldOut ? 'opacity-60 grayscale' : ''}`}
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} ${soldOut ? 'opacity-50' : ''}`} />
                )}
                {soldOut && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-ink/80 text-cream font-sans text-[0.7rem] tracking-[0.2em] uppercase px-5 py-2">Sold Out</span>
                  </div>
                )}
                {product.badge && !soldOut && (
                  <div className="absolute top-6 left-6 bg-ink text-cream font-sans text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1.5 z-10">
                    {product.badge}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-mauve mb-2 capitalize">{product.category}</p>
            <h1 className="font-display text-display-md font-medium text-ink mb-1">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <p className={`font-sans text-xl ${soldOut ? 'text-ink/30 line-through' : 'text-ink/70'}`}>
                ${product.price.toFixed(2)} <span className="text-sm">USD</span>
              </p>
              {lowStock && (
                <span className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-bark bg-bark/10 px-2 py-1">
                  Only {product.stock} left
                </span>
              )}
              {soldOut && (
                <span className="font-sans text-[0.6rem] tracking-[0.15em] uppercase text-ink/40 bg-ink/5 px-2 py-1">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="13" height="12" viewBox="0 0 13 12" fill="none">
                  <path d="M6.5 0.5l1.4 4.1H12l-3.5 2.6 1.4 4.1-3.4-2.5-3.4 2.5 1.4-4.1L1 4.6h4.1L6.5.5z" fill="#C09891" />
                </svg>
              ))}
              <span className="font-sans text-xs text-ink/40 ml-1">(24 reviews)</span>
            </div>

            <p className="font-sans text-sm text-ink/65 leading-relaxed mb-8">{product.description}</p>

            {/* Qty + Add */}
            <div className="flex items-stretch gap-3 mb-4">
              {!soldOut && (
                <div className="flex items-center border border-ink/20">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-12 flex items-center justify-center hover:bg-cream transition-colors font-sans text-lg"
                  >−</button>
                  <span className="w-10 text-center font-sans text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                    className="w-10 h-12 flex items-center justify-center hover:bg-cream transition-colors font-sans text-lg"
                  >+</button>
                </div>
              )}
              <button
                onClick={handleAdd}
                disabled={soldOut}
                className={`flex-1 btn-primary disabled:opacity-40 disabled:cursor-not-allowed ${added ? '!bg-bark !border-bark' : ''}`}
              >
                {soldOut ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>

            {/* Notify me when back in stock */}
            {soldOut && (
              <div className="bg-cream p-4 mb-4 flex gap-2 items-center">
                <input
                  type="email"
                  placeholder="your@email.com — notify me when back"
                  className="flex-1 bg-petal border border-ink/15 px-3 py-2 font-sans text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink transition-colors"
                />
                <button className="btn-outline px-4 py-2 text-[0.6rem] whitespace-nowrap">Notify Me</button>
              </div>
            )}

            {!soldOut && product.price * qty < 95 && (
              <p className="font-sans text-xs text-mauve mb-6">
                Add ${(95 - product.price * qty).toFixed(2)} more for free shipping
              </p>
            )}

            {/* Tabs */}
            <div className="border-t border-cream pt-8">
              <div className="flex border-b border-cream mb-6">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`font-sans text-[0.65rem] tracking-[0.15em] uppercase px-4 py-2.5 border-b-2 transition-colors ${tab === t.id ? 'border-ink text-ink' : 'border-transparent text-ink/40 hover:text-ink'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="font-sans text-sm text-ink/65 leading-relaxed">
                {tab === 'description' && <p>{product.longDescription}</p>}
                {tab === 'ingredients' && <p>{product.ingredients}</p>}
                {tab === 'how-to-use'  && <p>{product.howToUse}</p>}
              </div>
            </div>

            {/* Values */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 pt-8 border-t border-cream">
              {['Cruelty-Free', 'Vegan', 'Clean Ingredients', 'Sustainable'].map(v => (
                <span key={v} className="flex items-center gap-1.5 font-sans text-[0.6rem] tracking-[0.15em] uppercase text-ink/50">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#C09891" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-light text-ink">You may also like</h2>
              <Link href="/shop" className="font-sans text-[0.65rem] tracking-[0.18em] uppercase text-ink/50 hover:text-ink transition-colors link-underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
