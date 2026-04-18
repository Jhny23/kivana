'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const hasImage  = product.image && product.image !== '';
  const soldOut   = product.stock === 0;
  const lowStock  = product.stock > 0 && product.stock <= 3;

  return (
    <article className="product-card group relative">
      <Link href={`/product/${product.slug}`} className="block overflow-hidden relative aspect-[4/5] bg-cream">
        {hasImage ? (
          <>
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw"
              className={`img-default object-cover object-center ${soldOut ? 'opacity-60 grayscale' : ''}`} />
            <Image src={product.imageHover || product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw"
              className={`img-hover object-cover object-center ${soldOut ? 'opacity-60 grayscale' : ''}`} />
          </>
        ) : (
          <>
            <div className={`img-default absolute inset-0 bg-gradient-to-br ${product.gradient} ${soldOut ? 'opacity-50' : ''}`} />
            <div className={`img-hover absolute inset-0 bg-gradient-to-tl ${product.gradient} opacity-80 ${soldOut ? 'opacity-40' : ''}`} />
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {soldOut  && <span className="bg-ink/80 text-cream font-sans text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1">Sold Out</span>}
          {lowStock && !soldOut && <span className="bg-bark text-cream font-sans text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1">Only {product.stock} left</span>}
          {product.badge && !soldOut && <span className="bg-ink text-cream font-sans text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1">{product.badge}</span>}
        </div>

        {/* Quick Add */}
        {!soldOut && (
          <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button onClick={e => { e.preventDefault(); addItem(product); }}
              className="w-full bg-ink text-cream font-sans text-[0.65rem] tracking-[0.18em] uppercase py-3.5 hover:bg-bark transition-colors">
              Add to Cart
            </button>
          </div>
        )}

        {soldOut && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-ink/50 py-3.5 text-center">
            <span className="font-sans text-[0.65rem] tracking-[0.18em] uppercase text-cream/60">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="pt-4 pb-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className={`font-display text-xl font-medium leading-tight transition-colors ${soldOut ? 'text-ink/40' : 'text-ink group-hover:text-bark'}`}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <p className={`font-sans text-sm ${soldOut ? 'text-ink/30 line-through' : 'text-ink/60'}`}>${product.price.toFixed(2)} USD</p>
          <p className="font-sans text-[0.6rem] tracking-[0.12em] uppercase text-mauve">{product.category}</p>
        </div>
      </div>
    </article>
  );
}
