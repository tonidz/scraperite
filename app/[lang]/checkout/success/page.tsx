import { getDictionary } from '@/i18n/get-dictionary'
import type { ValidLocale } from '@/i18n/config'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function CheckoutSuccessPage({
  params: { lang },
}: {
  params: { lang: ValidLocale }
}) {
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Thank you for your order!</h1>
        <p className="text-gray-600 mb-8">
          We'll send you a confirmation email with your order details.
        </p>
        <Link href={`/${lang}`}>
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}