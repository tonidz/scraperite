import { NextResponse } from 'next/server'
import { verifyStripeWebhook, handleStripeWebhookEvent } from '@/lib/stripe/webhooks'

export async function POST(req: Request) {
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

// Disable body parsing, need raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}