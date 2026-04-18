'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, removeItem, updateQty, total, count, isOpen, setIsOpen } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-cream">
            <h2 className="font-display text-2xl font-medium text-ink">
              My Cart
              {count > 0 && (
                <span className="font-sans text-sm font-normal text-mauve ml-2">({count})</span>
              )}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity"
              aria-label="Close cart"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <svg width="48" height="42" viewBox="0 0 48 42" fill="none" className="opacity-20">
                  <path d="M1 1h7l6 28h24l6-21H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="39" r="2" fill="currentColor" />
                  <circle cx="35" cy="39" r="2" fill="currentColor" />
                </svg>
                <div>
                  <p className="font-display text-2xl text-ink/50">Your cart is empty</p>
                  <p className="font-sans text-xs text-ink/40 mt-1">You are one step away from a glowy skin.</p>
                </div>
                <Link href="/shop" onClick={() => setIsOpen(false)} className="btn-outline mt-2">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-6">
                {items.map(item => {
                  const hasImage = item.image && item.image !== '';
                  return (
                    <li key={item.id} className="flex gap-4 pb-6 border-b border-cream last:border-0">

                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-cream">
                        {hasImage ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover object-center"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="font-display text-lg font-medium text-ink leading-tight hover:text-bark transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex-shrink-0 opacity-40 hover:opacity-80 transition-opacity"
                            aria-label={`Remove ${item.name}`}
                          >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>

                        <p className="font-sans text-sm text-bark mt-0.5">${item.price.toFixed(2)}</p>

                        {/* Qty */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-7 h-7 border border-ink/20 flex items-center justify-center hover:border-ink transition-colors font-sans text-lg leading-none"
                          >
                            −
                          </button>
                          <span className="font-sans text-sm w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-7 h-7 border border-ink/20 flex items-center justify-center hover:border-ink transition-colors font-sans text-lg leading-none"
                          >
                            +
                          </button>
                          <span className="ml-auto font-sans text-sm text-ink">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-8 py-6 border-t border-cream">
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-sans text-[0.7rem] tracking-[0.15em] uppercase text-ink/60">Subtotal</span>
                <span className="font-display text-2xl text-ink">
                  ${total.toFixed(2)} <span className="text-sm font-sans font-normal text-ink/50">USD</span>
                </span>
              </div>
              {total < 95 && (
                <p className="font-sans text-xs text-mauve mb-4 text-center">
                  Add ${(95 - total).toFixed(2)} more for free shipping
                </p>
              )}
              <a href="/checkout" className="btn-primary w-full mb-3 text-center">Checkout</a>
              <button onClick={() => setIsOpen(false)} className="btn-outline w-full">
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
