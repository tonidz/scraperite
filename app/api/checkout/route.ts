import { NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe/checkout'
import { logger } from '@/lib/utils/logger'

export async function POST(req: Request) {
  try {
    const { items, successUrl, cancelUrl } = await req.json()
    const session = await createCheckoutSession({
      items,
      successUrl,
      cancelUrl,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    logger.error('Stripe checkout error', error, {
      endpoint: '/api/checkout',
    })
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}