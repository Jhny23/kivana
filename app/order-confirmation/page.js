'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

function OrderContent() {
  const searchParams = useSearchParams();
  const orderId      = searchParams.get('id');
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      // Try Supabase first if we have an ID
      if (orderId) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (data) {
          setOrder(data);
          setLoading(false);
          return;
        }
      }

      // Fall back to sessionStorage
      try {
        const saved = sessionStorage.getItem('kivana-last-order');
        if (saved) {
          setOrder(JSON.parse(saved));
        }
      } catch {}

      setLoading(false);
    }

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-ink/20 border-t-ink rounded-full animate-spin mx-auto mb-4" />
          <p className="font-sans text-sm text-ink/50">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="font-display text-3xl text-ink">No order found</p>
        <p className="font-sans text-sm text-ink/55 max-w-sm">
          Your payment may still be processing. Check your email for a confirmation, or contact us at hello@kivana.co
        </p>
        <div className="flex gap-3 flex-wrap justify-center mt-4">
          <Link href="/shop" className="btn-primary">Continue Shopping</Link>
          <Link href="/contact" className="btn-outline">Contact Us</Link>
        </div>
      </div>
    );
  }

  const isMpesa     = order.payment_method === 'mpesa';
  const orderNumber = order.id
    ? `KIV-${order.id.toString().slice(0, 8).toUpperCase()}`
    : (order.id || 'KIV-PENDING');
  const shippingDetails = order.shipping || {};
  const orderItems      = order.items    || [];

  return (
    <div className="max-w-[760px] mx-auto px-6 md:px-10 py-16 md:py-24">

      {/* Success icon */}
      <div className="flex flex-col items-center text-center mb-12">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={isMpesa ? { background: '#00A651' } : { border: '2px solid #3B6D11' }}
        >
          <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
            <path d="M2 10l7 7L24 2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-mauve mb-2">
          {isMpesa ? 'M-Pesa Payment Received' : 'Order Confirmed'}
        </p>
        <h1 className="font-display text-display-md font-light text-ink mb-3">
          Thank you, {(order.customer_name || shippingDetails.firstName || 'there').split(' ')[0]}!
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          Your order <strong className="text-ink font-medium">{orderNumber}</strong> has been placed.
          {order.customer_email && (
            <> A confirmation email has been sent to <strong className="text-ink font-medium">{order.customer_email}</strong>.</>
          )}
        </p>
      </div>

      {/* Order card */}
      <div className="bg-cream p-6 md:p-8 mb-8">

        {/* Meta */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8 pb-8 border-b border-ink/10">
          <div>
            <p className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve mb-1">Order</p>
            <p className="font-sans text-sm font-medium text-ink">{orderNumber}</p>
          </div>
          <div>
            <p className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve mb-1">Date</p>
            <p className="font-sans text-sm text-ink">
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString('en-KE', { dateStyle: 'long' })
                : order.date || new Date().toLocaleDateString('en-KE', { dateStyle: 'long' })}
            </p>
          </div>
          <div>
            <p className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve mb-1">Payment</p>
            <p className="font-sans text-sm text-ink capitalize">
              {isMpesa ? 'M-Pesa' : 'Card'}
            </p>
          </div>
        </div>

        {/* Shipping */}
        {(shippingDetails.address || shippingDetails.city) && (
          <div className="mb-8 pb-8 border-b border-ink/10">
            <p className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve mb-3">Shipping To</p>
            <p className="font-sans text-sm text-ink">{order.customer_name || `${shippingDetails.firstName} ${shippingDetails.lastName}`}</p>
            {shippingDetails.address && <p className="font-sans text-sm text-ink/65">{shippingDetails.address}{shippingDetails.apartment ? `, ${shippingDetails.apartment}` : ''}</p>}
            {shippingDetails.city && <p className="font-sans text-sm text-ink/65">{shippingDetails.city}{shippingDetails.postalCode ? `, ${shippingDetails.postalCode}` : ''}</p>}
            {shippingDetails.country && <p className="font-sans text-sm text-ink/65">{shippingDetails.country}</p>}
            <p className="font-sans text-xs text-mauve mt-2">
              {shippingDetails.method === 'express' ? 'Express · 1–3 business days' : 'Standard · 3–7 business days'}
            </p>
          </div>
        )}

        {/* Items */}
        {orderItems.length > 0 && (
          <div className="mb-8 pb-8 border-b border-ink/10">
            <p className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-mauve mb-4">Items Ordered</p>
            <ul className="space-y-4">
              {orderItems.map((item, i) => {
                const hasImg = item.image && item.image !== '';
                return (
                  <li key={i} className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-petal">
                      {hasImg
                        ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                        : <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient || 'from-[#C09891] to-[#F4D8D8]'}`} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-base font-medium text-ink">{item.name}</p>
                      <p className="font-sans text-xs text-ink/50">Qty: {item.qty}</p>
                    </div>
                    <p className="font-sans text-sm text-ink">${(item.price * item.qty).toFixed(2)}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between font-sans text-sm text-ink/60">
            <span>Subtotal</span>
            <span>${parseFloat(order.subtotal || order.subtotal || 0).toFixed(2)}</span>
          </div>
          {parseFloat(order.discount || 0) > 0 && (
            <div className="flex justify-between font-sans text-sm text-[#3B6D11]">
              <span>Discount</span>
              <span>−${parseFloat(order.discount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-sans text-sm text-ink/60">
            <span>Shipping</span>
            <span>{parseFloat(order.shipping_cost || 0) === 0 ? 'Free' : `$${parseFloat(order.shipping_cost).toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-sans text-sm text-ink/60">
            <span>VAT</span>
            <span>${parseFloat(order.tax || 0).toFixed(2)}</span>
          </div>
          <div className="border-t border-ink/10 pt-3 flex justify-between font-display text-2xl text-ink">
            <span>Total Paid</span>
            <span>${parseFloat(order.total || order.grand || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="bg-ink text-cream p-6 md:p-8 mb-8">
        <p className="font-sans text-[0.6rem] tracking-[0.22em] uppercase text-mauve mb-4">What Happens Next</p>
        <ol className="space-y-3">
          {[
            "You'll receive an order confirmation email within a few minutes.",
            "We'll pack and prepare your order within 1–2 business days.",
            "Once shipped, you'll get a tracking link via email.",
            "Your Kivana products arrive ready to glow.",
          ].map((s, i) => (
            <li key={i} className="flex gap-3 font-sans text-sm text-cream/70 leading-relaxed">
              <span className="w-5 h-5 rounded-full border border-mauve/50 flex items-center justify-center text-mauve text-[0.6rem] flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
        <Link href="/contact" className="btn-outline">Need Help?</Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-ink/20 border-t-ink rounded-full animate-spin mx-auto mb-4" />
          <p className="font-sans text-sm text-ink/50">Loading your order...</p>
        </div>
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}