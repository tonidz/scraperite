import { getDictionary } from '@/i18n/get-dictionary'
import type { ValidLocale } from '@/i18n/config'

export default async function BrandsPage({
  params: { lang },
}: {
  params: { lang: ValidLocale }
}) {
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-[#FFE566] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">{dict.nav.brands}</h1>
        {/* Brands content will go here */}
      </div>
    </main>
  )
}