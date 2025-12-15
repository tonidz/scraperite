import { NextResponse } from 'next/server'
import { verifyStripeWebhook, handleStripeWebhookEvent } from '@/lib/stripe/webhooks'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No stripe signature found' },
      { status: 400 }
    )
  }

  try {
    const event = await verifyStripeWebhook(body, signature)
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

export const dynamic = 'force-dynamic'
