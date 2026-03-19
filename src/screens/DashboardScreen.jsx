import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { LogOut, Activity, Users, Database, ShieldAlert } from 'lucide-react';
import { api } from '../api';

const ChartCard = ({ title, children }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm flex flex-col items-center">
    <h3 className="text-lg font-semibold text-gray-300 mb-4 self-start">{title}</h3>
    <div className="w-full h-64">
      {children}
    </div>
  </div>
);

export default function DashboardScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem('admin_token');
      try {
        const [dau, onboarding, aiHealth, hourly, engagement] = await Promise.all([
          api.getReport('daily-active-users', token),
          api.getReport('onboarding', token),
          api.getReport('ai-health', token),
          api.getReport('hourly-activity', token),
          api.getReport('engagement', token),
        ]);
        setData({ dau, onboarding, aiHealth, hourly, engagement });
      } catch (err) {
        console.error(err);
        if (err.message.includes('401') || err.message.includes('403')) {
          localStorage.removeItem('admin_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading Analytics Data...</div>;
  if (!data) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Failed to load reports.</div>;

  const funnelData = [
    { stage: 'App Installed', count: data.onboarding.app_started_users || 0 },
    { stage: 'Registered', count: data.onboarding.register_success_users || 0 },
    { stage: 'Onboarding', count: data.onboarding.onboarding_started_users || 0 },
    { stage: 'Created Pet', count: data.onboarding.pet_created_users || 0 },
  ];

  const processedAiHealth = data.aiHealth.map(d => ({
    ...d,
    dayStr: d.day ? d.day.split(' ')[0] : 'Unknown'
  })).reverse();

  const processedHourly = data.hourly.map(d => {
    let raw = d.hour_bucket ? d.hour_bucket : 'Unknown';
    let shortHour = raw.length > 11 ? raw.substring(11,16) : raw;
    return { ...d, shortHour };
  }).reverse();

  const processedDau = data.dau.map(d => ({ ...d, dayStr: d.day ? d.day.split(' ')[0] : 'Unknown' })).reverse();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          GymBro Executive Dashboard
        </h1>
        <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-white transition-colors">
          <LogOut size={20} className="mr-2" /> Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
          <Activity className="text-blue-400 mr-4" size={32} />
          <div>
            <p className="text-gray-400">Total Engagements</p>
            <p className="text-2xl font-bold text-white">{data.engagement.reduce((sum, e) => sum + parseInt(e.meals_events_count) + parseInt(e.training_events_count), 0)}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
          <Users className="text-emerald-400 mr-4" size={32} />
          <div>
            <p className="text-gray-400">Onboarded Users</p>
            <p className="text-2xl font-bold text-white">{data.onboarding.pet_created_users || 0}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
          <Database className="text-purple-400 mr-4" size={32} />
          <div>
            <p className="text-gray-400">Today DAU</p>
            <p className="text-2xl font-bold text-white">{data.dau.length > 0 ? data.dau[0].active_users_count : 0}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl flex items-center shadow-lg border border-gray-700">
          <ShieldAlert className="text-red-400 mr-4" size={32} />
          <div>
            <p className="text-gray-400">Recent API Errors</p>
            <p className="text-2xl font-bold text-white">{data.aiHealth.length > 0 ? data.aiHealth[0].provider_failures : 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Daily Active Users (DAU)">
          <ResponsiveContainer>
            <BarChart data={processedDau}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="dayStr" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
              <Bar dataKey="active_users_count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Global Onboarding Funnel">
          <ResponsiveContainer>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="stage" type="category" stroke="#9CA3AF" width={100} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
              <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hourly Activity Flow (Tallinn Time)">
          <ResponsiveContainer>
            <AreaChart data={processedHourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="shortHour" stroke="#9CA3AF" fontSize={11} tickMargin={10} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
              <Area type="monotone" dataKey="ai_success_count" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="AI Success" />
              <Area type="monotone" dataKey="telemetry_events_count" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Telemetry Events" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="AI Provider Health">
          <ResponsiveContainer>
            <LineChart data={processedAiHealth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="dayStr" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#FFF' }} />
              <Line type="monotone" dataKey="success_count" stroke="#10B981" strokeWidth={2} name="Success" />
              <Line type="monotone" dataKey="rate_limits_hit" stroke="#EF4444" strokeWidth={2} name="Rate Limited" />
              <Line type="monotone" dataKey="provider_failures" stroke="#F59E0B" strokeWidth={2} name="Provider Errors" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
