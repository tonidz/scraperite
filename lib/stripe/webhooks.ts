import { stripe } from './server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { EmailService } from '@/lib/email-service'
import { createClient } from '@supabase/supabase-js'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Admin email for order notifications
const ADMIN_EMAIL = 'toni@verras.se'

// Create a Supabase client with service role for webhook operations
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function verifyStripeWebhook(body: string, signature: string) {
  if (!signature) {
    throw new Error('No stripe signature found')
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
    return event
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    throw new Error('Invalid stripe signature')
  }
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutComplete(session)
      break
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentSuccess(paymentIntent)
      break
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentFailure(paymentIntent)
      break
    }
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id)
  
  try {
    // Retrieve the full session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'line_items.data.price.product', 'customer', 'payment_intent'],
    })

    const customerEmail = fullSession.customer_details?.email || fullSession.customer_email || ''
    const customerName = fullSession.customer_details?.name || ''
    const shippingAddress = fullSession.shipping_details?.address
    const billingAddress = fullSession.customer_details?.address
    
    // Extract line items
    const lineItems = fullSession.line_items?.data || []
    const items = lineItems.map((item) => ({
      name: item.description || (item.price?.product as Stripe.Product)?.name || 'Product',
      quantity: item.quantity || 1,
      unitAmount: item.price?.unit_amount || 0,
      total: item.amount_total || 0,
    }))

    // Calculate totals
    const subtotal = fullSession.amount_subtotal || 0
    const shippingCost = fullSession.shipping_cost?.amount_total || 0
    const total = fullSession.amount_total || 0

    // Save order to database
    const supabase = getSupabaseAdmin()
    
    const orderData = {
      stripe_session_id: session.id,
      stripe_payment_intent_id: typeof fullSession.payment_intent === 'string' 
        ? fullSession.payment_intent 
        : fullSession.payment_intent?.id || null,
      customer_email: customerEmail,
      customer_name: customerName,
      shipping_address: shippingAddress ? {
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.postal_code,
        country: shippingAddress.country,
      } : null,
      billing_address: billingAddress ? {
        line1: billingAddress.line1,
        line2: billingAddress.line2,
        city: billingAddress.city,
        state: billingAddress.state,
        postal_code: billingAddress.postal_code,
        country: billingAddress.country,
      } : null,
      items: items,
      subtotal: subtotal,
      shipping_cost: shippingCost,
      total: total,
      currency: fullSession.currency || 'sek',
      status: 'processing',
      payment_status: 'paid',
      metadata: fullSession.metadata || {},
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('Error saving order:', orderError)
    } else {
      console.log('Order saved:', order.id)
    }

    // Format order items for email
    const formattedItems = items.map((item) => 
      `<tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unitAmount / 100)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.total / 100)}</td>
      </tr>`
    ).join('')

    const shippingAddressHtml = shippingAddress 
      ? `<p>
          ${shippingAddress.line1 || ''}<br/>
          ${shippingAddress.line2 ? shippingAddress.line2 + '<br/>' : ''}
          ${shippingAddress.postal_code || ''} ${shippingAddress.city || ''}<br/>
          ${shippingAddress.country || ''}
        </p>`
      : '<p>No shipping address provided</p>'

    // Send admin notification email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background: #FFE566; padding: 24px; text-align: center;">
            <h1 style="margin: 0; color: #000; font-size: 24px;">🎉 New Order Received!</h1>
          </div>
          
          <div style="padding: 24px;">
            <p style="margin: 0 0 16px; font-size: 16px;"><strong>Order ID:</strong> ${session.id}</p>
            <p style="margin: 0 0 16px; font-size: 16px;"><strong>Customer:</strong> ${customerName}</p>
            <p style="margin: 0 0 24px; font-size: 16px;"><strong>Email:</strong> ${customerEmail}</p>
            
            <h2 style="margin: 0 0 16px; font-size: 18px; border-bottom: 2px solid #FFE566; padding-bottom: 8px;">Order Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background: #f9f9f9;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #eee;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;">Price</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${formattedItems}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;"><strong>Subtotal:</strong></td>
                  <td style="padding: 12px; text-align: right;">${formatCurrency(subtotal / 100)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;"><strong>Shipping:</strong></td>
                  <td style="padding: 12px; text-align: right;">${formatCurrency(shippingCost / 100)}</td>
                </tr>
                <tr style="background: #FFE566;">
                  <td colspan="3" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 12px; text-align: right; font-size: 18px;"><strong>${formatCurrency(total / 100)}</strong></td>
                </tr>
              </tfoot>
            </table>
            
            <h2 style="margin: 0 0 16px; font-size: 18px; border-bottom: 2px solid #FFE566; padding-bottom: 8px;">Shipping Address</h2>
            ${shippingAddressHtml}
          </div>
        </div>
      </body>
      </html>
    `

    // Send customer confirmation email
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background: #FFE566; padding: 24px; text-align: center;">
            <h1 style="margin: 0; color: #000; font-size: 24px;">Thank you for your order!</h1>
          </div>
          
          <div style="padding: 24px;">
            <p style="margin: 0 0 16px; font-size: 16px;">Hi ${customerName || 'there'},</p>
            <p style="margin: 0 0 24px; font-size: 16px;">We've received your order and it's being processed. Here's your order confirmation:</p>
            
            <p style="margin: 0 0 16px; font-size: 14px; color: #666;"><strong>Order ID:</strong> ${session.id}</p>
            
            <h2 style="margin: 24px 0 16px; font-size: 18px; border-bottom: 2px solid #FFE566; padding-bottom: 8px;">Order Summary</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background: #f9f9f9;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #eee;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.total / 100)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right;"><strong>Subtotal:</strong></td>
                  <td style="padding: 12px; text-align: right;">${formatCurrency(subtotal / 100)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right;"><strong>Shipping:</strong></td>
                  <td style="padding: 12px; text-align: right;">${formatCurrency(shippingCost / 100)}</td>
                </tr>
                <tr style="background: #FFE566;">
                  <td colspan="2" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 12px; text-align: right; font-size: 18px;"><strong>${formatCurrency(total / 100)}</strong></td>
                </tr>
              </tfoot>
            </table>
            
            <h2 style="margin: 0 0 16px; font-size: 18px; border-bottom: 2px solid #FFE566; padding-bottom: 8px;">Shipping To</h2>
            ${shippingAddressHtml}
            
            <div style="margin-top: 32px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                We'll send you a shipping confirmation email once your order is on its way.
                If you have any questions, please reply to this email.
              </p>
            </div>
          </div>
          
          <div style="background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Scraperite. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send admin email
    try {
      const adminResult = await EmailService.sendEmail({
        to: ADMIN_EMAIL,
        subject: `🎉 New Order: ${customerName} - ${formatCurrency(total / 100)}`,
        html: adminEmailHtml,
        text: `New order received from ${customerName} (${customerEmail}). Total: ${formatCurrency(total / 100)}`,
      })
      
      if (adminResult.success) {
        console.log('Admin notification email sent successfully')
        // Update order to mark admin email as sent
        if (order) {
          await supabase
            .from('orders')
            .update({ admin_email_sent: true })
            .eq('id', order.id)
        }
      } else {
        console.error('Failed to send admin email:', adminResult.error)
      }
    } catch (emailError) {
      console.error('Error sending admin email:', emailError)
    }

    // Send customer confirmation email
    if (customerEmail) {
      try {
        const customerResult = await EmailService.sendEmail({
          to: customerEmail,
          subject: `Order Confirmation - Scraperite`,
          html: customerEmailHtml,
          text: `Thank you for your order! Your order ID is ${session.id}. Total: ${formatCurrency(total / 100)}`,
        })
        
        if (customerResult.success) {
          console.log('Customer confirmation email sent successfully')
          // Update order to mark customer email as sent
          if (order) {
            await supabase
              .from('orders')
              .update({ customer_email_sent: true })
              .eq('id', order.id)
          }
        } else {
          console.error('Failed to send customer email:', customerResult.error)
        }
      } catch (emailError) {
        console.error('Error sending customer email:', emailError)
      }
    }

  } catch (error) {
    console.error('Error processing checkout completion:', error)
    throw error
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  
  // Update order status if needed
  const supabase = getSupabaseAdmin()
  
  await supabase
    .from('orders')
    .update({ payment_status: 'paid' })
    .eq('stripe_payment_intent_id', paymentIntent.id)
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  
  // Update order status
  const supabase = getSupabaseAdmin()
  
  await supabase
    .from('orders')
    .update({ payment_status: 'failed', status: 'cancelled' })
    .eq('stripe_payment_intent_id', paymentIntent.id)
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
