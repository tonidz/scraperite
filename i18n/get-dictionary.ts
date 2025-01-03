import type { ValidLocale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  sv: () => import('./dictionaries/sv.json').then((module) => module.default),
}

export const getDictionary = async (locale: ValidLocale) => 
  dictionaries[locale]?.() ?? dictionaries.en()