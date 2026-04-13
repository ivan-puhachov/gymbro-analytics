import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './resources';

export const LANGUAGE_STORAGE_KEY = 'gymbro_analytics_language';
export const DEFAULT_LANGUAGE = 'en';

export function normalizeLanguage(language) {
  return String(language || DEFAULT_LANGUAGE).toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

function getSavedLanguage() {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return savedLanguage ? normalizeLanguage(savedLanguage) : null;
  } catch {
    return null;
  }
}

function getBrowserLanguage() {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;
  return normalizeLanguage(navigator.language || navigator.languages?.[0] || DEFAULT_LANGUAGE);
}

function getInitialLanguage() {
  return getSavedLanguage() || getBrowserLanguage();
}

function updateDocumentLanguage(language) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = normalizeLanguage(language);
  }
}

const initialLanguage = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ['en', 'ru'],
    ns: ['common', 'auth', 'dashboard'],
    defaultNS: 'common',
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

updateDocumentLanguage(initialLanguage);

i18n.on('languageChanged', (language) => {
  const normalizedLanguage = normalizeLanguage(language);
  updateDocumentLanguage(normalizedLanguage);

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  } catch {
    /* Ignore storage write failures. */
  }
});

export default i18n;
