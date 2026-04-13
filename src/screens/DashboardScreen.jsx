import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { LogOut, Activity, Users, Database, ShieldAlert, LayoutDashboard, Cpu } from 'lucide-react';
import { api } from '../api';
import LanguageToggle from '../components/LanguageToggle';
import { formatDate, formatDateTime, formatMetricValue, formatTimelineLabel } from '../utils/formatters';
import {
  getAgeGroupLabel,
  getGenderLabel,
  getHeightBucketLabel,
  getSegmentValueLabel,
  getWeightBucketLabel,
} from '../utils/analyticsDisplay';

const ChartCard = ({ title, children }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm flex flex-col items-center">
    <h3 className="text-lg font-semibold text-gray-300 mb-4 self-start leading-snug break-words">{title}</h3>
    <div className="w-full h-64">
      {children}
    </div>
  </div>
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

const SegmentComparisonCard = ({ comparison }) => {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const language = i18n.resolvedLanguage;
  const dimensionKey = String(comparison.dimension || '').trim().toLowerCase();
  const metricKey = String(comparison.metric || '').trim();
  const topSegmentLabel = getSegmentValueLabel(dimensionKey, comparison.top_segment, t);
  const bottomSegmentLabel = getSegmentValueLabel(dimensionKey, comparison.bottom_segment, t);
  const backendSummary = typeof comparison.summary === 'string' ? comparison.summary.trim() : '';
  const localizedSummary = t('demographics.segmentComparison.summary', {
    top: topSegmentLabel,
    bottom: bottomSegmentLabel,
    percent: formatMetricValue(comparison.relative_gap_percent, language),
  });

  return (
    <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
        {t(`demographics.segmentComparison.dimensions.${dimensionKey}`, {
          defaultValue: dimensionKey || t('common:fallback.unknown'),
        })}
      </p>
      <div className="space-y-3 mt-4 text-sm">
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-400">{t('demographics.segmentComparison.labels.topSegment')}</span>
          <span className="text-right text-white font-medium">
            {topSegmentLabel} ({formatMetricValue(comparison.top_value, language)})
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-400">{t('demographics.segmentComparison.labels.bottomSegment')}</span>
          <span className="text-right text-white font-medium">
            {bottomSegmentLabel} ({formatMetricValue(comparison.bottom_value, language)})
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-400">{t('demographics.segmentComparison.labels.metric')}</span>
          <span className="text-right text-white font-medium">
            {t(`demographics.segmentComparison.metrics.${metricKey}`, {
              defaultValue: metricKey || t('common:fallback.unknown'),
            })}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-400">{t('demographics.segmentComparison.labels.gap')}</span>
          <span className="text-right text-white font-medium">
            {formatMetricValue(comparison.absolute_gap, language)}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-gray-400">{t('demographics.segmentComparison.labels.differencePercent')}</span>
          <span className="text-right text-white font-medium">
            {formatMetricValue(comparison.relative_gap_percent, language, { suffix: '%' })}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-4">{localizedSummary}</p>
      {backendSummary && backendSummary !== localizedSummary && (
        <p className="text-xs text-gray-500 mt-2">
          {/* Backend currently returns English summary prose. Keep it as fallback until the API is locale-neutral. */}
          {backendSummary}
        </p>
      )}
    </div>
  );
};


const NAV_ITEMS = [
  { id: 'overview', labelKey: 'navigation.overview', icon: LayoutDashboard },
  { id: 'telemetry', labelKey: 'navigation.telemetry', icon: Activity },
  { id: 'demographics', labelKey: 'navigation.demographics', icon: Users },
  { id: 'system', labelKey: 'navigation.system', icon: Cpu },
];

export default function DashboardScreen() {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const language = i18n.resolvedLanguage;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [granularity, setGranularity] = useState('day');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalUsers, setModalUsers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t('pageTitle');
  }, [language, t]);

  const handleOnboardedClick = async () => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError(false);
    setModalSearch('');
    try {
      const token = localStorage.getItem('admin_token');
      const users = await api.getAnalytics('users/onboarded', token);
      setModalUsers(users);
    } catch (err) {
      console.error(err);
      setModalError(true);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem('admin_token');
      try {
        const queryParams = { start: startDate, end: endDate, granularity };
        const demographicsQueryParams = { start: startDate, end: endDate };

        const promiseMap = {
          dau: api.getReport('daily-active-users', token),
          onboarding: api.getReport('onboarding', token),
          aiHealth: api.getReport('ai-health', token),
          hourly: api.getReport('hourly-activity', token),
          engagement: api.getReport('engagement', token),
          usageSummary: api.getAnalytics('usage-summary', token, demographicsQueryParams),
          segmentComparison: api.getAnalytics('segment-comparison', token, demographicsQueryParams),
          ageGroup: api.getAnalytics('by-age-group', token, demographicsQueryParams),
          timeRange: api.getAnalytics('by-time-range', token, queryParams),
          genderInsights: api.getAnalytics('by-gender', token, demographicsQueryParams),
          weightInsights: api.getAnalytics('by-weight-bucket', token, demographicsQueryParams),
          heightInsights: api.getAnalytics('by-height-bucket', token, demographicsQueryParams),
          usersByAgeGroup: api.getAnalytics('users-by-age-group', token),
          usersByGender: api.getAnalytics('users-by-gender', token),
          usersByWeight: api.getAnalytics('users-by-weight-bucket', token),
          usersByHeight: api.getAnalytics('users-by-height-bucket', token),
        };

        const keys = Object.keys(promiseMap);
        const settledResults = await Promise.allSettled(Object.values(promiseMap));
        
        const results = keys.reduce((acc, key, index) => {
          acc[key] = settledResults[index];
          return acc;
        }, {});

        const hasAuthError = Object.values(results).some((result) =>
          result.status === 'rejected' &&
          (result.reason?.status === 401 || result.reason?.status === 403)
        );

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
          usageSummary: results.usageSummary.status === 'rejected',
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
        });

        const safeData = (result, defaultVal) => result?.status === 'fulfilled' ? result.value : defaultVal;

        setData({
          dau: safeData(results.dau, []),
          onboarding: safeData(results.onboarding, {}),
          aiHealth: safeData(results.aiHealth, []),
          hourly: safeData(results.hourly, []),
          engagement: safeData(results.engagement, []),
          usageSummary: safeData(results.usageSummary, {
            total_requests: 0,
            active_users: 0,
            avg_requests_per_user: 0,
            avg_tokens: 0,
            avg_response_time: 0,
          }),
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
        });
      } catch (err) {
        console.error('Unexpected error in loadData:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [navigate, startDate, endDate, granularity]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">{t('loading')}</div>;
  if (!data) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">{t('loadFailed')}</div>;

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
    hourLabel: formatDateTime(item.hour_bucket, language, { hour: 'numeric', minute: '2-digit' }) || unknownLabel,
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

  const usageOverviewMetrics = [
    {
      key: 'total_requests',
      title: t('demographics.usageOverview.metrics.totalRequests.title'),
      value: formatMetricValue(usageSummary.total_requests, language, { maximumFractionDigits: 0 }),
      subtitle: t('demographics.usageOverview.metrics.totalRequests.subtitle'),
    },
    {
      key: 'active_users',
      title: t('demographics.usageOverview.metrics.activeUsers.title'),
      value: formatMetricValue(usageSummary.active_users, language, { maximumFractionDigits: 0 }),
      subtitle: t('demographics.usageOverview.metrics.activeUsers.subtitle'),
    },
    {
      key: 'avg_requests_per_user',
      title: t('demographics.usageOverview.metrics.avgRequestsPerUser.title'),
      value: formatMetricValue(usageSummary.avg_requests_per_user, language),
      subtitle: t('demographics.usageOverview.metrics.avgRequestsPerUser.subtitle'),
    },
    {
      key: 'avg_tokens',
      title: t('demographics.usageOverview.metrics.avgTokens.title'),
      value: formatMetricValue(usageSummary.avg_tokens, language),
      subtitle: t('demographics.usageOverview.metrics.avgTokens.subtitle'),
    },
    {
      key: 'avg_response_time',
      title: t('demographics.usageOverview.metrics.avgResponseTime.title'),
      value: formatMetricValue(usageSummary.avg_response_time, language, { suffix: msSuffix }),
      subtitle: t('demographics.usageOverview.metrics.avgResponseTime.subtitle'),
    },
  ];

  const segmentComparisons = Array.isArray(data.segmentComparison?.comparisons) ? data.segmentComparison.comparisons : [];
  const timeRangeList = data.timeRange?.timeline || data.timeRange || [];
  const timeRangeData = Array.isArray(timeRangeList)
    ? timeRangeList.map((item) => {
        const rawDisplayTime = item.bucket || item.timestamp || item.date || item.day || unknownLabel;

        return {
          ...item,
          displayTimeLabel: formatTimelineLabel(rawDisplayTime, language, granularity) || unknownLabel,
          metric_value: item.requests_count !== undefined
            ? item.requests_count
            : item.total_tokens !== undefined
              ? item.total_tokens
              : item.count || 0,
        };
      })
    : [];

  const activeNavItem = NAV_ITEMS.find((item) => item.id === activeTab);
  const activeTabTitle = activeNavItem ? t(activeNavItem.labelKey) : t('headerFallback');

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar */}
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
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
            <LogOut size={20} className="mr-3 shrink-0" /> {t('common:actions.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-900 p-8 h-screen overflow-y-auto">
        <header className="mb-8 pb-4 border-b border-gray-800">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            {activeTabTitle}
          </h1>
        </header>

        <div className="flex flex-wrap items-start sm:items-center gap-4 mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm font-semibold whitespace-nowrap">{t('filters.startDate')}:</label>
            <input aria-label={t('filters.startDate')} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm font-semibold whitespace-nowrap">{t('filters.endDate')}:</label>
            <input aria-label={t('filters.endDate')} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm font-semibold whitespace-nowrap">{t('filters.granularity')}:</label>
            <select aria-label={t('filters.granularity')} value={granularity} onChange={e => setGranularity(e.target.value)} className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm">
              <option value="hour">{t('filters.options.hour')}</option>
              <option value="day">{t('filters.options.day')}</option>
              <option value="week">{t('filters.options.week')}</option>
              <option value="month">{t('filters.options.month')}</option>
            </select>
          </div>
          <LanguageToggle className="w-full justify-center sm:ml-auto sm:w-auto shrink-0" />
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
              <Activity className="text-blue-400 mr-4" size={32} />
              <div>
                <p className="text-gray-400">{t('overview.totalEngagements')}</p>
                <p className="text-2xl font-bold text-white">
                  {errors.engagement ? (
                    <span className="text-red-400 text-lg">{t('common:states.error')}</span>
                  ) : (
                    formatMetricValue(
                      (data.engagement || []).reduce(
                        (sum, item) => sum + parseInt(item.meals_events_count || 0, 10) + parseInt(item.training_events_count || 0, 10),
                        0,
                      ),
                      language,
                      { maximumFractionDigits: 0 },
                    )
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
                  {errors.onboarding ? (
                    <span className="text-red-400 text-lg">{t('common:states.error')}</span>
                  ) : (
                    formatMetricValue(data.onboarding?.pet_created_users || 0, language, { maximumFractionDigits: 0 })
                  )}
                </p>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
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
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

            <ChartCard title={t('overview.charts.funnel')}>
              {errors.onboarding ? (
                <div className="flex h-full items-center justify-center text-red-500">{t('overview.errors.onboarding')}</div>
              ) : (
                <ResponsiveContainer>
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="stage" type="category" stroke="#9CA3AF" width={150} fontSize={12} />
                    <Tooltip
                      cursor={{ fill: '#374151' }}
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                      formatter={(value, name) => [formatMetricValue(value, language), name]}
                    />
                    <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} name={t('chartSeries.count')} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="mb-8">
            <ChartCard title={t('telemetry.charts.hourly')}>
              {errors.hourly ? (
                <div className="flex h-full items-center justify-center text-red-500">{t('telemetry.errors.hourly')}</div>
              ) : (
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
                    <Area
                      type="monotone"
                      dataKey="ai_success_count"
                      stackId="1"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      name={t('chartSeries.aiSuccess')}
                    />
                    <Area
                      type="monotone"
                      dataKey="telemetry_events_count"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      name={t('chartSeries.telemetryEvents')}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>
        )}

        {activeTab === 'demographics' && (
          <>
            <div className="mb-8">
              <SectionHeader
                title={t('demographics.usageOverview.title')}
                description={t('demographics.usageOverview.description')}
              />
              {errors.usageSummary ? (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-red-500">
                  {t('demographics.usageOverview.error')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                  {usageOverviewMetrics.map((metric) => (
                    <MetricCard
                      key={metric.key}
                      title={metric.title}
                      value={metric.value}
                      subtitle={metric.subtitle}
                    />
                  ))}
                </div>
              )}
            </div>

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
            title={t('demographics.segmentComparison.title')}
            description={t('demographics.segmentComparison.description')}
          />
          {errors.segmentComparison ? (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-red-500">
              {t('demographics.segmentComparison.error')}
            </div>
          ) : segmentComparisons.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {segmentComparisons.map((comparison) => (
                <SegmentComparisonCard
                  key={`${comparison.dimension}-${comparison.metric}`}
                  comparison={comparison}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-gray-400">
              {t('demographics.segmentComparison.empty')}
            </div>
          )}
        </div>

        <div className="mb-8">
          <SectionHeader
            title={t('demographics.usageBySegment.title')}
            description={t('demographics.usageBySegment.description')}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title={t('demographics.usageBySegment.charts.age')}>
              {errors.ageGroup ? (
                <div className="flex h-full items-center justify-center text-red-500">{t('demographics.usageBySegment.errors.age')}</div>
              ) : ageGroupData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={ageGroupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="age_group_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} content={<UsageMetricsTooltip labelKey="age_group" />} />
                    <Bar dataKey="requests_count" fill="#EC4899" radius={[4, 4, 0, 0]} name={t('chartSeries.requests')} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  {t('demographics.usageBySegment.empty.age')}
                </div>
              )}
            </ChartCard>

            <ChartCard title={t('demographics.usageBySegment.charts.gender')}>
              {errors.genderInsights ? (
                <div className="flex h-full items-center justify-center text-red-500">{t('demographics.usageBySegment.errors.gender')}</div>
              ) : genderInsightsData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={genderInsightsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="gender_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} content={<UsageMetricsTooltip labelKey="gender" />} />
                    <Bar dataKey="avg_requests" fill="#3B82F6" radius={[4, 4, 0, 0]} name={t('chartSeries.avgRequests')} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  {t('demographics.usageBySegment.empty.gender')}
                </div>
              )}
            </ChartCard>

            <ChartCard title={t('demographics.usageBySegment.charts.weight')}>
              {errors.weightInsights ? (
                <div className="flex h-full items-center justify-center text-red-500">{t('demographics.usageBySegment.errors.weight')}</div>
              ) : weightInsightsData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={weightInsightsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="bucket_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} content={<UsageMetricsTooltip labelKey="bucket" />} />
                    <Bar dataKey="avg_requests" fill="#10B981" radius={[4, 4, 0, 0]} name={t('chartSeries.avgRequests')} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  {t('demographics.usageBySegment.empty.weight')}
                </div>
              )}
            </ChartCard>

            <ChartCard title={t('demographics.usageBySegment.charts.height')}>
              {errors.heightInsights ? (
                <div className="flex h-full items-center justify-center text-red-500">{t('demographics.usageBySegment.errors.height')}</div>
              ) : heightInsightsData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={heightInsightsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="bucket_label" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} content={<UsageMetricsTooltip labelKey="bucket" />} />
                    <Bar dataKey="avg_requests" fill="#8B5CF6" radius={[4, 4, 0, 0]} name={t('chartSeries.avgRequests')} />
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
      {activeTab === 'system' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
        <ChartCard title={t('system.charts.requestsOverTime')}>
          {errors.timeRange ? (
            <div className="flex h-full items-center justify-center text-red-500">{t('system.errors.activityTimeline')}</div>
          ) : timeRangeData.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={timeRangeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="displayTimeLabel" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  cursor={{ fill: '#374151' }}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }}
                  formatter={(value, name) => [formatMetricValue(value, language), name]}
                />
                <Line type="monotone" dataKey="metric_value" stroke="#3B82F6" strokeWidth={2} name={t('chartSeries.activity')} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              {t('system.empty.activityTimeline')}
            </div>
          )}
        </ChartCard>
      </div>
      )}

      {/* Onboarded Users Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{t('modal.onboardedUsers.title')}</h2>
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
                    aria-label={t('modal.onboardedUsers.searchPlaceholder')}
                    placeholder={t('modal.onboardedUsers.searchPlaceholder')}
                    value={modalSearch}
                    onChange={e => setModalSearch(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
              {modalLoading ? (
                <div className="text-center text-gray-400 py-8">{t('modal.onboardedUsers.loading')}</div>
              ) : modalError ? (
                <div className="text-center text-red-500 py-8">{t('modal.onboardedUsers.error')}</div>
              ) : modalUsers.length === 0 ? (
                <div className="text-center text-gray-400 py-8">{t('modal.onboardedUsers.empty')}</div>
              ) : (
                (() => {
                  const filteredUsers = modalUsers.filter(u => (u.email || '').toLowerCase().includes(modalSearch.toLowerCase()));
                  if (filteredUsers.length === 0) {
                    return <div className="text-center text-gray-400 py-8">{t('modal.onboardedUsers.noMatches')}</div>;
                  }
                  return (
                    <div className="space-y-3">
                      {filteredUsers.map(u => (
                        <div key={u.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                          <div className="text-white font-medium truncate mr-4">{u.email || unknownLabel}</div>
                          <div className="text-gray-400 text-sm shrink-0">
                            {formatDateTime(u.created_at, language, { dateStyle: 'medium', timeStyle: 'short' }) || unknownLabel}
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
