import React from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeLanguage } from '../i18n';

const LANGUAGE_OPTIONS = [
  { value: 'en', labelKey: 'language.english', ariaKey: 'language.switchToEnglish' },
  { value: 'ru', labelKey: 'language.russian', ariaKey: 'language.switchToRussian' },
];

export default function LanguageToggle({ className = '' }) {
  const { t, i18n } = useTranslation('common');
  const activeLanguage = normalizeLanguage(i18n.resolvedLanguage);

  return (
    <div
      className={`inline-flex items-center shrink-0 rounded-lg border border-gray-700 bg-gray-900 p-1 ${className}`.trim()}
      role="group"
      aria-label={t('language.selector')}
    >
      {LANGUAGE_OPTIONS.map((option) => {
        const isActive = activeLanguage === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => i18n.changeLanguage(option.value)}
            aria-pressed={isActive}
            aria-label={t(option.ariaKey)}
            className={`min-w-[3rem] rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {t(option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
