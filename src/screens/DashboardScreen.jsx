import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { LogOut, Activity, Users, Database, ShieldAlert, LayoutDashboard, Cpu } from 'lucide-react';
import { api } from '../api';

const ChartCard = ({ title, children }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm flex flex-col items-center">
    <h3 className="text-lg font-semibold text-gray-300 mb-4 self-start">{title}</h3>
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
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-white mt-3">{value}</p>
    {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
  </div>
);


const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'telemetry', label: 'Telemetry', icon: Activity },
  { id: 'demographics', label: 'Demographics', icon: Users },
  { id: 'system', label: 'System', icon: Cpu },
];

export default function DashboardScreen() {
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

  const handleOnboardedClick = async () => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError(false);
    setModalSearch('');
    try {
      const token = localStorage.getItem('admin_token');
      const users = await api.getAnalytics('users/onboarded', token);
      setModalUsers(users);
    } catch(err) {
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
          eventsBreakdown: api.getAnalytics('events/breakdown', token, queryParams),
          ageGroup: api.getAnalytics('by-age-group', token, demographicsQueryParams),
          timeRange: api.getAnalytics('by-time-range', token, queryParams),
          genderInsights: api.getAnalytics('by-gender', token, demographicsQueryParams),
          weightInsights: api.getAnalytics('by-weight-bucket', token, demographicsQueryParams),
          heightInsights: api.getAnalytics('by-height-bucket', token, demographicsQueryParams),
          profileCompleteness: api.getAnalytics('profile-completeness', token),
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

        // Check for auth errors across all rejected promises
        const hasAuthError = Object.values(results).some(r => 
          r.status === 'rejected' && 
          (r.reason?.message?.includes('401') || r.reason?.message?.includes('403'))
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
          eventsBreakdown: results.eventsBreakdown.status === 'rejected',
          ageGroup: results.ageGroup.status === 'rejected',
          timeRange: results.timeRange.status === 'rejected',
          genderInsights: results.genderInsights.status === 'rejected',
          weightInsights: results.weightInsights.status === 'rejected',
          heightInsights: results.heightInsights.status === 'rejected',
          profileCompleteness: results.profileCompleteness.status === 'rejected',
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
          eventsBreakdown: safeData(results.eventsBreakdown, { breakdown: [] }),
          ageGroup: safeData(results.ageGroup, []),
          timeRange: safeData(results.timeRange, []),
          genderInsights: safeData(results.genderInsights, []),
          weightInsights: safeData(results.weightInsights, []),
          heightInsights: safeData(results.heightInsights, []),
          profileCompleteness: safeData(results.profileCompleteness, {
            total_users: 0,
            age_filled: 0,
            gender_filled: 0,
            weight_filled: 0,
            height_filled: 0,
            about_me_filled: 0,
          }),
          usersByAgeGroup: safeData(results.usersByAgeGroup, []),
          usersByGender: safeData(results.usersByGender, []),
          usersByWeight: safeData(results.usersByWeight, []),
          usersByHeight: safeData(results.usersByHeight, []),
        });
      } catch (err) {
        console.error("Unexpected error in loadData:", err);
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

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading Analytics Data...</div>;
  if (!data) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Failed to load reports.</div>;

  const funnelData = [
    { stage: 'App Installed', count: data.onboarding?.app_started_users || 0 },
    { stage: 'Registered', count: data.onboarding?.register_success_users || 0 },
    { stage: 'Onboarding', count: data.onboarding?.onboarding_started_users || 0 },
    { stage: 'Created Pet', count: data.onboarding?.pet_created_users || 0 },
  ];

  const processedAiHealth = (data.aiHealth || []).map(d => ({
    ...d,
    dayStr: d.day ? d.day.split(' ')[0] : 'Unknown'
  })).reverse();

  const processedHourly = (data.hourly || []).map(d => {
    let raw = d.hour_bucket ? d.hour_bucket : 'Unknown';
    let shortHour = raw.length > 11 ? raw.substring(11,16) : raw;
    return { ...d, shortHour };
  }).reverse();

  const processedDau = (data.dau || []).map(d => ({ ...d, dayStr: d.day ? d.day.split(' ')[0] : 'Unknown' })).reverse();
  const eventsBreakdownData = data.eventsBreakdown?.breakdown || [];

  const sleepTelemetryData = eventsBreakdownData
    .filter(d => d.event_type && d.event_type.startsWith('sleep.'))
    .map(d => ({ ...d, short_type: d.event_type.replace('sleep.', '') }));

  const ageGroupData = data.ageGroup?.map(d => ({ ...d, age_group: d.age_group || 'Unknown' })) || [];
  const usersByAgeGroupData = data.usersByAgeGroup?.map(d => ({ ...d, age_group: d.age_group || 'Unknown' })) || [];
  const usersByGenderData = data.usersByGender?.map(d => ({ ...d, gender: d.gender || 'Unknown' })) || [];
  const usersByWeightData = data.usersByWeight || [];
  const usersByHeightData = data.usersByHeight || [];
  const profileCompleteness = data.profileCompleteness || {
    total_users: 0,
    age_filled: 0,
    gender_filled: 0,
    weight_filled: 0,
    height_filled: 0,
    about_me_filled: 0,
  };
  const totalProfileUsers = profileCompleteness.total_users || 0;
  const completenessMetrics = [
    { key: 'total_users', title: 'Total Users', filled: totalProfileUsers, isTotal: true },
    { key: 'age_filled', title: 'Age Filled', filled: profileCompleteness.age_filled || 0 },
    { key: 'gender_filled', title: 'Gender Filled', filled: profileCompleteness.gender_filled || 0 },
    { key: 'weight_filled', title: 'Weight Filled', filled: profileCompleteness.weight_filled || 0 },
    { key: 'height_filled', title: 'Height Filled', filled: profileCompleteness.height_filled || 0 },
    { key: 'about_me_filled', title: 'About Me Filled', filled: profileCompleteness.about_me_filled || 0 },
  ];

  const timeRangeList = data.timeRange?.timeline || data.timeRange || [];
  const timeRangeData = Array.isArray(timeRangeList) ? timeRangeList.map(d => ({
    ...d,
    displayTime: d.bucket || d.timestamp || d.date || d.day || 'Unknown',
    metric_value: d.requests_count !== undefined ? d.requests_count : d.total_tokens !== undefined ? d.total_tokens : d.count || 0
  })) : [];

      return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex items-center border-b border-gray-800">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              GymBro Analytics
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
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
            <LogOut size={20} className="mr-3 shrink-0" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-900 p-8 h-screen overflow-y-auto">
        <header className="mb-8 pb-4 border-b border-gray-800">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            {NAV_ITEMS.find(i => i.id === activeTab)?.label || 'Dashboard'}
          </h1>
        </header>

        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm font-semibold">Start Date:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm font-semibold">End Date:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm font-semibold">Granularity:</label>
            <select value={granularity} onChange={e => setGranularity(e.target.value)} className="bg-gray-900 border border-gray-700 text-white rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-sm">
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>

        {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
          <Activity className="text-blue-400 mr-4" size={32} />
          <div>
            <p className="text-gray-400">Total Engagements</p>
            <p className="text-2xl font-bold text-white">{errors.engagement ? <span className="text-red-400 text-lg">Error</span> : (data.engagement || []).reduce((sum, e) => sum + parseInt(e.meals_events_count || 0) + parseInt(e.training_events_count || 0), 0)}</p>
          </div>
        </div>
        <div 
          className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={handleOnboardedClick}
        >
          <Users className="text-emerald-400 mr-4" size={32} />
          <div>
            <p className="text-gray-400">Onboarded Users</p>
            <p className="text-2xl font-bold text-white">{errors.onboarding ? <span className="text-red-400 text-lg">Error</span> : (data.onboarding?.pet_created_users || 0)}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
          <Database className="text-purple-400 mr-4" size={32} />
          <div>
            <p className="text-gray-400">Today DAU</p>
            <p className="text-2xl font-bold text-white">{errors.dau ? <span className="text-red-400 text-lg">Error</span> : data.dau?.length > 0 ? data.dau[0].active_users_count : 0}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
          <ShieldAlert className="text-red-400 mr-4" size={32} />
          <div>
            <p className="text-gray-400">Recent API Errors</p>
            <p className="text-2xl font-bold text-white">{errors.aiHealth ? <span className="text-red-400 text-lg">Error</span> : data.aiHealth?.length > 0 ? data.aiHealth[0].provider_failures : 0}</p>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'overview' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Daily Active Users (DAU)">
          {errors.dau ? (
            <div className="flex h-full items-center justify-center text-red-500">Failed to load DAU data.</div>
          ) : (
            <ResponsiveContainer>
              <BarChart data={processedDau}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="dayStr" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                <Bar dataKey="active_users_count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Global Onboarding Funnel">
          {errors.onboarding ? (
            <div className="flex h-full items-center justify-center text-red-500">Failed to load onboarding data.</div>
          ) : (
            <ResponsiveContainer>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="stage" type="category" stroke="#9CA3AF" width={100} fontSize={12} />
                <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
      )}

      {activeTab === 'telemetry' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Hourly Activity Flow (Tallinn Time)">
          {errors.hourly ? (
            <div className="flex h-full items-center justify-center text-red-500">Failed to load hourly activity.</div>
          ) : (
            <ResponsiveContainer>
              <AreaChart data={processedHourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="shortHour" stroke="#9CA3AF" fontSize={11} tickMargin={10} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                <Area type="monotone" dataKey="ai_success_count" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="AI Success" />
                <Area type="monotone" dataKey="telemetry_events_count" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Telemetry Events" />        
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        

        <ChartCard title="Telemetry Event Breakdown">
          {errors.eventsBreakdown ? (
            <div className="flex h-full items-center justify-center text-red-500">Failed to load telemetry data.</div>
          ) : eventsBreakdownData.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={eventsBreakdownData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="event_type" type="category" stroke="#9CA3AF" width={110} fontSize={11} />
                <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No telemetry events recorded yet.
            </div>
          )}
        </ChartCard>

        <ChartCard title="Sleep Telemetry">
          {errors.eventsBreakdown ? (
            <div className="flex h-full items-center justify-center text-red-500">Failed to load sleep telemetry data.</div>
          ) : sleepTelemetryData.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={sleepTelemetryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="short_type" type="category" stroke="#9CA3AF" width={140} fontSize={11} />
                <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No sleep telemetry data available yet.
            </div>
          )}
        </ChartCard>
      </div>
      )}

      {activeTab === 'demographics' && (
      <>
        <div className="mb-8">
          <SectionHeader
            title="Profile Completeness"
            description="How much profile information non-admin users have filled in."
          />
          {errors.profileCompleteness ? (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-red-500">
              Failed to load profile completeness data.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {completenessMetrics.map((metric) => {
                if (metric.isTotal) {
                  return (
                    <MetricCard
                      key={metric.key}
                      title={metric.title}
                      value={metric.filled}
                      subtitle="Non-admin profiles"
                    />
                  );
                }

                const percent = totalProfileUsers > 0 ? Math.round((metric.filled / totalProfileUsers) * 100) : 0;
                return (
                  <MetricCard
                    key={metric.key}
                    title={metric.title}
                    value={`${metric.filled} / ${totalProfileUsers}`}
                    subtitle={`${percent}% complete`}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-8">
          <SectionHeader
            title="User Distribution"
            description="How users are distributed across the available demographic categories."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Users by Age Group">
              {errors.usersByAgeGroup ? (
                <div className="flex h-full items-center justify-center text-red-500">Failed to load age group distribution.</div>
              ) : usersByAgeGroupData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={usersByAgeGroupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="age_group" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="users_count" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Users" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No age group distribution available yet.
                </div>
              )}
            </ChartCard>

            <ChartCard title="Users by Gender">
              {errors.usersByGender ? (
                <div className="flex h-full items-center justify-center text-red-500">Failed to load gender distribution.</div>
              ) : usersByGenderData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={usersByGenderData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="gender" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="users_count" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Users" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No gender distribution available yet.
                </div>
              )}
            </ChartCard>

            <ChartCard title="Users by Weight">
              {errors.usersByWeight ? (
                <div className="flex h-full items-center justify-center text-red-500">Failed to load weight distribution.</div>
              ) : usersByWeightData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={usersByWeightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="bucket" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="users_count" fill="#22C55E" radius={[4, 4, 0, 0]} name="Users" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No weight distribution available yet.
                </div>
              )}
            </ChartCard>

            <ChartCard title="Users by Height">
              {errors.usersByHeight ? (
                <div className="flex h-full items-center justify-center text-red-500">Failed to load height distribution.</div>
              ) : usersByHeightData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={usersByHeightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="bucket" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="users_count" fill="#A855F7" radius={[4, 4, 0, 0]} name="Users" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No height distribution available yet.
                </div>
              )}
            </ChartCard>
          </div>
        </div>

        <div className="mb-8">
          <SectionHeader
            title="Usage by Segment"
            description="How request volume differs across the same demographic groups."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Usage by Age Group">
              {errors.ageGroup ? (
                <div className="flex h-full items-center justify-center text-red-500">Failed to load age group analytics.</div>
              ) : ageGroupData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={ageGroupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="age_group" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="requests_count" fill="#EC4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No age group analytics available yet.
                </div>
              )}
            </ChartCard>

            <ChartCard title="Requests by Gender">
              {errors.genderInsights ? (
                <div className="flex h-full items-center justify-center text-red-500">Failed to load gender insights data.</div>
              ) : data.genderInsights?.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={data.genderInsights}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="gender" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="avg_requests" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Avg Requests" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No gender data available.
                </div>
              )}
            </ChartCard>

            <ChartCard title="Requests by Weight">
              {errors.weightInsights ? (
                <div className="flex h-full items-center justify-center text-red-500">Failed to load weight insights data.</div>
              ) : data.weightInsights?.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={data.weightInsights}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="bucket" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="avg_requests" fill="#10B981" radius={[4, 4, 0, 0]} name="Avg Requests" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No weight data available.
                </div>
              )}
            </ChartCard>

            <ChartCard title="Requests by Height">
              {errors.heightInsights ? (
                <div className="flex h-full items-center justify-center text-red-500">Failed to load height insights data.</div>
              ) : data.heightInsights?.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={data.heightInsights}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="bucket" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                    <Bar dataKey="avg_requests" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Avg Requests" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No height data available.
                </div>
              )}
            </ChartCard>
          </div>
        </div>
      </>
      )}
      {activeTab === 'system' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard title="AI Provider Health">
          {errors.aiHealth ? (
            <div className="flex h-full items-center justify-center text-red-500">Failed to load AI health data.</div>
          ) : (
            <ResponsiveContainer>
              <LineChart data={processedAiHealth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="dayStr" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                <Line type="monotone" dataKey="success_count" stroke="#10B981" strokeWidth={2} name="Success" />
                <Line type="monotone" dataKey="rate_limits_hit" stroke="#EF4444" strokeWidth={2} name="Rate Limited" />
                <Line type="monotone" dataKey="provider_failures" stroke="#F59E0B" strokeWidth={2} name="Provider Errors" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
        <ChartCard title="Requests Over Time">
          {errors.timeRange ? (
            <div className="flex h-full items-center justify-center text-red-500">Failed to load activity timeline.</div>
          ) : timeRangeData.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={timeRangeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="displayTime" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
                <Line type="monotone" dataKey="metric_value" stroke="#3B82F6" strokeWidth={2} name="Activity" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No activity data available for this range.
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
              <h2 className="text-xl font-bold text-white">Onboarded Users</h2>
              <button 
                onClick={() => setModalOpen(false)}
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
                    placeholder="Search by email..."
                    value={modalSearch}
                    onChange={e => setModalSearch(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
              {modalLoading ? (
                <div className="text-center text-gray-400 py-8">Loading onboarded users...</div>
              ) : modalError ? (
                <div className="text-center text-red-500 py-8">Failed to load onboarded users.</div>
              ) : modalUsers.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No onboarded users found.</div>
              ) : (
                (() => {
                  const filteredUsers = modalUsers.filter(u => (u.email || '').toLowerCase().includes(modalSearch.toLowerCase()));
                  if (filteredUsers.length === 0) {
                    return <div className="text-center text-gray-400 py-8">No matching onboarded users found.</div>;
                  }
                  return (
                    <div className="space-y-3">
                      {filteredUsers.map(u => (
                        <div key={u.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                          <div className="text-white font-medium truncate mr-4">{u.email}</div>
                          <div className="text-gray-400 text-sm shrink-0">
                            {new Date(u.created_at).toLocaleString()}
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
