import { NextResponse } from 'next/server'
import { verifyStripeWebhook, handleStripeWebhookEvent } from '@/lib/stripe/webhooks'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  try {
    const event = await verifyStripeWebhook(req)
    await handleStripeWebhookEvent(event)
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

// New way (correct):
export const runtime = 'edge'; // optional
export const dynamic = 'force-dynamic';
export const preferredRegion = 'auto';