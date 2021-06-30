import { createI18n } from 'vue-i18n';
import de from '@/locales/de/de';
import en from '@/locales/en/en';

export const availableLocales = ['de', 'en'];
export const defaultLocale = 'de';
export const messages = {
  de,
  en,
};

const locales = createI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: defaultLocale,
});

export default locales;
