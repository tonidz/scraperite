import { NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe/checkout'

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
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}