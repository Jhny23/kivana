import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order) {
  const { customer_name, customer_email, items, shipping, total, id } = order;
  const orderNumber = `KIV-${id.slice(0, 8).toUpperCase()}`;
  const firstName = customer_name.split(' ')[0];

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #F4D8D8;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:56px;vertical-align:top;">
              <div style="width:48px;height:48px;background:linear-gradient(135deg,#C09891,#F4D8D8);border-radius:4px;"></div>
            </td>
            <td style="padding-left:14px;vertical-align:top;">
              <p style="margin:0 0 2px;font-family:Georgia,serif;font-size:15px;color:#2A0800;">${item.name}</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;letter-spacing:1px;text-transform:uppercase;">Qty: ${item.qty}</p>
            </td>
            <td style="vertical-align:top;text-align:right;">
              <p style="margin:0;font-family:Georgia,serif;font-size:15px;color:#2A0800;">$${(item.price * item.qty).toFixed(2)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Order Confirmed — Kivana</title>
</head>
<body style="margin:0;padding:0;background-color:#F9EDEA;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9EDEA;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#2A0800;padding:40px 48px 36px;text-align:center;">
              <h1 style="margin:0 0 4px;font-family:Georgia,serif;font-size:26px;font-weight:400;letter-spacing:10px;text-transform:uppercase;color:#F4D8D8;">KIVANA</h1>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C09891;">Cruelty-Free Skincare</p>
            </td>
          </tr>

          <!-- Hero band -->
          <tr>
            <td style="background:#775144;padding:28px 48px;text-align:center;">
              <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#F4D8D8;opacity:0.8;">Order Confirmed</p>
              <h2 style="margin:0 0 4px;font-family:Georgia,serif;font-size:30px;font-weight:300;color:#F9EDEA;">Thank you, ${firstName}.</h2>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#C09891;letter-spacing:2px;">${orderNumber}</p>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="background:#ffffff;padding:40px 48px;">

              <!-- Intro -->
              <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:14px;color:#775144;line-height:1.8;">
                Your order has been placed and we are already getting it ready. You will receive a shipping confirmation with a tracking link within 1–2 business days.
              </p>

              <!-- Divider label -->
              <p style="margin:0 0 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C09891;border-bottom:1px solid #F4D8D8;padding-bottom:10px;">Items Ordered</p>

              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                <tr>
                  <td style="padding:8px 0 4px;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;">Subtotal</td>
                  <td style="padding:8px 0 4px;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;text-align:right;">$${parseFloat(order.subtotal).toFixed(2)}</td>
                </tr>
                ${parseFloat(order.discount) > 0 ? `
                <tr>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#775144;">Discount</td>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#775144;text-align:right;">−$${parseFloat(order.discount).toFixed(2)}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;">Shipping</td>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;text-align:right;">${parseFloat(order.shipping_cost) === 0 ? 'Free' : '$' + parseFloat(order.shipping_cost).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;">VAT (16%)</td>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;text-align:right;">$${parseFloat(order.tax).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:20px 0 0;font-family:Georgia,serif;font-size:20px;color:#2A0800;border-top:2px solid #F4D8D8;">Total Paid</td>
                  <td style="padding:20px 0 0;font-family:Georgia,serif;font-size:20px;color:#2A0800;text-align:right;border-top:2px solid #F4D8D8;">$${parseFloat(total).toFixed(2)}</td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Shipping address -->
          <tr>
            <td style="background:#F9EDEA;padding:32px 48px;">
              <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C09891;">Shipping To</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#2A0800;line-height:1.8;">
                ${customer_name}<br>
                ${shipping.address}${shipping.apartment ? ', ' + shipping.apartment : ''}<br>
                ${shipping.city}${shipping.postalCode ? ', ' + shipping.postalCode : ''}<br>
                ${shipping.country}
              </p>
              <p style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#C09891;letter-spacing:1px;text-transform:uppercase;">
                ${order.payment_method === 'mpesa' ? 'Paid via M-Pesa' : 'Paid by Card'}
              </p>
            </td>
          </tr>

          <!-- What's next -->
          <tr>
            <td style="background:#ffffff;padding:32px 48px;">
              <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C09891;">What Happens Next</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${['We pack and prepare your order within 1–2 business days.',
                   'You receive a shipping confirmation with a live tracking link.',
                   'Your Kivana products arrive ready to transform your routine.']
                  .map((s, i) => `
                <tr>
                  <td style="width:28px;vertical-align:top;padding:6px 0;">
                    <div style="width:22px;height:22px;background:#2A0800;border-radius:50%;text-align:center;line-height:22px;">
                      <span style="font-family:Arial,sans-serif;font-size:10px;color:#F4D8D8;font-weight:bold;">${i + 1}</span>
                    </div>
                  </td>
                  <td style="padding:6px 0 6px 12px;font-family:Arial,sans-serif;font-size:13px;color:#775144;line-height:1.6;">${s}</td>
                </tr>`).join('')}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background:#F9EDEA;padding:32px 48px;text-align:center;">
              <a href="https://www.kivana.co/shop"
                style="display:inline-block;background:#2A0800;color:#F4D8D8;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:14px 36px;">
                Continue Shopping
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#2A0800;padding:28px 48px;text-align:center;">
              <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:14px;font-weight:400;letter-spacing:6px;text-transform:uppercase;color:#C09891;">KIVANA</p>
              <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;color:#775144;line-height:1.6;">
                Clean · Vegan · Sustainable · Cruelty-Free
              </p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#51403D;">
                Questions? <a href="mailto:hello@kivana.co" style="color:#C09891;text-decoration:none;">hello@kivana.co</a>
              </p>
              <p style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:10px;color:#51403D;">
                © Kivana. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const { data, error } = await resend.emails.send({
    from: 'Kivana <onboarding@resend.dev>',
    to: customer_email,
    subject: `Order confirmed — ${orderNumber}`,
    html,
  });

  if (error) {
    console.error('Email error:', error);
    return false;
  }

  console.log('Confirmation email sent:', data?.id);
  return true;
}

export async function sendOrderNotification(order) {
  const orderNumber = `KIV-${order.id.slice(0, 8).toUpperCase()}`;

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #3d1a10;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:48px;vertical-align:top;">
              <div style="width:40px;height:40px;background:linear-gradient(135deg,#775144,#C09891);border-radius:4px;"></div>
            </td>
            <td style="padding-left:12px;vertical-align:top;">
              <p style="margin:0 0 2px;font-family:Georgia,serif;font-size:14px;color:#F4D8D8;">${item.name}</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#C09891;letter-spacing:1px;text-transform:uppercase;">Qty: ${item.qty} · $${item.price.toFixed(2)} each</p>
            </td>
            <td style="vertical-align:top;text-align:right;">
              <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:#F4D8D8;">$${(item.price * item.qty).toFixed(2)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Order — Kivana</title>
</head>
<body style="margin:0;padding:0;background-color:#1a0a06;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a0a06;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#2A0800;padding:36px 48px;text-align:center;border-bottom:1px solid #3d1a10;">
              <h1 style="margin:0 0 4px;font-family:Georgia,serif;font-size:24px;font-weight:400;letter-spacing:10px;text-transform:uppercase;color:#F4D8D8;">KIVANA</h1>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#775144;">Order Management</p>
            </td>
          </tr>

          <!-- Alert band -->
          <tr>
            <td style="background:#775144;padding:24px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#F4D8D8;opacity:0.7;">New Order Received</p>
                    <h2 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:300;color:#F9EDEA;">${orderNumber}</h2>
                  </td>
                  <td style="text-align:right;vertical-align:middle;">
                    <p style="margin:0;font-family:Georgia,serif;font-size:28px;color:#F4D8D8;">$${parseFloat(order.total).toFixed(2)}</p>
                    <p style="margin:2px 0 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C09891;">${order.payment_method === 'mpesa' ? 'M-Pesa' : 'Card'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer details -->
          <tr>
            <td style="background:#2A0800;padding:28px 48px;border-bottom:1px solid #3d1a10;">
              <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#775144;">Customer</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;vertical-align:top;">
                    <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:16px;color:#F4D8D8;">${order.customer_name}</p>
                    <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;">${order.customer_email}</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;">${order.phone || 'No phone'}</p>
                  </td>
                  <td style="width:50%;vertical-align:top;text-align:right;">
                    <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;">${order.shipping.address}${order.shipping.apartment ? ', ' + order.shipping.apartment : ''}</p>
                    <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;">${order.shipping.city}${order.shipping.postalCode ? ', ' + order.shipping.postalCode : ''}</p>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#C09891;">${order.shipping.country}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="background:#2A0800;padding:28px 48px;border-bottom:1px solid #3d1a10;">
              <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#775144;">Items Ordered</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="background:#2A0800;padding:28px 48px;border-bottom:1px solid #3d1a10;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#775144;">Subtotal</td>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#775144;text-align:right;">$${parseFloat(order.subtotal).toFixed(2)}</td>
                </tr>
                ${parseFloat(order.discount) > 0 ? `
                <tr>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#C09891;">Discount applied</td>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#C09891;text-align:right;">−$${parseFloat(order.discount).toFixed(2)}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#775144;">Shipping</td>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#775144;text-align:right;">${parseFloat(order.shipping_cost) === 0 ? 'Free' : '$' + parseFloat(order.shipping_cost).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#775144;">VAT (16%)</td>
                  <td style="padding:4px 0;font-family:Arial,sans-serif;font-size:12px;color:#775144;text-align:right;">$${parseFloat(order.tax).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:16px 0 0;font-family:Georgia,serif;font-size:20px;color:#F4D8D8;border-top:1px solid #3d1a10;">Total Collected</td>
                  <td style="padding:16px 0 0;font-family:Georgia,serif;font-size:20px;color:#F4D8D8;text-align:right;border-top:1px solid #3d1a10;">$${parseFloat(order.total).toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping method -->
          <tr>
            <td style="background:#1f0a04;padding:20px 48px;border-bottom:1px solid #3d1a10;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#775144;letter-spacing:1px;text-transform:uppercase;">
                      ${order.shipping.method === 'express' ? 'Express Shipping · 1–3 business days' : 'Standard Shipping · 3–7 business days'}
                    </p>
                  </td>
                  <td style="text-align:right;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#775144;letter-spacing:1px;text-transform:uppercase;">
                      ${order.payment_method === 'mpesa' ? 'Paid via M-Pesa' : 'Paid by Card'}
                      ${order.payment_reference ? '· ' + order.payment_reference.slice(0, 12) : ''}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action -->
          <tr>
            <td style="background:#2A0800;padding:28px 48px;text-align:center;">
              <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:12px;color:#9A8D96;line-height:1.6;">
                Pack and ship this order within 1–2 business days.<br>
                Update the order status in your Supabase dashboard when shipped.
              </p>
              <a href="https://supabase.com/dashboard" 
                style="display:inline-block;background:#775144;color:#F4D8D8;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:12px 32px;margin-right:8px;">
                View in Supabase
              </a>
              <a href="https://kivana-skin.vercel.app/order-confirmation"
                style="display:inline-block;border:1px solid #775144;color:#C09891;font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:12px 32px;">
                Order Page
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a0a06;padding:24px 48px;text-align:center;border-top:1px solid #3d1a10;">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:13px;letter-spacing:6px;text-transform:uppercase;color:#51403D;">KIVANA</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:#3d1a10;">Internal order notification · Do not reply</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from: 'Kivana Orders <onboarding@resend.dev>',
    to: 'jonnykimeu@gmail.com',
    subject: `New order ${orderNumber} — $${parseFloat(order.total).toFixed(2)} · ${order.customer_name}`,
    html,
  });

  if (error) console.error('Notification email error:', error);
}