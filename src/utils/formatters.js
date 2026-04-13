import { normalizeLanguage } from '../i18n';

function isWallTimeString(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?(?: [A-Z]{2,5})?$/.test(value) &&
    !/[Zz]|[+-]\d{2}:?\d{2}/.test(value)
  );
}

function parseDateValue(value) {
  if (value instanceof Date) {
    return { date: value, useUtc: false };
  }

  if (typeof value !== 'string' || !value.trim()) {
    return { date: null, useUtc: false };
  }

  if (isWallTimeString(value)) {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (!match) {
      return { date: null, useUtc: false };
    }

    const [, year, month, day, hour = '00', minute = '00', second = '00'] = match;

    return {
      date: new Date(Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
      )),
      useUtc: true,
    };
  }

  const directDate = new Date(value);
  if (!Number.isNaN(directDate.getTime())) {
    return { date: directDate, useUtc: false };
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!match) {
    return { date: null, useUtc: false };
  }

  const [, year, month, day, hour = '00', minute = '00', second = '00'] = match;

  return {
    date: new Date(Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    )),
    useUtc: true,
  };
}

function getDateTimeFormatOptions(value, options) {
  return isWallTimeString(value) ? { ...options, timeZone: 'UTC' } : options;
}

export function formatMetricValue(value, language, { suffix = '', maximumFractionDigits = 1 } = {}) {
  const numericValue = Number(value ?? 0);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  const minimumFractionDigits = Number.isInteger(safeValue) ? 0 : Math.min(1, maximumFractionDigits);

  return `${new Intl.NumberFormat(normalizeLanguage(language), {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(safeValue)}${suffix}`;
}

export function formatDate(value, language, options = {}) {
  const parsed = parseDateValue(value);
  if (!parsed.date) return null;

  return new Intl.DateTimeFormat(
    normalizeLanguage(language),
    getDateTimeFormatOptions(value, options),
  ).format(parsed.date);
}

export function formatDateTime(value, language, options = {}) {
  const parsed = parseDateValue(value);
  if (!parsed.date) return null;

  return new Intl.DateTimeFormat(
    normalizeLanguage(language),
    getDateTimeFormatOptions(value, options),
  ).format(parsed.date);
}

export function formatTimelineLabel(value, language, granularity) {
  const formatOptionsByGranularity = {
    hour: { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' },
    day: { month: 'short', day: 'numeric' },
    week: { month: 'short', day: 'numeric' },
    month: { month: 'short', year: 'numeric' },
  };

  const formattedValue = formatDateTime(
    value,
    language,
    formatOptionsByGranularity[granularity] || formatOptionsByGranularity.day,
  );

  return formattedValue || value || '';
}
