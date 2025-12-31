import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

// Import translation files
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

// Get device language safely
let deviceLanguage = 'en';
try {
  const locales = getLocales();
  deviceLanguage = locales[0]?.languageCode || 'en';
} catch (error) {
  deviceLanguage = 'en';
}

const supportedLanguages = ['en', 'ar'];
const fallbackLanguage = 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar",
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    compatibilityJSON: 'v4',
    // Remove any persistence configuration that might cause issues
    saveMissing: false,
    updateMissing: false,
  })
  .catch((error: any) => {
    console.log('i18n initialization error:', error);
  });

export default i18n;
