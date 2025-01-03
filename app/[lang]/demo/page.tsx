import { getDictionary } from '@/i18n/get-dictionary'
import type { ValidLocale } from '@/i18n/config'
import { GuideIntro } from '@/components/guide/guide-intro'
import { BladeGuide } from '@/components/guide/blade-guide'

export default async function GuidePage({
  params: { lang },
}: {
  params: { lang: ValidLocale }
}) {
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-[#FFE566] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">{dict.plasticGuide.title}</h1>
        <GuideIntro text={dict.plasticGuide.intro} />
        <BladeGuide dict={dict.plasticGuide} />
      </div>
    </div>
  )
}