export const defaultLocale = 'sv'
export const locales = ['en', 'sv'] as const
export type ValidLocale = (typeof locales)[number]

export const localeNames: Record<ValidLocale, string> = {
  en: 'English',
  sv: 'Svenska',
}