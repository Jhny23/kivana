'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import MpesaPayment from '@/components/MpesaPayment';

const STEPS = ['Cart', 'Shipping', 'Payment'];
const VALID_COUPONS = { 'KIVANA10': 0.10, 'WELCOME15': 0.15, 'GLOW20': 0.20 };

function StepIndicator({ current }) {
  return (
    <div className="flex items-center mb-10">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center">
          <div className={`flex items-center gap-2 ${i <= current ? 'text-ink' : 'text-ink/30'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-sans text-[0.6rem] font-medium border transition-colors ${i < current ? 'bg-ink border-ink text-cream' : i === current ? 'border-ink text-ink' : 'border-ink/20 text-ink/30'}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className="font-sans text-[0.65rem] tracking-[0.12em] uppercase hidden sm:block">{s}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`w-8 md:w-16 h-px mx-3 transition-colors ${i < current ? 'bg-ink' : 'bg-ink/15'}`} />}
        </div>
      ))}
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, required, placeholder, half }) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="font-sans text-[0.6rem] tracking-[0.18em] uppercase text-ink/50 block mb-1.5">
        {label}{required && <span className="text-bark ml-0.5">*</span>}
      </label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
        className="w-full bg-cream border border-ink/15 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink transition-colors" />
    </div>
  );
}

function OrderSummary({ items, subtotal, discountAmt, shippingCost, tax, grand }) {
  return (
    <div className="bg-cream p-6 md:p-8 h-fit sticky top-24">
      <h3 className="font-display text-xl font-medium text-ink mb-6">Order Summary</h3>
      <ul className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
        {items.map(item => {
          const hasImg = item.image && item.image !== '';
          return (
            <li key={item.id} className="flex gap-3 items-start">
              <div className="relative w-14 h-14 flex-shrink-0 bg-petal overflow-hidden">
                {hasImg ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" /> : <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-ink text-cream text-[0.55rem] rounded-full flex items-center justify-center font-sans">{item.qty}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-ink font-medium line-clamp-1">{item.name}</p>
                <p className="font-sans text-xs text-ink/50 capitalize">{item.category}</p>
              </div>
              <p className="font-sans text-sm text-ink">${(item.price * item.qty).toFixed(2)}</p>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-ink/10 pt-4 space-y-2">
        <div className="flex justify-between font-sans text-sm text-ink/60"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        {discountAmt > 0 && <div className="flex justify-between font-sans text-sm text-[#3B6D11]"><span>Discount</span><span>−${discountAmt.toFixed(2)}</span></div>}
        <div className="flex justify-between font-sans text-sm text-ink/60"><span>Shipping</span><span>{shippingCost === 0 ? <span className="text-bark">Free</span> : `$${shippingCost.toFixed(2)}`}</span></div>
        <div className="flex justify-between font-sans text-sm text-ink/60"><span>VAT (16%)</span><span>${tax.toFixed(2)}</span></div>
        <div className="border-t border-ink/10 pt-3 flex justify-between font-display text-xl text-ink"><span>Total</span><span>${grand.toFixed(2)}</span></div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, clearCart } = useCart();
  const [step, setStep]           = useState(0);
  const [payMethod, setPayMethod] = useState('mpesa');
  const [coupon, setCoupon]       = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError,   setCouponError]   = useState('');
  const [shipping, setShipping]   = useState({ firstName:'',lastName:'',email:'',phone:'',address:'',apartment:'',city:'',country:'Kenya',postalCode:'',method:'standard' });
  const [payment, setPayment]     = useState({ cardName:'',cardNumber:'',expiry:'',cvc:'' });

  const discountRate = couponApplied && VALID_COUPONS[coupon.toUpperCase()] ? VALID_COUPONS[coupon.toUpperCase()] : 0;
  const discountAmt  = total * discountRate;
  const discounted   = total - discountAmt;
  const shippingCost = shipping.method === 'express' ? 15 : (discounted >= 95 ? 0 : 8);
  const tax          = discounted * 0.16;
  const grand        = discounted + shippingCost + tax;

  const applyCoupon = () => {
    if (VALID_COUPONS[coupon.toUpperCase()]) { setCouponApplied(true); setCouponError(''); }
    else setCouponError('Invalid code. Try KIVANA10, WELCOME15, or GLOW20.');
  };

  const handleShippingChange = e => setShipping(s => ({ ...s, [e.target.name]: e.target.value }));
  const handlePaymentChange  = e => {
    let v = e.target.value;
    if (e.target.name === 'cardNumber') v = v.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19);
    if (e.target.name === 'expiry')     v = v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'$1/$2').slice(0,5);
    if (e.target.name === 'cvc')        v = v.replace(/\D/g,'').slice(0,4);
    setPayment(p => ({ ...p, [e.target.name]: v }));
  };

const handleOrderComplete = async (paymentDetails) => {
  try {
    const status = paymentDetails.method === 'mpesa' ? 'pending' : 'confirmed';

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        shipping,
        payment: paymentDetails,
        subtotal: total.toFixed(2),
        discount: discountAmt.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        tax: tax.toFixed(2),
        total: grand.toFixed(2),
        status,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Something went wrong. Please try again.');
      return;
    }
    // Save to sessionStorage as fallback for confirmation page
try {
  const orderForSession = {
    id: data.orderNumber,
    date: new Date().toLocaleDateString('en-KE', { dateStyle: 'long' }),
    items,
    shipping,
    payment: paymentDetails,
    subtotal: total.toFixed(2),
    discount: discountAmt.toFixed(2),
    shippingCost: shippingCost.toFixed(2),
    tax: tax.toFixed(2),
    grand: grand.toFixed(2),
  };
  sessionStorage.setItem('kivana-last-order', JSON.stringify(orderForSession));
} catch {}

    clearCart();

    

    // For M-Pesa — redirect to confirmation using the real Supabase order ID
     // Redirect
    if (paymentDetails.method === 'mpesa') {
      router.push('/order-confirmation');
    } else {
      router.push(`/order-confirmation?id=${data.orderId}`);
    }

  } catch (err) {
    console.error('Order error:', err);
    alert('Something went wrong. Please try again.');
  }
};

  const shippingValid = shipping.firstName && shipping.lastName && shipping.email && shipping.address && shipping.city;

  if (count === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
      <p className="font-display text-3xl text-ink">Your cart is empty</p>
      <Link href="/shop" className="btn-primary">Shop All Products</Link>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10 md:py-16">
      <Link href="/" className="font-display text-2xl tracking-widest uppercase text-ink block mb-8 md:mb-12">Kivana</Link>
      <StepIndicator current={step} />

      <div className="grid md:grid-cols-[1fr_380px] gap-10 md:gap-16 items-start">
        <div>
          {/* STEP 0 */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-light text-ink mb-8">Review Your Cart</h2>
              <ul className="divide-y divide-cream mb-8">
                {items.map(item => {
                  const hasImg = item.image && item.image !== '';
                  return (
                    <li key={item.id} className="flex gap-4 py-5">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-petal overflow-hidden">
                        {hasImg ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" /> : <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />}
                      </div>
                      <div className="flex-1">
                        <p className="font-display text-lg font-medium text-ink">{item.name}</p>
                        <p className="font-sans text-xs text-ink/50 capitalize mb-1">{item.category}</p>
                        <p className="font-sans text-sm text-bark">${item.price.toFixed(2)} × {item.qty} = ${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="bg-cream p-5 mb-8">
                <p className="font-sans text-[0.65rem] tracking-[0.18em] uppercase text-ink/50 mb-3">Discount Code</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. KIVANA10" value={coupon}
                    onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError(''); setCouponApplied(false); }}
                    className="flex-1 bg-petal border border-ink/15 px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink transition-colors uppercase tracking-widest" />
                  <button onClick={applyCoupon} className="btn-outline px-5 py-2.5 whitespace-nowrap">Apply</button>
                </div>
                {couponError   && <p className="font-sans text-xs text-bark mt-2">{couponError}</p>}
                {couponApplied && <p className="font-sans text-xs text-[#3B6D11] mt-2">✓ {Math.round(discountRate*100)}% applied — saving ${discountAmt.toFixed(2)}</p>}
              </div>
              <button onClick={() => setStep(1)} className="btn-primary w-full">Continue to Shipping →</button>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-light text-ink mb-8">Shipping Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Field label="First Name"    name="firstName"  value={shipping.firstName}  onChange={handleShippingChange} required half />
                <Field label="Last Name"     name="lastName"   value={shipping.lastName}   onChange={handleShippingChange} required half />
                <Field label="Email"         name="email"      type="email" value={shipping.email}  onChange={handleShippingChange} required placeholder="you@example.com" />
                <Field label="Phone"         name="phone"      type="tel"   value={shipping.phone}  onChange={handleShippingChange} placeholder="+254 7XX XXX XXX" />
                <Field label="Street Address" name="address"   value={shipping.address}    onChange={handleShippingChange} required placeholder="Street address" />
                <Field label="Apt / Suite"   name="apartment"  value={shipping.apartment}  onChange={handleShippingChange} placeholder="Optional" />
                <Field label="City"          name="city"       value={shipping.city}       onChange={handleShippingChange} required half />
                <Field label="Postal Code"   name="postalCode" value={shipping.postalCode} onChange={handleShippingChange} half />
                <div className="col-span-2">
                  <label className="font-sans text-[0.6rem] tracking-[0.18em] uppercase text-ink/50 block mb-1.5">Country</label>
                  <select name="country" value={shipping.country} onChange={handleShippingChange}
                    className="w-full bg-cream border border-ink/15 px-4 py-3 font-sans text-sm text-ink outline-none focus:border-ink transition-colors">
                    {['Kenya','Uganda','Tanzania','Rwanda','Ethiopia','Nigeria','South Africa','United Kingdom','United States','Canada','Germany','France','Australia'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <h3 className="font-display text-lg font-medium text-ink mb-4">Shipping Method</h3>
              <div className="space-y-3 mb-8">
                {[
                  { id:'standard', label:'Standard Shipping', desc:'3–7 business days', price: discounted>=95?'Free':'$8.00' },
                  { id:'express',  label:'Express Shipping',  desc:'1–3 business days', price:'$15.00' },
                ].map(m => (
                  <label key={m.id} className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${shipping.method===m.id?'border-ink bg-cream':'border-ink/15 hover:border-ink/40'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${shipping.method===m.id?'border-ink':'border-ink/30'}`}>
                        {shipping.method===m.id && <div className="w-2 h-2 rounded-full bg-ink" />}
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium text-ink">{m.label}</p>
                        <p className="font-sans text-xs text-ink/50">{m.desc}</p>
                      </div>
                    </div>
                    <span className="font-sans text-sm text-ink">{m.price}</span>
                    <input type="radio" name="method" value={m.id} checked={shipping.method===m.id} onChange={handleShippingChange} className="sr-only" />
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-outline flex-1">← Back</button>
                <button onClick={() => setStep(2)} disabled={!shippingValid} className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed">Continue to Payment →</button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-light text-ink mb-6">Payment</h2>
              <div className="flex border-b border-cream mb-8">
                {[
                  { id:'mpesa', label:'M-Pesa', icon: <span className="w-3 h-3 rounded-full inline-block" style={{background:'#00A651'}} /> },
                  { id:'card',  label:'Card',   icon: <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><rect x=".5" y=".5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth=".9"/><path d="M0 3.5h14" stroke="currentColor" strokeWidth="1"/></svg> },
                ].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    className={`flex items-center gap-2 px-5 py-3 font-sans text-[0.65rem] tracking-[0.12em] uppercase border-b-2 transition-colors ${payMethod===m.id?(m.id==='mpesa'?'border-[#00A651]':'border-ink')+' text-ink':'border-transparent text-ink/40 hover:text-ink'}`}>
                    {m.icon}{m.label}
                  </button>
                ))}
              </div>

              {payMethod === 'mpesa' && (
                <MpesaPayment amount={grand} onSuccess={handleOrderComplete} onBack={() => setPayMethod('card')} />
              )}

              {payMethod === 'card' && (
                <div className="space-y-4">
                  <div className="bg-cream border border-mauve/30 p-3 flex gap-2.5 items-start">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0 mt-0.5"><circle cx="6.5" cy="6.5" r="5.5" stroke="#C09891" strokeWidth="1"/><path d="M6.5 4v3.5M6.5 9v.5" stroke="#C09891" strokeWidth="1" strokeLinecap="round"/></svg>
                    <p className="font-sans text-xs text-ink/60 leading-relaxed">Demo checkout. Integrate Stripe by replacing handleCardPay with <code className="bg-ink/5 px-1 text-[0.7em]">@stripe/react-stripe-js</code>.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="font-sans text-[0.6rem] tracking-[0.18em] uppercase text-ink/50 block mb-1.5">Name on Card <span className="text-bark">*</span></label>
                      <input name="cardName" value={payment.cardName} onChange={handlePaymentChange} placeholder="As on card"
                        className="w-full bg-cream border border-ink/15 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink transition-colors" />
                    </div>
                    <div className="col-span-2">
                      <label className="font-sans text-[0.6rem] tracking-[0.18em] uppercase text-ink/50 block mb-1.5">Card Number <span className="text-bark">*</span></label>
                      <input name="cardNumber" value={payment.cardNumber} onChange={handlePaymentChange} placeholder="1234 5678 9012 3456" maxLength={19}
                        className="w-full bg-cream border border-ink/15 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink transition-colors font-mono" />
                    </div>
                    <div>
                      <label className="font-sans text-[0.6rem] tracking-[0.18em] uppercase text-ink/50 block mb-1.5">Expiry <span className="text-bark">*</span></label>
                      <input name="expiry" value={payment.expiry} onChange={handlePaymentChange} placeholder="MM/YY" maxLength={5}
                        className="w-full bg-cream border border-ink/15 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink transition-colors" />
                    </div>
                    <div>
                      <label className="font-sans text-[0.6rem] tracking-[0.18em] uppercase text-ink/50 block mb-1.5">CVC <span className="text-bark">*</span></label>
                      <input name="cvc" value={payment.cvc} onChange={handlePaymentChange} placeholder="123" maxLength={4}
                        className="w-full bg-cream border border-ink/15 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none focus:border-ink transition-colors" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
                    <button onClick={() => handleOrderComplete({ method:'card', last4: payment.cardNumber.slice(-4) })}
                      disabled={!payment.cardName || payment.cardNumber.length < 19 || payment.expiry.length < 5 || payment.cvc.length < 3}
                      className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
                      Pay ${grand.toFixed(2)}
                    </button>
                  </div>
                </div>
              )}

              {payMethod === 'mpesa' && (
                <button onClick={() => setStep(1)} className="btn-outline w-full mt-4 text-[0.65rem]">← Back to Shipping</button>
              )}
            </div>
          )}
        </div>

        <OrderSummary items={items} subtotal={total} discountAmt={discountAmt} shippingCost={shippingCost} tax={tax} grand={grand} />
      </div>
    </div>
  );
}
