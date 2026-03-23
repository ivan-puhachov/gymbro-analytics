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

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem('admin_token');
      try {
        const queryParams = { start: startDate, end: endDate, granularity };

        const promises = [
          api.getReport('daily-active-users', token),
          api.getReport('onboarding', token),
          api.getReport('ai-health', token),
          api.getReport('hourly-activity', token),
          api.getReport('engagement', token),
          api.getAnalytics('events/breakdown', token, queryParams),
          api.getAnalytics('by-age-group', token),
          api.getAnalytics('by-time-range', token, queryParams),
        ];

        const results = await Promise.allSettled(promises);

        // Check for auth errors across all rejected promises
        const hasAuthError = results.some(r => 
          r.status === 'rejected' && 
          (r.reason?.message?.includes('401') || r.reason?.message?.includes('403'))
        );

        if (hasAuthError) {
          localStorage.removeItem('admin_token');
          navigate('/login');
          return;
        }

        setErrors({
          dau: results[0].status === 'rejected',
          onboarding: results[1].status === 'rejected',
          aiHealth: results[2].status === 'rejected',
          hourly: results[3].status === 'rejected',
          engagement: results[4].status === 'rejected',
          eventsBreakdown: results[5].status === 'rejected',
          ageGroup: results[6].status === 'rejected',
          timeRange: results[7].status === 'rejected',
        });

        const safeData = (result, defaultVal) => result.status === 'fulfilled' ? result.value : defaultVal;

        setData({
          dau: safeData(results[0], []),
          onboarding: safeData(results[1], {}),
          aiHealth: safeData(results[2], []),
          hourly: safeData(results[3], []),
          engagement: safeData(results[4], []),
          eventsBreakdown: safeData(results[5], { breakdown: [] }),
          ageGroup: safeData(results[6], []),
          timeRange: safeData(results[7], []),
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
        <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
      </div>
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
      </main>
    </div>
  );
}