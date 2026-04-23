import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Cpu,
  Database,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  Users,
  Zap,
  Download,
} from 'lucide-react';
import { api, DATA_MODE_STORAGE_KEY, DEFAULT_DATA_MODE, normalizeDataMode } from '../api';
import DataModeToggle from '../components/DataModeToggle';
import LanguageToggle from '../components/LanguageToggle';
import { formatDate, formatDateTime, formatMetricValue, formatTimelineLabel } from '../utils/formatters';
import {
  getAgeGroupLabel,
  getGenderLabel,
  getHeightBucketLabel,
  getSegmentValueLabel,
  getWeightBucketLabel,
} from '../utils/analyticsDisplay';

const ContentCard = ({ title, description, children, className = '', contentClassName = '' }) => (
  <div className={`bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm ${className}`}>
    {title && <h3 className="text-lg font-semibold text-gray-300 leading-snug break-words">{title}</h3>}
    {description && <p className="text-sm text-gray-400 mt-1 leading-relaxed break-words">{description}</p>}
    <div className={`w-full ${title || description ? 'mt-4' : ''} ${contentClassName}`.trim()}>
      {children}
    </div>
  </div>
);

const ChartCard = ({ title, description, children }) => (
  <ContentCard
    title={title}
    description={description}
    className="flex flex-col items-stretch"
    contentClassName="min-w-0"
  >
    <div className="w-full h-64">
      {children}
    </div>
  </ContentCard>
);

const SectionHeader = ({ title, description }) => (
  <div className="mb-4">
    <h2 className="text-xl font-semibold text-white">{title}</h2>
    {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
  </div>
);

const MetricCard = ({ title, value, subtitle }) => (
  <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 leading-snug break-words">{title}</p>
    <p className="text-2xl font-bold text-white mt-3">{value}</p>
    {subtitle && <p className="text-sm text-gray-400 mt-1 leading-relaxed break-words">{subtitle}</p>}
  </div>
);

const MetricToggle = ({ label, options, value, onChange, className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</span>
    <div className="inline-flex flex-wrap gap-2 rounded-xl border border-gray-700 bg-gray-800 p-1">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

function getTooltipLabelValue(point, labelKey, fallbackLabel, t) {
  switch (labelKey) {
    case 'age_group':
      return getAgeGroupLabel(point.age_group, t);
    case 'gender':
      return getGenderLabel(point.gender, t);
    case 'bucket':
      if (point.dimension === 'height') {
        return getHeightBucketLabel(point.bucket, t);
      }
      return getWeightBucketLabel(point.bucket, t);
    default:
      return fallbackLabel || t('common:fallback.unknown');
  }
}

const UsageMetricsTooltip = ({ active, payload, label, labelKey }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);

  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload || {};
  const labelValue = getTooltipLabelValue(point, labelKey, label, t);
  const msSuffix = ` ${t('common:units.ms')}`;

  return (
    <div className="max-w-xs bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-white mb-2 break-words">{labelValue}</p>
      <div className="space-y-1 text-sm text-gray-300">
        <p>{t('tooltips.usageMetrics.requests')}: {formatMetricValue(point.requests_count, i18n.resolvedLanguage)}</p>
        <p>{t('tooltips.usageMetrics.avgTokens')}: {formatMetricValue(point.avg_tokens, i18n.resolvedLanguage)}</p>
        <p>
          {t('tooltips.usageMetrics.avgResponseTime')}:{' '}
          {formatMetricValue(point.avg_response_time ?? point.avg_response_time_ms, i18n.resolvedLanguage, { suffix: msSuffix })}
        </p>
      </div>
    </div>
  );
};

const UserIntensityTooltip = ({ active, payload }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);

  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload || {};
  const language = i18n.resolvedLanguage;
  const msSuffix = ` ${t('common:units.ms')}`;

  return (
    <div className="max-w-xs bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-white mb-2 break-words">
        {point.email || point.displayLabel || t('common:fallback.unknown')}
      </p>
      <div className="space-y-1 text-sm text-gray-300">
        <p>{t('analytics.userIntensity.table.headers.requests')}: {formatMetricValue(point.requests_count, language, { maximumFractionDigits: 0 })}</p>
        <p>{t('analytics.userIntensity.table.headers.sessions')}: {formatMetricValue(point.sessions_count, language, { maximumFractionDigits: 0 })}</p>
        <p>{t('analytics.userIntensity.table.headers.totalTokens')}: {formatMetricValue(point.total_tokens, language, { maximumFractionDigits: 0 })}</p>
        <p>{t('analytics.userIntensity.table.headers.avgResponseTime')}: {formatMetricValue(point.avg_response_time_ms, language, { suffix: msSuffix })}</p>
      </div>
    </div>
  );
};

const EngagementScatterTooltip = ({ active, payload }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);

  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload || {};
  const language = i18n.resolvedLanguage;

  return (
    <div className="max-w-xs bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold text-white mb-2 break-words">
        {point.email || point.displayLabel || t('common:fallback.unknown')}
      </p>
      <div className="space-y-1 text-sm text-gray-300">
        <p>{t('analytics.engagement.axis.engagement')}: {formatMetricValue(point.engagement_total, language, { maximumFractionDigits: 0 })}</p>
        <p>{t('analytics.engagement.axis.requests')}: {formatMetricValue(point.requests_count, language, { maximumFractionDigits: 0 })}</p>
        <p>{t('analytics.userIntensity.table.headers.sessions')}: {formatMetricValue(point.sessions_count, language, { maximumFractionDigits: 0 })}</p>
      </div>
    </div>
  );
};

const SegmentComparisonCard = ({ comparison }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const language = i18n.resolvedLanguage;
  const dimensionKey = String(comparison.dimension || '').trim().toLowerCase();
  const metricKey = String(comparison.metric || '').trim();
  const topSegmentLabel = getSegmentValueLabel(dimensionKey, comparison.top_segment, t);
  const bottomSegmentLabel = getSegmentValueLabel(dimensionKey, comparison.bottom_segment, t);
  const metricLabel = t(`demographics.segmentComparison.metrics.${metricKey}`, {
    defaultValue: metricKey || t('common:fallback.unknown'),
  });
  const isEqualComparison = comparison.is_equal === true;
  const equalSegments = (comparison.all_segments || []).length > 0
    ? comparison.all_segments
    : [
        { segment: comparison.top_segment, value: comparison.top_value },
        { segment: comparison.bottom_segment, value: comparison.bottom_value },
      ].filter((segment) => segment.segment);
  const equalSegmentLabels = equalSegments
    .map((segment) => getSegmentValueLabel(dimensionKey, segment.segment, t))
    .filter(Boolean);
  const localizedSummary = t('demographics.segmentComparison.summary', {
    top: topSegmentLabel,
    bottom: bottomSegmentLabel,
    percent: formatMetricValue(comparison.relative_gap_percent, language),
  });
  const localizedEqualSummary = t('demographics.segmentComparison.equalSummary', {
    segments: equalSegmentLabels.join(', ') || `${topSegmentLabel}, ${bottomSegmentLabel}`,
    metric: metricLabel,
    value: formatMetricValue(comparison.top_value, language),
  });

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Users size={16} className="text-blue-400" />
            {t(`demographics.segmentComparison.dimensions.${dimensionKey}`, {
              defaultValue: dimensionKey || t('common:fallback.unknown'),
            })}
          </p>
          <div className="bg-gray-900 border border-gray-700 px-3 py-1 rounded-full flex items-center gap-2 shadow-inner">
            <Activity size={14} className="text-purple-400" />
            <span className="text-xs font-medium text-gray-300">{metricLabel}</span>
          </div>
        </div>

        {isEqualComparison ? (
          <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700/50">
            <div className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200">
              {t('demographics.segmentComparison.labels.equalSegments')}
            </div>
            <div className="mt-4 text-2xl font-bold text-white">
              {formatMetricValue(comparison.top_value, language)}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {equalSegments.map((seg, idx) => (
                <div key={idx} className="flex items-center bg-gray-800/80 rounded-md overflow-hidden border border-gray-700/30 shadow-sm">
                  <span className="px-2.5 py-1 text-sm font-medium text-gray-300 bg-gray-800/50">{getSegmentValueLabel(dimensionKey, seg.segment, t)}</span>
                  <span className="px-2 py-1 text-xs font-semibold text-gray-400 border-l border-gray-700/50">
                    {formatMetricValue(seg.value, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 items-center bg-gray-900/50 p-5 rounded-xl border border-gray-700/50">
              <div className="flex flex-col gap-1 items-start text-left">
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  {t('demographics.segmentComparison.labels.topSegment')}
                </div>
                <div className="text-xl font-bold text-white mt-1 break-all truncate w-full" title={topSegmentLabel}>{topSegmentLabel}</div>
                <div className="text-lg font-medium text-gray-300">{formatMetricValue(comparison.top_value, language)}</div>
              </div>

              <div className="flex flex-col items-center justify-center relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent -translate-y-1/2 -z-10"></div>
                <div className="bg-gray-800 border border-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold text-gray-400 shadow-md">
                  VS
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <span className="text-emerald-400 font-bold text-base flex items-center gap-0.5">
                    +{formatMetricValue(comparison.relative_gap_percent, language, { suffix: '%' })}
                  </span>
                  <span className="text-gray-500 text-xs font-medium bg-gray-800/80 px-2 py-0.5 rounded shadow mt-1">
                    {t('demographics.segmentComparison.labels.gap')}: {formatMetricValue(comparison.absolute_gap, language)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 items-end text-right">
                <div className="text-xs text-rose-400 font-semibold uppercase tracking-wider bg-rose-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <ArrowDownRight size={14} />
                  {t('demographics.segmentComparison.labels.bottomSegment')}
                </div>
                <div className="text-xl font-bold text-white mt-1 break-all truncate w-full" title={bottomSegmentLabel}>{bottomSegmentLabel}</div>
                <div className="text-lg font-medium text-gray-300">{formatMetricValue(comparison.bottom_value, language)}</div>
              </div>
            </div>

            {comparison.all_segments && comparison.all_segments.length > 2 && (
              <div className="mt-4 bg-gray-900/30 rounded-xl p-4 border border-gray-700/50">
                <div className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">
                  {t("demographics.segmentComparison.labels.allSegments", { defaultValue: "All segments" })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {comparison.all_segments.map((seg, idx) => (
                    <div key={idx} className="flex items-center bg-gray-800/80 rounded-md overflow-hidden border border-gray-700/30 shadow-sm transition-colors hover:bg-gray-800">
                      <span className="px-2.5 py-1 text-sm font-medium text-gray-300 bg-gray-800/50">{getSegmentValueLabel(dimensionKey, seg.segment, t)}</span>
                      <span className="px-2 py-1 text-xs font-semibold text-gray-400 border-l border-gray-700/50">
                        {formatMetricValue(seg.value, language)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-6 flex items-start gap-3 bg-blue-900/10 p-4 rounded-lg border border-blue-500/20">
        <Zap size={20} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-100/80 leading-relaxed font-medium">
          {isEqualComparison ? localizedEqualSummary : localizedSummary}
        </p>
      </div>
    </div>
  );
};

const SegmentComparisonEmptyCard = ({ dimension }) => {
  const { t } = useTranslation(['dashboard', 'common']);
  const dimensionKey = String(dimension || '').trim().toLowerCase();

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Users size={16} className="text-blue-400" />
          {t(`demographics.segmentComparison.dimensions.${dimensionKey}`, {
            defaultValue: dimensionKey || t('common:fallback.unknown'),
          })}
        </p>
      </div>

      <div className="flex min-h-[180px] flex-1 items-center rounded-xl border border-gray-700/50 bg-gray-900/40 p-5">
        <div>
          <div className="inline-flex rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t('demographics.segmentComparison.labels.noComparison')}
          </div>
          <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-gray-400">
            {t('demographics.segmentComparison.insufficientData')}
          </p>
        </div>
      </div>
    </div>
  );
};

const SEGMENT_COMPARISON_DIMENSIONS = ['age', 'gender', 'weight', 'height'];

function buildEqualSegmentComparison(rows, { dimension, segmentKey, metricKey = 'avg_requests' }) {
  const validRows = (rows || [])
    .map((row) => ({
      segment: String(row?.[segmentKey] ?? '').trim(),
      value: Number(row?.[metricKey]),
    }))
    .filter((row) => row.segment && Number.isFinite(row.value) && row.value > 0);

  if (validRows.length < 2) return null;

  const firstValue = validRows[0].value;
  if (!validRows.every((row) => row.value === firstValue)) return null;

  return {
    dimension,
    metric: metricKey,
    top_segment: validRows[0].segment,
    bottom_segment: validRows[1].segment,
    top_value: firstValue,
    bottom_value: firstValue,
    absolute_gap: 0,
    relative_gap_percent: 0,
    is_equal: true,
    all_segments: validRows,
  };
}

const NAV_ITEMS = [
  { id: 'overview', labelKey: 'navigation.overview', icon: LayoutDashboard },
  { id: 'analytics', labelKey: 'navigation.analytics', icon: BarChart3 },
  { id: 'demographics', labelKey: 'navigation.demographics', icon: Users },
  { id: 'telemetry', labelKey: 'navigation.telemetry', icon: Activity },
  { id: 'system', labelKey: 'navigation.system', icon: Cpu },
];

function getValidNumber(value) {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

const USER_AXIS_LABEL_MAX_LENGTH = 12;

function getUserDisplayLabel(email, fallback) {
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  if (!normalizedEmail) return fallback;

  const [localPart] = normalizedEmail.split('@');
  if (!localPart) return normalizedEmail;

  if (localPart.length <= USER_AXIS_LABEL_MAX_LENGTH) return localPart;

  return `${localPart.slice(0, USER_AXIS_LABEL_MAX_LENGTH - 3)}...`;
}

function extractDateKey(value) {
  if (typeof value === 'string') {
    const match = value.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().slice(0, 10);
}

function isWithinDateRange(value, startDate, endDate) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59.999`);

  return parsed >= start && parsed <= end;
}

export default function DashboardScreen() {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const language = i18n.resolvedLanguage;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [dataMode, setDataMode] = useState(() => {
    try {
      return normalizeDataMode(localStorage.getItem(DATA_MODE_STORAGE_KEY));
    } catch {
      return DEFAULT_DATA_MODE;
    }
  });
  const [includeAdmins, setIncludeAdmins] = useState(() => localStorage.getItem('gymbro_analytics_include_admins') === 'true');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [granularity, setGranularity] = useState('day');
  const [analyticsTrendMetric, setAnalyticsTrendMetric] = useState('requests');
  const [demographicsMetric, setDemographicsMetric] = useState('requests');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('onboarded');
  const [modalUsers, setModalUsers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t('pageTitle');
  }, [language, t]);

  useEffect(() => {
    try {
      localStorage.setItem(DATA_MODE_STORAGE_KEY, normalizeDataMode(dataMode));
    } catch {
      /* Ignore storage write failures. */
    }
  }, [dataMode]);

  useEffect(() => {
    try {
      localStorage.setItem('gymbro_analytics_include_admins', String(includeAdmins));
    } catch {
      /* Ignore storage write failures. */
    }
  }, [includeAdmins]);

  useEffect(() => {
    setData(null);
    setErrors({});
    setLoading(true);
    setModalOpen(false);
    setModalUsers([]);
    setModalLoading(false);
    setModalError(false);
    setModalSearch('');
  }, [dataMode, includeAdmins]);

  const handleOnboardedClick = async () => {
    setModalType('onboarded');
    setModalOpen(true);
    setModalError(false);
    setModalSearch('');

    if (Array.isArray(data?.onboardedUsers) && !errors.onboardedUsers) {
      setModalUsers(data.onboardedUsers);
      setModalLoading(false);
      return;
    }

    setModalLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const users = await api.getAnalytics('users/onboarded', token, {}, dataMode, includeAdmins);
      setModalUsers(users);
    } catch (err) {
      console.error(err);
      setModalError(true);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDauClick = async () => {
    setModalType('dau');
    setModalOpen(true);
    setModalError(false);
    setModalSearch('');

    setModalLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const currentDataMode = normalizeDataMode(dataMode);
      const results = await api.getReport('dau-today', token, currentDataMode, includeAdmins);
      setModalUsers(results);
    } catch (err) {
      console.error(err);
      setModalError(true);
    } finally {
      setModalLoading(false);
    }
  };

  const handleInteractionsClick = async () => {
    setModalType('interactions');
    setModalOpen(true);
    setModalError(false);
    setModalSearch('');

    setModalLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const currentDataMode = normalizeDataMode(dataMode);
      const results = await api.getReport('interactions-today?limit=500', token, currentDataMode, includeAdmins);
      setModalUsers(results);
    } catch (err) {
      console.error(err);
      setModalError(true);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      const token = localStorage.getItem('admin_token');
      const currentDataMode = normalizeDataMode(dataMode);
      setLoading(true);
      try {
        const queryParams = { start: startDate, end: endDate, granularity };
        const demographicsQueryParams = { start: startDate, end: endDate };

        const promiseMap = {
          dau: api.getReport('daily-active-users', token, currentDataMode, includeAdmins),
          onboarding: api.getReport('onboarding', token, currentDataMode, includeAdmins),
          aiHealth: api.getReport('ai-health', token, currentDataMode, includeAdmins),
          hourly: api.getReport('hourly-activity', token, currentDataMode, includeAdmins),
          engagement: api.getReport('engagement?limit=1000', token, currentDataMode, includeAdmins),
          userReports: api.getReport('users?limit=1000', token, currentDataMode, includeAdmins),
          usageSummary: api.getAnalytics('usage-summary', token, demographicsQueryParams, currentDataMode, includeAdmins),
          onboardedUsers: api.getAnalytics('users/onboarded', token, {}, currentDataMode, includeAdmins),
          segmentComparison: api.getAnalytics('segment-comparison', token, demographicsQueryParams, currentDataMode, includeAdmins),
          ageGroup: api.getAnalytics('by-age-group', token, demographicsQueryParams, currentDataMode, includeAdmins),
          timeRange: api.getAnalytics('by-time-range', token, queryParams, currentDataMode, includeAdmins),
          genderInsights: api.getAnalytics('by-gender', token, demographicsQueryParams, currentDataMode, includeAdmins),
          weightInsights: api.getAnalytics('by-weight-bucket', token, demographicsQueryParams, currentDataMode, includeAdmins),
          heightInsights: api.getAnalytics('by-height-bucket', token, demographicsQueryParams, currentDataMode, includeAdmins),
          usersByAgeGroup: api.getAnalytics('users-by-age-group', token, {}, currentDataMode, includeAdmins),
          usersByGender: api.getAnalytics('users-by-gender', token, {}, currentDataMode, includeAdmins),
          usersByWeight: api.getAnalytics('users-by-weight-bucket', token, {}, currentDataMode, includeAdmins),
          usersByHeight: api.getAnalytics('users-by-height-bucket', token, {}, currentDataMode, includeAdmins),
          hourlyUsage: api.getAnalytics('hourly-usage', token, demographicsQueryParams, currentDataMode, includeAdmins),
        };

        const keys = Object.keys(promiseMap);
        const settledResults = await Promise.allSettled(Object.values(promiseMap));

        const results = keys.reduce((accumulator, key, index) => {
          accumulator[key] = settledResults[index];
          return accumulator;
        }, {});

        const hasAuthError = Object.values(results).some(
          (result) =>
            result.status === 'rejected' &&
            (result.reason?.status === 401 || result.reason?.status === 403),
        );

        if (isCancelled) return;

        if (hasAuthError) {
          localStorage.removeItem('admin_token');
          navigate('/login');
          return;
        }

        setErrors({
          dau: results.dau.status === 'rejected',
          onboarding: results.onboarding.status === 'rejected',
          aiHealth: results.aiHealth.status === 'rejected',
          hourly: results.hourly.status === 'rejected',
          engagement: results.engagement.status === 'rejected',
          userReports: results.userReports.status === 'rejected',
          usageSummary: results.usageSummary.status === 'rejected',
          onboardedUsers: results.onboardedUsers.status === 'rejected',
          segmentComparison: results.segmentComparison.status === 'rejected',
          ageGroup: results.ageGroup.status === 'rejected',
          timeRange: results.timeRange.status === 'rejected',
          genderInsights: results.genderInsights.status === 'rejected',
          weightInsights: results.weightInsights.status === 'rejected',
          heightInsights: results.heightInsights.status === 'rejected',
          usersByAgeGroup: results.usersByAgeGroup.status === 'rejected',
          usersByGender: results.usersByGender.status === 'rejected',
          usersByWeight: results.usersByWeight.status === 'rejected',
          usersByHeight: results.usersByHeight.status === 'rejected',
          hourlyUsage: results.hourlyUsage.status === 'rejected',
        });

        const safeData = (result, defaultValue) => (result?.status === 'fulfilled' ? result.value : defaultValue);

        if (isCancelled) return;

        setData({
          dau: safeData(results.dau, []),
          onboarding: safeData(results.onboarding, {}),
          aiHealth: safeData(results.aiHealth, []),
          hourly: safeData(results.hourly, []),
          engagement: safeData(results.engagement, []),
          userReports: safeData(results.userReports, []),
          usageSummary: safeData(results.usageSummary, {
            total_requests: 0,
            active_users: 0,
            avg_requests_per_user: 0,
            avg_tokens: 0,
            avg_response_time: 0,
          }),
          onboardedUsers: safeData(results.onboardedUsers, []),
          segmentComparison: safeData(results.segmentComparison, { comparisons: [] }),
          ageGroup: safeData(results.ageGroup, []),
          timeRange: safeData(results.timeRange, []),
          genderInsights: safeData(results.genderInsights, []),
          weightInsights: safeData(results.weightInsights, []),
          heightInsights: safeData(results.heightInsights, []),
          usersByAgeGroup: safeData(results.usersByAgeGroup, []),
          usersByGender: safeData(results.usersByGender, []),
          usersByWeight: safeData(results.usersByWeight, []),
          usersByHeight: safeData(results.usersByHeight, []),
          hourlyUsage: safeData(results.hourlyUsage, []),
        });
      } catch (err) {
        console.error('Unexpected error in loadData:', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [dataMode, navigate, startDate, endDate, granularity, includeAdmins]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const handleDownloadReport = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    try {
      const queryParams = { start: startDate, end: endDate };
      await api.downloadAnalyticsReport(token, queryParams, dataMode, includeAdmins);
    } catch (err) {
      console.error('Failed to download report', err);
      // maybe add a toast error handling here if the app uses one
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">{t('loading')}</div>;
  }

  if (!data) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">{t('loadFailed')}</div>;
  }

  const unknownLabel = t('common:fallback.unknown');
  const msSuffix = ` ${t('common:units.ms')}`;
  const funnelData = [
    { stage: t('overview.funnel.appInstalled'), count: data.onboarding?.app_started_users || 0 },
    { stage: t('overview.funnel.registered'), count: data.onboarding?.register_success_users || 0 },
    { stage: t('overview.funnel.onboarding'), count: data.onboarding?.onboarding_started_users || 0 },
    { stage: t('overview.funnel.createdPet'), count: data.onboarding?.pet_created_users || 0 },
  ];

  const processedAiHealth = (data.aiHealth || []).map((item) => ({
    ...item,
    dayLabel: formatDate(item.day, language, { month: 'short', day: 'numeric' }) || unknownLabel,
  })).reverse();

  const processedHourly = (data.hourly || []).map((item) => ({
    ...item,
    hourLabel: formatDateTime(item.hour_bucket, language, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) || unknownLabel,
  })).reverse();

  const processedDau = (data.dau || []).map((item) => ({
    ...item,
    dayLabel: formatDate(item.day, language, { month: 'short', day: 'numeric' }) || unknownLabel,
  })).reverse();

  const ageGroupData = (data.ageGroup || []).map((item) => ({
    ...item,
    age_group_label: getAgeGroupLabel(item.age_group || 'unknown', t),
  }));

  const genderInsightsData = (data.genderInsights || []).map((item) => ({
    ...item,
    gender_label: getGenderLabel(item.gender || 'unknown', t),
  }));

  const weightInsightsData = (data.weightInsights || []).map((item) => ({
    ...item,
    dimension: 'weight',
    bucket_label: getWeightBucketLabel(item.bucket || 'unknown', t),
  }));

  const heightInsightsData = (data.heightInsights || []).map((item) => ({
    ...item,
    dimension: 'height',
    bucket_label: getHeightBucketLabel(item.bucket || 'unknown', t),
  }));

  const usersByAgeGroupData = (data.usersByAgeGroup || []).map((item) => ({
    ...item,
    age_group_label: getAgeGroupLabel(item.age_group || 'unknown', t),
  }));

  const usersByGenderData = (data.usersByGender || []).map((item) => ({
    ...item,
    gender_label: getGenderLabel(item.gender || 'unknown', t),
  }));

  const usersByWeightData = (data.usersByWeight || []).map((item) => ({
    ...item,
    bucket_label: getWeightBucketLabel(item.bucket || 'unknown', t),
  }));

  const usersByHeightData = (data.usersByHeight || []).map((item) => ({
    ...item,
    bucket_label: getHeightBucketLabel(item.bucket || 'unknown', t),
  }));

  const usageSummary = data.usageSummary || {
    total_requests: 0,
    active_users: 0,
    avg_requests_per_user: 0,
    avg_tokens: 0,
    avg_response_time: 0,
  };

  const timeRangeList = Array.isArray(data.timeRange?.timeline) ? data.timeRange.timeline : data.timeRange;
  const timeRangeData = Array.isArray(timeRangeList)
    ? timeRangeList.map((item) => {
        const rawDisplayTime = item.bucket || item.timestamp || item.date || item.day || unknownLabel;

        return {
          ...item,
          requests_count: getValidNumber(item.requests_count),
          total_tokens: getValidNumber(item.total_tokens),
          avg_response_time_ms: getValidNumber(item.avg_response_time_ms),
          displayTimeLabel: formatTimelineLabel(rawDisplayTime, language, granularity) || unknownLabel,
        };
      })
    : [];

  const onboardedUsersData = Array.isArray(data.onboardedUsers) ? data.onboardedUsers : [];
  const userReportsData = (data.userReports || []).map((item) => ({
    ...item,
    user_id: String(item.user_id || ''),
    requests_count: getValidNumber(item.requests_count),
    sessions_count: getValidNumber(item.sessions_count),
    total_tokens: getValidNumber(item.total_tokens),
    avg_response_time_ms: getValidNumber(item.avg_response_time_ms),
    rate_limit_exceeded_count: getValidNumber(item.rate_limit_exceeded_count),
    displayLabel: getUserDisplayLabel(item.email, unknownLabel),
  }));

  const engagementRows = (data.engagement || []).map((item) => ({
    ...item,
    user_id: String(item.user_id || ''),
    meals_events_count: getValidNumber(item.meals_events_count),
    training_events_count: getValidNumber(item.training_events_count),
  }));

  const engagementMap = new Map(engagementRows.map((item) => [item.user_id, item]));

  const userUsageById = new Map(userReportsData.map((user) => [user.user_id, user]));
  const onboardedUsersInRange = onboardedUsersData.filter((user) => isWithinDateRange(user.created_at, startDate, endDate));
  const onboardedUsersWithUsageCount = onboardedUsersData.filter(
    (user) => getValidNumber(userUsageById.get(String(user.id))?.requests_count) > 0,
  ).length;
  const zeroUsageOnboardedCount = Math.max(onboardedUsersData.length - onboardedUsersWithUsageCount, 0);
  const avgRequestsPerOnboarded = onboardedUsersData.length > 0
    ? onboardedUsersData.reduce(
        (sum, user) => sum + getValidNumber(userUsageById.get(String(user.id))?.requests_count),
        0,
      ) / onboardedUsersData.length
    : 0;

  const onboardedTimelineMap = onboardedUsersInRange.reduce((accumulator, user) => {
    const dateKey = extractDateKey(user.created_at);
    if (!dateKey) return accumulator;
    accumulator[dateKey] = (accumulator[dateKey] || 0) + 1;
    return accumulator;
  }, {});

  const onboardedTimelineData = Object.entries(onboardedTimelineMap)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([day, count]) => ({
      day,
      count,
      dayLabel: formatDate(day, language, { month: 'short', day: 'numeric' }) || day,
    }));

  const analyticsTrendOptions = [
    { value: 'requests', label: t('analytics.usageTrends.metrics.requests') },
    { value: 'tokens', label: t('analytics.usageTrends.metrics.tokens') },
    { value: 'avgResponseTime', label: t('analytics.usageTrends.metrics.avgResponseTime') },
  ];

  const granularityOptions = [{ value: 'hour', label: t('filters.options.hour') },{ value: 'day', label: t('filters.options.day') },{ value: 'week', label: t('filters.options.week') },{ value: 'month', label: t('filters.options.month') }];

    const analyticsTrendConfig = {
    requests: {
      dataKey: 'requests_count',
      label: t('analytics.usageTrends.metrics.requests'),
      color: '#3B82F6',
      formatOptions: { maximumFractionDigits: 0 },
    },
    tokens: {
      dataKey: 'total_tokens',
      label: t('analytics.usageTrends.metrics.tokens'),
      color: '#10B981',
      formatOptions: { maximumFractionDigits: 0 },
    },
    avgResponseTime: {
      dataKey: 'avg_response_time_ms',
      label: t('analytics.usageTrends.metrics.avgResponseTime'),
      color: '#F59E0B',
      formatOptions: { suffix: msSuffix },
    },
  };

  const selectedTrendMetric = analyticsTrendConfig[analyticsTrendMetric];
  const analyticsTrendData = timeRangeData.map((item) => ({
    ...item,
    metric_value: getValidNumber(item[selectedTrendMetric.dataKey]),
  }));
  const requestsTrendData = timeRangeData.map((item) => ({
    ...item,
    metric_value: item.requests_count,
  }));

  const topUsersData = userReportsData.slice(0, 10);
  const userIntensityChartData = topUsersData.slice(0, 8);
  const engagementComparisonData = userReportsData
    .map((user) => {
      const engagement = engagementMap.get(user.user_id);
      const mealsEventsCount = getValidNumber(engagement?.meals_events_count);
      const trainingEventsCount = getValidNumber(engagement?.training_events_count);

      return {
        ...user,
        meals_events_count: mealsEventsCount,
        training_events_count: trainingEventsCount,
        engagement_total: mealsEventsCount + trainingEventsCount,
      };
    })
    .filter((user) => user.engagement_total > 0 || user.requests_count > 0 || user.sessions_count > 0);

  const engagedUsers = engagementComparisonData.filter((user) => user.engagement_total > 0);
  const noEngagementUsers = engagementComparisonData.filter((user) => user.engagement_total === 0);
  const usersWithBothSignals = engagementComparisonData.filter(
    (user) => user.engagement_total > 0 && user.requests_count > 0,
  ).length;
  const avgRequestsAmongEngaged = engagedUsers.length > 0
    ? engagedUsers.reduce((sum, user) => sum + user.requests_count, 0) / engagedUsers.length
    : 0;
  const avgRequestsWithoutEngagement = noEngagementUsers.length > 0
    ? noEngagementUsers.reduce((sum, user) => sum + user.requests_count, 0) / noEngagementUsers.length
    : 0;

  const totalOnboardedUsersValue = errors.onboardedUsers
    ? getValidNumber(data.onboarding?.pet_created_users)
    : onboardedUsersData.length;

  const analyticsOverviewMetrics = [
    {
      key: 'totalRequests',
      title: t('analytics.usageOverview.metrics.totalRequests.title'),
      value: formatMetricValue(usageSummary.total_requests, language, { maximumFractionDigits: 0 }),
      subtitle: t('analytics.usageOverview.metrics.totalRequests.subtitle'),
    },
    {
      key: 'activeUsers',
      title: t('analytics.usageOverview.metrics.activeUsers.title'),
      value: formatMetricValue(usageSummary.active_users, language, { maximumFractionDigits: 0 }),
      subtitle: t('analytics.usageOverview.metrics.activeUsers.subtitle'),
    },
    {
      key: 'requestsPerActiveUser',
      title: t('analytics.usageOverview.metrics.requestsPerActiveUser.title'),
      value: formatMetricValue(usageSummary.avg_requests_per_user, language),
      subtitle: t('analytics.usageOverview.metrics.requestsPerActiveUser.subtitle'),
    },
    {
      key: 'avgTokensPerRequest',
      title: t('analytics.usageOverview.metrics.avgTokensPerRequest.title'),
      value: formatMetricValue(usageSummary.avg_tokens, language),
      subtitle: t('analytics.usageOverview.metrics.avgTokensPerRequest.subtitle'),
    },
    {
      key: 'avgResponseTime',
      title: t('analytics.usageOverview.metrics.avgResponseTime.title'),
      value: formatMetricValue(usageSummary.avg_response_time, language, { suffix: msSuffix }),
      subtitle: t('analytics.usageOverview.metrics.avgResponseTime.subtitle'),
    },
    {
      key: 'totalOnboardedUsers',
      title: t('analytics.usageOverview.metrics.totalOnboardedUsers.title'),
      value: formatMetricValue(totalOnboardedUsersValue, language, { maximumFractionDigits: 0 }),
      subtitle: t(
        errors.onboardedUsers
          ? 'analytics.usageOverview.metrics.totalOnboardedUsers.subtitleFallback'
          : 'analytics.usageOverview.metrics.totalOnboardedUsers.subtitle',
      ),
    },
  ];

  const demographicsMetricOptions = [
    { value: 'requests', label: t('demographics.metricOptions.requests') },
    { value: 'avgTokens', label: t('demographics.metricOptions.avgTokens') },
    { value: 'avgResponseTime', label: t('demographics.metricOptions.avgResponseTime') },
  ];

  const demographicsMetricConfig = {
    requests: {
      dataKey: 'requests_count',
      label: t('demographics.metricOptions.requests'),
      seriesName: t('chartSeries.requests'),
    },
    avgTokens: {
      dataKey: 'avg_tokens',
      label: t('demographics.metricOptions.avgTokens'),
      seriesName: t('tooltips.usageMetrics.avgTokens'),
    },
    avgResponseTime: {
      dataKey: 'avg_response_time',
      label: t('demographics.metricOptions.avgResponseTime'),
      seriesName: t('tooltips.usageMetrics.avgResponseTime'),
    },
  };

  const selectedDemographicsMetric = demographicsMetricConfig[demographicsMetric];
  const segmentComparisons = Array.isArray(data.segmentComparison?.comparisons) ? data.segmentComparison.comparisons : [];
  const equalSegmentComparisonFallbacks = new Map(
    [
      buildEqualSegmentComparison(ageGroupData, { dimension: 'age', segmentKey: 'age_group' }),
      buildEqualSegmentComparison(genderInsightsData, { dimension: 'gender', segmentKey: 'gender' }),
      buildEqualSegmentComparison(weightInsightsData, { dimension: 'weight', segmentKey: 'bucket' }),
      buildEqualSegmentComparison(heightInsightsData, { dimension: 'height', segmentKey: 'bucket' }),
    ]
      .filter(Boolean)
      .map((comparison) => [comparison.dimension, comparison]),
  );
  const segmentComparisonsByDimension = new Map(
    segmentComparisons.map((comparison) => [String(comparison.dimension || '').trim().toLowerCase(), comparison]),
  );
  const expectedSegmentComparisonCards = SEGMENT_COMPARISON_DIMENSIONS.map((dimension) => ({
    dimension,
    comparison: segmentComparisonsByDimension.get(dimension) || equalSegmentComparisonFallbacks.get(dimension),
  }));
  const extraSegmentComparisonCards = segmentComparisons
    .filter((comparison) => !SEGMENT_COMPARISON_DIMENSIONS.includes(String(comparison.dimension || '').trim().toLowerCase()))
    .map((comparison) => ({
      dimension: String(comparison.dimension || '').trim().toLowerCase(),
      comparison,
    }));
  const segmentComparisonCards = [...expectedSegmentComparisonCards, ...extraSegmentComparisonCards];
  const telemetryTotals = (data.hourly || []).reduce(
    (accumulator, item) => ({
      telemetryEvents: accumulator.telemetryEvents + getValidNumber(item.telemetry_events_count),
      frontendEvents: accumulator.frontendEvents + getValidNumber(item.frontend_events_count),
      backendEvents: accumulator.backendEvents + getValidNumber(item.backend_events_count),
      aiSuccess: accumulator.aiSuccess + getValidNumber(item.ai_success_count),
    }),
    {
      telemetryEvents: 0,
      frontendEvents: 0,
      backendEvents: 0,
      aiSuccess: 0,
    },
  );

  const telemetryMetrics = [
    {
      key: 'telemetryEvents',
      title: t('telemetry.overview.metrics.telemetryEvents.title'),
      value: formatMetricValue(telemetryTotals.telemetryEvents, language, { maximumFractionDigits: 0 }),
      subtitle: t('telemetry.overview.metrics.telemetryEvents.subtitle'),
    },
    {
      key: 'frontendEvents',
      title: t('telemetry.overview.metrics.frontendEvents.title'),
      value: formatMetricValue(telemetryTotals.frontendEvents, language, { maximumFractionDigits: 0 }),
      subtitle: t('telemetry.overview.metrics.frontendEvents.subtitle'),
    },
    {
      key: 'backendEvents',
      title: t('telemetry.overview.metrics.backendEvents.title'),
      value: formatMetricValue(telemetryTotals.backendEvents, language, { maximumFractionDigits: 0 }),
      subtitle: t('telemetry.overview.metrics.backendEvents.subtitle'),
    },
    {
      key: 'aiSuccess',
      title: t('telemetry.overview.metrics.aiSuccess.title'),
      value: formatMetricValue(telemetryTotals.aiSuccess, language, { maximumFractionDigits: 0 }),
      subtitle: t('telemetry.overview.metrics.aiSuccess.subtitle'),
    },
  ];

  const activeNavItem = NAV_ITEMS.find((item) => item.id === activeTab);
  const activeTabTitle = activeNavItem ? t(activeNavItem.labelKey) : t('headerFallback');
  const normalizedDataMode = normalizeDataMode(dataMode);
  const isTestDataMode = normalizedDataMode === 'test';

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex items-center border-b border-gray-800">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              {t('title')}
            </span>
          </div>
          <nav className="p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={20} className="mr-3 shrink-0" />
                  {t(item.labelKey)}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3 shrink-0" /> {t('common:actions.logout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-900 p-8 h-screen overflow-y-auto">
        <header className="mb-8 pb-4 border-b border-gray-800">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              {activeTabTitle}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                isTestDataMode
                  ? 'border border-amber-400/40 bg-amber-500/15 text-amber-200'
                  : 'border border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
              }`}
            >
              {isTestDataMode ? t('common:dataMode.badges.test') : t('common:dataMode.badges.production')}
            </span>
          </div>
        </header>

        <div className="flex flex-wrap items-start sm:items-center gap-4 mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm font-semibold whitespace-nowrap">{t('filters.startDate')}:</label>
            <input
              aria-label={t('filters.startDate')}
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm font-semibold whitespace-nowrap">{t('filters.endDate')}:</label>
            <input
              aria-label={t('filters.endDate')}
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:ml-auto sm:w-auto sm:justify-end">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 shadow-sm"
              title="Download Report"
            >
              <Download size={16} />
              Export Report
            </button>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 font-medium mr-2">
              <input
                type="checkbox"
                checked={includeAdmins}
                onChange={(e) => setIncludeAdmins(e.target.checked)}
                className="rounded border-gray-700 bg-gray-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
              />
              Include Admins
            </label>
            <DataModeToggle
              value={dataMode}
              onChange={setDataMode}
              className="w-full justify-center sm:w-auto"
            />
            <LanguageToggle className="w-full justify-center sm:w-auto shrink-0" />
          </div>
        </div>
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div
                className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={handleInteractionsClick}
              >
                <Activity className="text-blue-400 mr-4" size={32} />
                <div>
                  <p className="text-gray-400">{t('overview.totalEngagements')}</p>
                  <p className="text-2xl font-bold text-white">
                    {errors.dau ? (
                      <span className="text-red-400 text-lg">{t('common:states.error')}</span>
                    ) : (
                      formatMetricValue(data.dau?.length > 0 ? data.dau[0].total_events_count : 0, language, { maximumFractionDigits: 0 })
                    )}
                  </p>
                </div>
              </div>
              <div
                className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={handleOnboardedClick}
              >
                <Users className="text-emerald-400 mr-4" size={32} />
                <div>
                  <p className="text-gray-400">{t('overview.onboardedUsers')}</p>
                  <p className="text-2xl font-bold text-white">
                    {errors.onboardedUsers && errors.onboarding ? (
                      <span className="text-red-400 text-lg">{t('common:states.error')}</span>
                    ) : (
                      formatMetricValue(totalOnboardedUsersValue, language, { maximumFractionDigits: 0 })
                    )}
                  </p>
                </div>
              </div>
              <div
                className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={handleDauClick}
              >
                <Database className="text-purple-400 mr-4" size={32} />
                <div>
                  <p className="text-gray-400">{t('overview.todayDau')}</p>
                  <p className="text-2xl font-bold text-white">
                    {errors.dau ? (
                      <span className="text-red-400 text-lg">{t('common:states.error')}</span>
                    ) : (
                      formatMetricValue(data.dau?.length > 0 ? data.dau[0].active_users_count : 0, language, { maximumFractionDigits: 0 })
                    )}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
                <ShieldAlert className="text-red-400 mr-4" size={32} />
                <div>
                  <p className="text-gray-400">{t('overview.recentApiErrors')}</p>
                  <p className="text-2xl font-bold text-white">
                    {errors.aiHealth ? (
                      <span className="text-red-400 text-lg">{t('common:states.error')}</span>
                    ) : (
                      formatMetricValue(data.aiHealth?.length > 0 ? data.aiHealth[0].provider_failures : 0, language, { maximumFractionDigits: 0 })
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <ChartCard title={t('overview.charts.dau')}>
                {errors.dau ? (
                  <div className="flex h-full items-center justify-center text-red-500">{t('overview.errors.dau')}</div>
                ) : (
                  <ResponsiveContainer>
                    <BarChart data={processedDau}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="dayLabel" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        cursor={{ fill: '#374151' }}
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                        formatter={(value, name) => [formatMetricValue(value, language), name]}
                      />
                      <Bar
                        dataKey="active_users_count"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                        name={t('chartSeries.activeUsers')}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <div className="mb-8">
              <SectionHeader
                title={t('analytics.usageOverview.title')}
                description={t('analytics.usageOverview.description')}
              />
              {errors.usageSummary ? (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-red-500">
                  {t('analytics.usageOverview.error')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
                  {analyticsOverviewMetrics.map((metric) => (
                    <MetricCard key={metric.key} title={metric.title} value={metric.value} subtitle={metric.subtitle} />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeader title={t('analytics.usageTrends.title')} description={t('analytics.usageTrends.description')} /> <div className="flex flex-col sm:flex-row gap-4"> <MetricToggle label={t('filters.granularity')} options={granularityOptions} value={granularity} onChange={setGranularity} /> <MetricToggle label={t('analytics.usageTrends.metricToggleLabel')} options={analyticsTrendOptions} value={analyticsTrendMetric} onChange={setAnalyticsTrendMetric} /> </div> </div>
              <ChartCard title={t('analytics.usageTrends.chartTitle', { metric: selectedTrendMetric.label })}>
                {errors.timeRange ? (
                  <div className="flex h-full items-center justify-center text-red-500">{t('analytics.usageTrends.error')}</div>
                ) : analyticsTrendData.length > 0 ? (
                  <ResponsiveContainer>
                    <LineChart data={analyticsTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="displayTimeLabel" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        cursor={{ fill: '#374151' }}
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                        formatter={(value) => [formatMetricValue(value, language, selectedTrendMetric.formatOptions), selectedTrendMetric.label]}
                      />
                      <Line
                        type="monotone"
                        dataKey="metric_value"
                        stroke={selectedTrendMetric.color}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name={selectedTrendMetric.label}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    {t('analytics.usageTrends.empty')}
                  </div>
                )}
              </ChartCard>
            </div>

            <div className="mb-8">
              <SectionHeader
                title={t('analytics.userIntensity.title')}
                description={t('analytics.userIntensity.description')}
              />
              {errors.userReports ? (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-red-500">
                  {t('analytics.userIntensity.errors.users')}
                </div>
              ) : topUsersData.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.4fr] gap-8">
                  <ChartCard title={t('analytics.userIntensity.charts.intensity')}>
                    <ResponsiveContainer>
                      <BarChart data={userIntensityChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal vertical={false} />
                        <XAxis type="number" stroke="#9CA3AF" />
                        <YAxis dataKey="displayLabel" type="category" stroke="#9CA3AF" width={120} fontSize={12} />
                        <Tooltip cursor={{ fill: '#374151' }} content={<UserIntensityTooltip />} />
                        <Bar
                          dataKey="requests_count"
                          fill="#3B82F6"
                          radius={[0, 4, 4, 0]}
                          name={t('analytics.userIntensity.table.headers.requests')}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ContentCard
                    title={t('analytics.userIntensity.table.title')}
                    description={t('analytics.userIntensity.table.description')}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] text-sm text-left">
                        <thead className="text-gray-400 border-b border-gray-700">
                          <tr>
                            <th className="py-3 pr-4 font-semibold">{t('analytics.userIntensity.table.headers.user')}</th>
                            <th className="py-3 pr-4 font-semibold">{t('analytics.userIntensity.table.headers.requests')}</th>
                            <th className="py-3 pr-4 font-semibold">{t('analytics.userIntensity.table.headers.sessions')}</th>
                            <th className="py-3 pr-4 font-semibold">{t('analytics.userIntensity.table.headers.totalTokens')}</th>
                            <th className="py-3 pr-4 font-semibold">{t('analytics.userIntensity.table.headers.avgResponseTime')}</th>
                            <th className="py-3 font-semibold">{t('analytics.userIntensity.table.headers.rateLimits')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topUsersData.map((user) => (
                            <tr key={user.user_id} className="border-b border-gray-800 last:border-b-0">
                              <td className="py-3 pr-4 text-white font-medium break-all">{user.email || unknownLabel}</td>
                              <td className="py-3 pr-4 text-gray-300">{formatMetricValue(user.requests_count, language, { maximumFractionDigits: 0 })}</td>
                              <td className="py-3 pr-4 text-gray-300">{formatMetricValue(user.sessions_count, language, { maximumFractionDigits: 0 })}</td>
                              <td className="py-3 pr-4 text-gray-300">{formatMetricValue(user.total_tokens, language, { maximumFractionDigits: 0 })}</td>
                              <td className="py-3 pr-4 text-gray-300">{formatMetricValue(user.avg_response_time_ms, language, { suffix: msSuffix })}</td>
                              <td className="py-3 text-gray-300">{formatMetricValue(user.rate_limit_exceeded_count, language, { maximumFractionDigits: 0 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ContentCard>
                </div>
              ) : (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-gray-400">
                  {t('analytics.userIntensity.empty.users')}
                </div>
              )}
            </div>

            <div className="mb-8">
              <SectionHeader
                title={t('analytics.adoption.title')}
                description={t('analytics.adoption.description')}
              />
              {errors.onboardedUsers ? (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-red-500">
                  {t('analytics.adoption.errors.onboarded')}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                    <MetricCard
                      title={t('analytics.adoption.metrics.totalOnboardedUsers.title')}
                      value={formatMetricValue(onboardedUsersData.length, language, { maximumFractionDigits: 0 })}
                      subtitle={t('analytics.adoption.metrics.totalOnboardedUsers.subtitle')}
                    />
                    <MetricCard
                      title={t('analytics.adoption.metrics.onboardedInRange.title')}
                      value={formatMetricValue(onboardedUsersInRange.length, language, { maximumFractionDigits: 0 })}
                      subtitle={t('analytics.adoption.metrics.onboardedInRange.subtitle')}
                    />
                    <MetricCard
                      title={t('analytics.adoption.metrics.zeroUsage.title')}
                      value={formatMetricValue(zeroUsageOnboardedCount, language, { maximumFractionDigits: 0 })}
                      subtitle={t('analytics.adoption.metrics.zeroUsage.subtitle')}
                    />
                    <MetricCard
                      title={t('analytics.adoption.metrics.avgRequestsPerOnboarded.title')}
                      value={formatMetricValue(avgRequestsPerOnboarded, language)}
                      subtitle={t('analytics.adoption.metrics.avgRequestsPerOnboarded.subtitle')}
                    />
                  </div>

                  <ChartCard
                    title={t('analytics.adoption.charts.onboardedOverTime')}
                    description={t('analytics.adoption.charts.onboardedOverTimeDescription')}
                  >
                    {onboardedTimelineData.length > 0 ? (
                      <ResponsiveContainer>
                        <BarChart data={onboardedTimelineData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="dayLabel" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            cursor={{ fill: '#374151' }}
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                            formatter={(value, name) => [formatMetricValue(value, language, { maximumFractionDigits: 0 }), name]}
                          />
                          <Bar
                            dataKey="count"
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                            name={t('analytics.adoption.charts.onboardedSeries')}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        {t('analytics.adoption.empty.onboarded')}
                      </div>
                    )}
                  </ChartCard>
                </>
              )}
            </div>

            <div className="mb-8">
              <SectionHeader
                title={t('analytics.engagement.title')}
                description={t('analytics.engagement.description')}
              />
              {errors.userReports || errors.engagement ? (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-red-500">
                  {t('analytics.engagement.errors.engagement')}
                </div>
              ) : engagementComparisonData.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <MetricCard
                      title={t('analytics.engagement.metrics.engagedAvgRequests.title')}
                      value={formatMetricValue(avgRequestsAmongEngaged, language)}
                      subtitle={t('analytics.engagement.metrics.engagedAvgRequests.subtitle')}
                    />
                    <MetricCard
                      title={t('analytics.engagement.metrics.noEngagementAvgRequests.title')}
                      value={formatMetricValue(avgRequestsWithoutEngagement, language)}
                      subtitle={t('analytics.engagement.metrics.noEngagementAvgRequests.subtitle')}
                    />
                    <MetricCard
                      title={t('analytics.engagement.metrics.overlapUsers.title')}
                      value={formatMetricValue(usersWithBothSignals, language, { maximumFractionDigits: 0 })}
                      subtitle={t('analytics.engagement.metrics.overlapUsers.subtitle')}
                    />
                  </div>

                  <ChartCard title={t('analytics.engagement.charts.scatter')}>
                    <ResponsiveContainer>
                      <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          type="number"
                          dataKey="engagement_total"
                          name={t('analytics.engagement.axis.engagement')}
                          stroke="#9CA3AF"
                          tickMargin={10}
                        />
                        <YAxis
                          type="number"
                          dataKey="requests_count"
                          name={t('analytics.engagement.axis.requests')}
                          stroke="#9CA3AF"
                        />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<EngagementScatterTooltip />} />
                        <Scatter data={engagementComparisonData} fill="#38BDF8" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </>
              ) : (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-gray-400">
                  {t('analytics.engagement.empty.engagement')}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'demographics' && (
          <>
            <div className="mb-8">
              <SectionHeader
                title={t('demographics.userDistribution.title')}
                description={t('demographics.userDistribution.description')}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title={t('demographics.userDistribution.charts.age')}>
                  {errors.usersByAgeGroup ? (
                    <div className="flex h-full items-center justify-center text-red-500">{t('demographics.userDistribution.errors.age')}</div>
                  ) : usersByAgeGroupData.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={usersByAgeGroupData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="age_group_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          cursor={{ fill: '#374151' }}
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                          formatter={(value, name) => [formatMetricValue(value, language), name]}
                        />
                        <Bar dataKey="users_count" fill="#F59E0B" radius={[4, 4, 0, 0]} name={t('chartSeries.users')} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      {t('demographics.userDistribution.empty.age')}
                    </div>
                  )}
                </ChartCard>

                <ChartCard title={t('demographics.userDistribution.charts.gender')}>
                  {errors.usersByGender ? (
                    <div className="flex h-full items-center justify-center text-red-500">{t('demographics.userDistribution.errors.gender')}</div>
                  ) : usersByGenderData.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={usersByGenderData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="gender_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          cursor={{ fill: '#374151' }}
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                          formatter={(value, name) => [formatMetricValue(value, language), name]}
                        />
                        <Bar dataKey="users_count" fill="#06B6D4" radius={[4, 4, 0, 0]} name={t('chartSeries.users')} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      {t('demographics.userDistribution.empty.gender')}
                    </div>
                  )}
                </ChartCard>

                <ChartCard title={t('demographics.userDistribution.charts.weight')}>
                  {errors.usersByWeight ? (
                    <div className="flex h-full items-center justify-center text-red-500">{t('demographics.userDistribution.errors.weight')}</div>
                  ) : usersByWeightData.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={usersByWeightData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="bucket_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          cursor={{ fill: '#374151' }}
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                          formatter={(value, name) => [formatMetricValue(value, language), name]}
                        />
                        <Bar dataKey="users_count" fill="#22C55E" radius={[4, 4, 0, 0]} name={t('chartSeries.users')} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      {t('demographics.userDistribution.empty.weight')}
                    </div>
                  )}
                </ChartCard>

                <ChartCard title={t('demographics.userDistribution.charts.height')}>
                  {errors.usersByHeight ? (
                    <div className="flex h-full items-center justify-center text-red-500">{t('demographics.userDistribution.errors.height')}</div>
                  ) : usersByHeightData.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={usersByHeightData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="bucket_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          cursor={{ fill: '#374151' }}
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                          formatter={(value, name) => [formatMetricValue(value, language), name]}
                        />
                        <Bar dataKey="users_count" fill="#A855F7" radius={[4, 4, 0, 0]} name={t('chartSeries.users')} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      {t('demographics.userDistribution.empty.height')}
                    </div>
                  )}
                </ChartCard>
              </div>
            </div>

            <div className="mb-8">
              <SectionHeader
                title="Hourly AI Usage Pattern"
                description="Distribution of AI requests continuously across 24 hours of the day"
              />
              <div className="grid grid-cols-1 gap-8">
                <ChartCard title="Hourly Requests">
                  {errors.hourlyUsage ? (
                    <div className="flex h-full items-center justify-center text-red-500">Failed to load hourly usage</div>
                  ) : data.hourlyUsage && data.hourlyUsage.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={data.hourlyUsage}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={12} tickMargin={10} interval={1} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          cursor={{ fill: '#374151' }}
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                          labelFormatter={(label) => `${label} - ${label.replace(':00', ':59')}`}
                          formatter={(value) => [value, 'AI Requests']}
                        />
                        <Bar dataKey="requests_count" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Requests" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      No hourly usage data available
                    </div>
                  )}
                </ChartCard>
              </div>
            </div>

            <div className="mb-8">
              <SectionHeader
                title={t('demographics.segmentComparison.title')}
                description={t('demographics.segmentComparison.description')}
              />
              {errors.segmentComparison ? (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-red-500">
                  {t('demographics.segmentComparison.error')}
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {segmentComparisonCards.map(({ dimension, comparison }) => (
                    comparison ? (
                      <SegmentComparisonCard key={`${comparison.dimension}-${comparison.metric}`} comparison={comparison} />
                    ) : (
                      <SegmentComparisonEmptyCard key={dimension} dimension={dimension} />
                    )
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeader
                  title={t('demographics.usageBySegment.title')}
                  description={t('demographics.usageBySegment.description')}
                />
                <MetricToggle
                  label={t('demographics.metricToggleLabel')}
                  options={demographicsMetricOptions}
                  value={demographicsMetric}
                  onChange={setDemographicsMetric}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title={t('demographics.usageBySegment.charts.age', { metric: selectedDemographicsMetric.label })}>
                  {errors.ageGroup ? (
                    <div className="flex h-full items-center justify-center text-red-500">{t('demographics.usageBySegment.errors.age')}</div>
                  ) : ageGroupData.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={ageGroupData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="age_group_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip cursor={{ fill: '#374151' }} content={<UsageMetricsTooltip labelKey="age_group" />} />
                        <Bar dataKey={selectedDemographicsMetric.dataKey} fill="#EC4899" radius={[4, 4, 0, 0]} name={selectedDemographicsMetric.seriesName} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      {t('demographics.usageBySegment.empty.age')}
                    </div>
                  )}
                </ChartCard>

                <ChartCard title={t('demographics.usageBySegment.charts.gender', { metric: selectedDemographicsMetric.label })}>
                  {errors.genderInsights ? (
                    <div className="flex h-full items-center justify-center text-red-500">{t('demographics.usageBySegment.errors.gender')}</div>
                  ) : genderInsightsData.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={genderInsightsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="gender_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip cursor={{ fill: '#374151' }} content={<UsageMetricsTooltip labelKey="gender" />} />
                        <Bar dataKey={selectedDemographicsMetric.dataKey} fill="#3B82F6" radius={[4, 4, 0, 0]} name={selectedDemographicsMetric.seriesName} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      {t('demographics.usageBySegment.empty.gender')}
                    </div>
                  )}
                </ChartCard>

                <ChartCard title={t('demographics.usageBySegment.charts.weight', { metric: selectedDemographicsMetric.label })}>
                  {errors.weightInsights ? (
                    <div className="flex h-full items-center justify-center text-red-500">{t('demographics.usageBySegment.errors.weight')}</div>
                  ) : weightInsightsData.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={weightInsightsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="bucket_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip cursor={{ fill: '#374151' }} content={<UsageMetricsTooltip labelKey="bucket" />} />
                        <Bar dataKey={selectedDemographicsMetric.dataKey} fill="#10B981" radius={[4, 4, 0, 0]} name={selectedDemographicsMetric.seriesName} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      {t('demographics.usageBySegment.empty.weight')}
                    </div>
                  )}
                </ChartCard>

                <ChartCard title={t('demographics.usageBySegment.charts.height', { metric: selectedDemographicsMetric.label })}>
                  {errors.heightInsights ? (
                    <div className="flex h-full items-center justify-center text-red-500">{t('demographics.usageBySegment.errors.height')}</div>
                  ) : heightInsightsData.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={heightInsightsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="bucket_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip cursor={{ fill: '#374151' }} content={<UsageMetricsTooltip labelKey="bucket" />} />
                        <Bar dataKey={selectedDemographicsMetric.dataKey} fill="#8B5CF6" radius={[4, 4, 0, 0]} name={selectedDemographicsMetric.seriesName} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      {t('demographics.usageBySegment.empty.height')}
                    </div>
                  )}
                </ChartCard>
              </div>
            </div>
          </>
        )}

        {activeTab === 'telemetry' && (
          <div className="mb-8">
            <SectionHeader
              title={t('telemetry.overview.title')}
              description={t('telemetry.overview.description')}
            />
            {errors.hourly ? (
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-red-500">
                {t('telemetry.errors.hourly')}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                  {telemetryMetrics.map((metric) => (
                    <MetricCard key={metric.key} title={metric.title} value={metric.value} subtitle={metric.subtitle} />
                  ))}
                </div>
                <ChartCard title={t('telemetry.charts.hourly')} description={t('telemetry.charts.hourlyDescription')}>
                  {processedHourly.length > 0 ? (
                    <ResponsiveContainer>
                      <AreaChart data={processedHourly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="hourLabel" stroke="#9CA3AF" fontSize={11} tickMargin={10} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          cursor={{ fill: '#374151' }}
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                          formatter={(value, name) => [formatMetricValue(value, language), name]}
                        />
                        <Area type="monotone" dataKey="ai_success_count" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name={t('chartSeries.aiSuccess')} />
                        <Area type="monotone" dataKey="telemetry_events_count" stackId="1" stroke="#3B82F6" fill="#3B82F6" name={t('chartSeries.telemetryEvents')} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      {t('telemetry.empty.hourly')}
                    </div>
                  )}
                </ChartCard>
              </>
            )}
          </div>
        )}

        {activeTab === 'system' && (
          <div className="mb-8">
            <ChartCard title={t('system.charts.aiHealth')}>
              {errors.aiHealth ? (
                <div className="flex h-full items-center justify-center text-red-500">{t('system.errors.aiHealth')}</div>
              ) : (
                <ResponsiveContainer>
                  <LineChart data={processedAiHealth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="dayLabel" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      cursor={{ fill: '#374151' }}
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                      formatter={(value, name) => [formatMetricValue(value, language), name]}
                    />
                    <Line type="monotone" dataKey="success_count" stroke="#10B981" strokeWidth={2} name={t('chartSeries.success')} />
                    <Line type="monotone" dataKey="rate_limits_hit" stroke="#EF4444" strokeWidth={2} name={t('chartSeries.rateLimited')} />
                    <Line type="monotone" dataKey="provider_failures" stroke="#F59E0B" strokeWidth={2} name={t('chartSeries.providerErrors')} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(event) => event.stopPropagation()}>
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {t(`modal.${modalType === 'dau' ? 'dauToday' : modalType === 'interactions' ? 'interactionsToday' : 'onboardedUsers'}.title`)}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  aria-label={t('common:actions.close')}
                  className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {!modalLoading && !modalError && modalUsers.length > 0 && (
                  <div className="mb-4">
                    <input
                      type="text"
                      aria-label={t(`modal.${modalType === 'dau' ? 'dauToday' : modalType === 'interactions' ? 'interactionsToday' : 'onboardedUsers'}.searchPlaceholder`)}
                      placeholder={t(`modal.${modalType === 'dau' ? 'dauToday' : modalType === 'interactions' ? 'interactionsToday' : 'onboardedUsers'}.searchPlaceholder`)}
                      value={modalSearch}
                      onChange={(event) => setModalSearch(event.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
                {modalLoading ? (
                  <div className="text-center text-gray-400 py-8">{t(`modal.${modalType === 'dau' ? 'dauToday' : modalType === 'interactions' ? 'interactionsToday' : 'onboardedUsers'}.loading`)}</div>
                ) : modalError ? (
                  <div className="text-center text-red-500 py-8">{t(`modal.${modalType === 'dau' ? 'dauToday' : modalType === 'interactions' ? 'interactionsToday' : 'onboardedUsers'}.error`)}</div>
                ) : modalUsers.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">{t(`modal.${modalType === 'dau' ? 'dauToday' : modalType === 'interactions' ? 'interactionsToday' : 'onboardedUsers'}.empty`)}</div>
                ) : (
                  (() => {
                    const filteredUsers = modalUsers.filter((item) => {
                      const searchLower = modalSearch.toLowerCase();
                      if (modalType === 'dau') {
                        return (item.email || '').toLowerCase().includes(searchLower) || (item.name || '').toLowerCase().includes(searchLower);
                      }
                      if (modalType === 'interactions') {
                        return (item.email || '').toLowerCase().includes(searchLower) || (item.detail || '').toLowerCase().includes(searchLower) || (item.interaction_type || '').toLowerCase().includes(searchLower);
                      }
                      return (item.email || '').toLowerCase().includes(searchLower);
                    });

                    if (filteredUsers.length === 0) {
                      return <div className="text-center text-gray-400 py-8">{t(`modal.${modalType === 'dau' ? 'dauToday' : modalType === 'interactions' ? 'interactionsToday' : 'onboardedUsers'}.noMatches`)}</div>;
                    }

                    return (
                      <div className="space-y-3">
                        {filteredUsers.map((item, idx) => (
                          <div key={item.id || idx} className="bg-gray-900 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center border border-gray-700 gap-4">
                            <div className="flex flex-col min-w-0">
                              <div className="text-white font-medium truncate">
                                {item.email || item.name || unknownLabel}
                                {modalType === 'dau' && item.name && item.email && item.name !== item.email && ` (${item.name})`}
                              </div>
                              {modalType === 'interactions' && (
                                <div className="text-gray-400 text-sm mt-1 truncate">
                                  <span className="text-blue-400 font-medium mr-2">{item.interaction_type}</span>
                                  {item.detail}
                                </div>
                              )}
                            </div>
                            <div className="text-gray-400 text-sm shrink-0">
                              {modalType === 'dau' ? (
                                item.last_active || unknownLabel
                              ) : modalType === 'interactions' ? (
                                item.timestamp || unknownLabel
                              ) : (
                                formatDateTime(item.created_at, language, { dateStyle: 'medium', timeStyle: 'short' }) || unknownLabel
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}





