import React from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeDataMode } from '../api';

const DATA_MODE_OPTIONS = [
  { value: 'production', labelKey: 'dataMode.production', ariaKey: 'dataMode.switchToProduction' },
  { value: 'test', labelKey: 'dataMode.test', ariaKey: 'dataMode.switchToTest' },
];

export default function DataModeToggle({ value, onChange, className = '' }) {
  const { t } = useTranslation('common');
  const activeMode = normalizeDataMode(value);

  return (
    <div
      className={`inline-flex items-center shrink-0 rounded-lg border border-gray-700 bg-gray-900 p-1 ${className}`.trim()}
      role="group"
      aria-label={t('dataMode.selector')}
    >
      {DATA_MODE_OPTIONS.map((option) => {
        const isActive = activeMode === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            aria-label={t(option.ariaKey)}
            className={`min-w-[5.5rem] rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
              isActive
                ? option.value === 'test'
                  ? 'bg-amber-500 text-gray-950'
                  : 'bg-emerald-500 text-gray-950'
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
