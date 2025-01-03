"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { locales, localeNames, type ValidLocale } from '@/i18n/config'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (locale: ValidLocale) => {
    const newPath = pathname.replace(/^\/[a-z]{2}/, '')
    router.push(`/${locale}${newPath}`)
  }

  return (
    <div className="relative group">
      <Button variant="ghost" className="text-sm font-medium">
        {localeNames[pathname.split('/')[1] as ValidLocale] ?? localeNames.en} ▼
      </Button>
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="py-1">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLanguage(locale)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {localeNames[locale]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}