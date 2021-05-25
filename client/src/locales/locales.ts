import { createI18n } from 'vue-i18n';
import de from '@/locales/de/de';
import en from '@/locales/en/en';

const defaultLocale = 'de';

const messages = {
  de,
  en,
};

const locales = createI18n({
  locale: defaultLocale,
  messages,
  fallbackLocale: 'en',
});

export default locales;
