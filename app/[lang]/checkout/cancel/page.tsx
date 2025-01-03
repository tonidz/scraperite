import { getDictionary } from '@/i18n/get-dictionary'
import type { ValidLocale } from '@/i18n/config'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function CheckoutCancelPage({
  params: { lang },
}: {
  params: { lang: ValidLocale }
}) {
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Order Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your order has been cancelled. No charges were made.
        </p>
        <Link href={`/${lang}`}>
          <Button>Return to Shop</Button>
        </Link>
      </div>
    </div>
  )
}