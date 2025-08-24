// Runtime array of supported languages
export const supportedLanguages = [
  'ar', 'de', 'en', 'es', 'fr', 'hi',
  'it', 'ja', 'ko', 'nl', 'pl', 'pt',
  'ru', 'sv', 'tr', 'uk', 'zh',
] as const;

// Type derived automatically from the array
export type SupportedLanguage = typeof supportedLanguages[number];
