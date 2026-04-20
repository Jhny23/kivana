'use client';
import { useState, useEffect, useRef } from 'react';

const MPESA_GREEN = '#00A651';

// M-Pesa STK Push — mirrors the real Safaricom Daraja API flow.
// Credentials needed: MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY

export default function MpesaPayment({ amount, onSuccess, onBack }) {
  const [phone,     setPhone]     = useState('');
  const [stage,     setStage]     = useState('input'); // input | pushing | waiting | success | failed
  const [countdown, setCountdown] = useState(60);
  const [checkoutId, setCheckoutId] = useState('');
  const [error,     setError]     = useState('');
  const timerRef = useRef(null);
  const pollRef  = useRef(null);

  // Format phone as user types: 07XX XXX XXX
  const handlePhone = e => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.startsWith('254')) v = '0' + v.slice(3);
    if (v.startsWith('7') || v.startsWith('1')) v = '0' + v;
    v = v.slice(0, 10);
    let formatted = v;
    if (v.length > 6) formatted = v.slice(0, 4) + ' ' + v.slice(4, 7) + ' ' + v.slice(7);
    else if (v.length > 4) formatted = v.slice(0, 4) + ' ' + v.slice(4);
    setPhone(formatted);
    setError('');
  };

  const validatePhone = raw => {
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 10) return false;
    return /^(07|01)/.test(digits);
  };

  const formatForDaraja = raw => {
    const digits = raw.replace(/\D/g, '');
    return '254' + digits.slice(1); // 0712345678 → 254712345678
  };

  const initiatePayment = async () => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid Safaricom number (07XX or 01XX)');
      return;
    }
    setStage('pushing');
    setError('');

    try {
      const kesAmount = Math.ceil(amount * 130);

      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formatForDaraja(phone),
          amount: kesAmount,
          orderReference: 'Kivana-' + Date.now(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutRequestId) {
        setStage('failed');
        setError(data.error || 'Failed to send payment request. Please try again.');
        return;
      }

      setCheckoutId(data.checkoutRequestId);
      setStage('waiting');
      setCountdown(60);
      startPolling(data.checkoutRequestId);

    } catch (err) {
      setStage('failed');
      setError('Network error. Please try again.');
    }
  };

  const startPolling = (checkoutRequestId) => {
    let attempts = 0;
    const maxAttempts = 20; // 60s / 3s

    pollRef.current = setInterval(async () => {
      attempts++;

      try {
        const res = await fetch(`/api/mpesa/query?checkoutRequestId=${checkoutRequestId}`);
        const data = await res.json();

        console.log('Poll result:', data);

if (data.status === 'confirmed') {
  clearInterval(pollRef.current);
  clearInterval(timerRef.current);
  setStage('success');
  setTimeout(() => {
    onSuccess({
      method: 'mpesa',
      checkoutId: checkoutRequestId,
      orderId: data.orderId || null,
      amount,
    });
  }, 1500);
}

        if (data.status === 'failed' || data.status === 'cancelled') {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setStage('failed');
          setError(
            data.status === 'cancelled'
              ? 'Payment was cancelled. Please try again.'
              : 'Payment failed. Please try again.'
          );
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setStage('failed');
          setError('Payment timed out. Please try again.');
        }

      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);
  };

  // Countdown timer while waiting
  useEffect(() => {
    if (stage !== 'waiting') return;
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          setStage('failed');
          setError('Payment request timed out. Please try again.');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stage]);

  const retry = () => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
    setStage('input');
    setCountdown(60);
    setError('');
  };

  const KES = (usd) => `KES ${Math.round(usd * 130).toLocaleString()}`;

  return (
    <div className="max-w-sm mx-auto">

      {/* M-Pesa header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: MPESA_GREEN }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3c.83 0 1.5.67 1.5 1.5S10.83 8 10 8s-1.5-.67-1.5-1.5S9.17 5 10 5zm2 9H8v-1h1.5V9H8V8h3v5h1v1z" fill="white"/>
          </svg>
        </div>
        <div>
          <p className="font-sans font-medium text-sm text-ink">M-Pesa</p>
          <p className="font-sans text-xs text-ink/50">Lipa na M-Pesa · Safaricom</p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-display text-xl text-ink">{KES(amount)}</p>
          <p className="font-sans text-xs text-ink/40">${amount.toFixed(2)} USD</p>
        </div>
      </div>

      {/* INPUT STAGE */}
      {stage === 'input' && (
        <div className="space-y-4">
          <div className="bg-[#F0FBF4] border border-[#00A651]/20 p-3 rounded-sm">
            <p className="font-sans text-xs text-[#00A651] leading-relaxed">
              Enter your M-Pesa registered phone number. You will receive an STK push notification to enter your PIN.
            </p>
          </div>
          <div>
            <label className="font-sans text-[0.6rem] tracking-[0.18em] uppercase text-ink/50 block mb-1.5">
              M-Pesa Phone Number <span className="text-bark">*</span>
            </label>
            <div className="flex items-center border border-ink/20 focus-within:border-ink transition-colors bg-cream">
              <span className="font-sans text-sm text-ink/50 pl-3 pr-2 flex-shrink-0">🇰🇪 +254</span>
              <input
                type="tel"
                value={phone}
                onChange={handlePhone}
                placeholder="0712 345 678"
                maxLength={12}
                className="flex-1 bg-transparent px-2 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none"
              />
            </div>
            {error && <p className="font-sans text-xs text-bark mt-1.5">{error}</p>}
            <p className="font-sans text-[0.6rem] text-ink/35 mt-1">Safaricom numbers only: 07XX or 01XX</p>
          </div>

          <div className="border-t border-cream pt-4 space-y-1.5">
            <div className="flex justify-between font-sans text-xs text-ink/50">
              <span>Amount</span><span>{KES(amount)}</span>
            </div>
            <div className="flex justify-between font-sans text-xs text-ink/50">
              <span>Transaction fee</span><span>KES 0</span>
            </div>
            <div className="flex justify-between font-sans text-sm font-medium text-ink border-t border-cream pt-2 mt-2">
              <span>Total</span><span>{KES(amount)}</span>
            </div>
          </div>

          <button
            onClick={initiatePayment}
            className="w-full py-3.5 font-sans text-[0.7rem] tracking-[0.15em] uppercase text-white font-medium transition-opacity hover:opacity-90"
            style={{ background: MPESA_GREEN }}
          >
            Send STK Push
          </button>
          <button onClick={onBack} className="w-full btn-outline text-[0.7rem]">Use Card Instead</button>
        </div>
      )}

      {/* PUSHING STAGE */}
      {stage === 'pushing' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center" style={{ background: MPESA_GREEN }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="animate-spin">
              <circle cx="14" cy="14" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
              <path d="M14 4a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="font-display text-xl text-ink">Sending request…</p>
          <p className="font-sans text-sm text-ink/55">Initiating STK push to {phone}</p>
        </div>
      )}

      {/* WAITING STAGE */}
      {stage === 'waiting' && (
        <div className="text-center space-y-5">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: MPESA_GREEN + '20' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: MPESA_GREEN }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M7 3h14a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="white" strokeWidth="1.5"/>
                  <circle cx="14" cy="22" r="1" fill="white"/>
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: MPESA_GREEN }} />
          </div>

          <div>
            <p className="font-display text-2xl text-ink mb-1">Check your phone</p>
            <p className="font-sans text-sm text-ink/60 leading-relaxed">
              An M-Pesa prompt has been sent to<br />
              <strong className="text-ink">{phone}</strong>
            </p>
          </div>

          <div className="bg-[#F0FBF4] border border-[#00A651]/20 p-4 text-left space-y-1">
            <p className="font-sans text-xs font-medium text-[#00A651]">On your phone:</p>
            <p className="font-sans text-xs text-ink/60">1. A pop-up will appear on your screen</p>
            <p className="font-sans text-xs text-ink/60">2. Enter your M-Pesa PIN</p>
            <p className="font-sans text-xs text-ink/60">3. Press OK to confirm payment of {KES(amount)}</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
                <circle
                  cx="24" cy="24" r="20" fill="none"
                  stroke={MPESA_GREEN} strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - countdown / 60)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-sans text-xs font-medium text-ink">
                {countdown}s
              </span>
            </div>
            <p className="font-sans text-sm text-ink/50">Waiting for PIN…</p>
          </div>

          <div className="flex gap-2">
            <button onClick={retry} className="flex-1 btn-outline text-[0.65rem]">Cancel</button>
            <button onClick={initiatePayment} className="flex-1 font-sans text-[0.65rem] tracking-[0.15em] uppercase py-2.5 text-white transition-opacity hover:opacity-90" style={{ background: MPESA_GREEN }}>
              Resend Push
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS STAGE */}
      {stage === 'success' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: MPESA_GREEN }}>
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <path d="M2 11l8 8L26 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-display text-2xl text-ink">Payment Confirmed!</p>
          <p className="font-sans text-sm text-ink/60">{KES(amount)} received from {phone}</p>
          <p className="font-sans text-xs text-ink/35 font-mono">{checkoutId}</p>
        </div>
      )}

      {/* FAILED STAGE */}
      {stage === 'failed' && (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-bark/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke="#775144" strokeWidth="1.5"/>
              <path d="M11 7v5M11 14.5v.5" stroke="#775144" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="font-display text-xl text-ink">Payment Failed</p>
          {error && <p className="font-sans text-sm text-bark">{error}</p>}
          <button onClick={retry} className="btn-primary w-full">Try Again</button>
          <button onClick={onBack} className="w-full btn-outline">Use Card Instead</button>
        </div>
      )}
    </div>
  );
}