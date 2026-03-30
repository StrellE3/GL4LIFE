export const locales = ['fr', 'en', 'cn'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'
