'use client';
import React, { useState } from 'react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  BarChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  LineChart, 
  AreaChart, 
  Area, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ScatterChart, 
  Scatter,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const responseData = [
  { name: 'Jan', responses: 1200, surveys: 8 },
  { name: 'Feb', responses: 1890, surveys: 12 },
  { name: 'Mar', responses: 2380, surveys: 15 },
  { name: 'Apr', responses: 3490, surveys: 18 },
  { name: 'May', responses: 4200, surveys: 22 },
  { name: 'Jun', responses: 3800, surveys: 19 },
];

const surveyTypeData = [
  { name: 'Political Social Mapping', value: 35, color: '#3B82F6' },
  { name: 'Political Voice Mapping', value: 25, color: '#10B981' },
  { name: 'Tracking & Quick Count', value: 20, color: '#F59E0B' },
  { name: 'Brand Equity', value: 12, color: '#EF4444' },
  { name: 'Policy Evaluation', value: 8, color: '#8B5CF6' },
];

const locationData = [
  { location: 'Jakarta', surveys: 45, responses: 12500 },
  { location: 'Surabaya', surveys: 32, responses: 8900 },
  { location: 'Bandung', surveys: 28, responses: 7600 },
  { location: 'Medan', surveys: 22, responses: 6200 },
  { location: 'Semarang', surveys: 18, responses: 4800 },
]


const responseRateData = [
  { month: 'Jan', rate: 87.2, target: 85, surveys: 12 },
  { month: 'Feb', rate: 89.1, target: 85, surveys: 15 },
  { month: 'Mar', rate: 85.8, target: 85, surveys: 18 },
  { month: 'Apr', rate: 91.5, target: 85, surveys: 22 },
  { month: 'May', rate: 88.9, target: 85, surveys: 19 },
  { month: 'Jun', rate: 92.3, target: 85, surveys: 25 },
];

const demographicData = [
  { age: '18-25', count: 1200, satisfaction: 78, political_interest: 65 },
  { age: '26-35', count: 1800, satisfaction: 82, political_interest: 72 },
  { age: '36-45', count: 1500, satisfaction: 85, political_interest: 78 },
  { age: '46-55', count: 1200, satisfaction: 79, political_interest: 74 },
  { age: '56+', count: 800, satisfaction: 77, political_interest: 70 },
];

const engagementData = [
  { time: '06:00', sessions: 45, responses: 32 },
  { time: '09:00', sessions: 128, responses: 98 },
  { time: '12:00', sessions: 220, responses: 189 },
  { time: '15:00', sessions: 198, responses: 165 },
  { time: '18:00', sessions: 156, responses: 128 },
  { time: '21:00', sessions: 89, responses: 67 },
];

const sentimentData = [
  { category: 'Kebijakan Ekonomi', positive: 65, negative: 20, neutral: 15 },
  { category: 'Kesehatan', positive: 72, negative: 18, neutral: 10 },
  { category: 'Pendidikan', positive: 58, negative: 25, neutral: 17 },
  { category: 'Infrastruktur', positive: 45, negative: 35, neutral: 20 },
  { category: 'Lingkungan', positive: 38, negative: 42, neutral: 20 },
];

const regionalPerformance = [
  { region: 'Jakarta', performance: 85, population: 2000, participation: 78 },
  { region: 'Surabaya', performance: 78, population: 1500, participation: 82 },
  { region: 'Bandung', performance: 82, population: 1200, participation: 75 },
  { region: 'Medan', performance: 75, population: 1000, participation: 68 },
  { region: 'Semarang', performance: 80, population: 800, participation: 72 },
];

const politicalTrends = [
  { candidate: 'Kandidat A', jan: 35, feb: 38, mar: 42, apr: 45 },
  { candidate: 'Kandidat B', jan: 28, feb: 30, mar: 28, apr: 31 },
  { candidate: 'Kandidat C', jan: 22, feb: 20, mar: 18, apr: 16 },
  { candidate: 'Belum Memilih', jan: 15, feb: 12, mar: 12, apr: 8 },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('response_rate');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analitik & Wawasan</h1>
          <p className="text-gray-600 mt-2">Analisis komprehensif kinerja survei dan hasil penelitian</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            title="Select Timeframe"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1month">1 Bulan Terakhir</option>
            <option value="3months">3 Bulan Terakhir</option>
            <option value="6months">6 Bulan Terakhir</option>
            <option value="1year">1 Tahun Terakhir</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Unduh Laporan
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            title: 'Rata-rata Respons Rate', 
            value: '89.2%', 
            change: '+3.1%', 
            trend: 'up',
            description: 'Peningkatan partisipasi responden'
          },
          { 
            title: 'Total Respons', 
            value: '24,856', 
            change: '+12.5%', 
            trend: 'up',
            description: 'Respons yang terkumpul'
          },
          { 
            title: 'Tingkat Penyelesaian', 
            value: '76.8%', 
            change: '+2.3%', 
            trend: 'up',
            description: 'Survei yang diselesaikan penuh'
          },
          { 
            title: 'Skor Kualitas Data', 
            value: '94.1', 
            change: '+1.8', 
            trend: 'up',
            description: 'Indeks kualitas respons'
          },
        ].map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              {metric.trend === 'up' ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                metric.trend === 'up' 
                  ? 'text-emerald-700 bg-emerald-100' 
                  : 'text-red-700 bg-red-100'
              }`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Response Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Response Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={responseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Area
                type="monotone"
                dataKey="responses"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Survey Types Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Survey Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={surveyTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {surveyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
          <p className="text-sm text-gray-600 mt-1">Survey activity by location</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="location" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Legend />
              <Bar dataKey="surveys" fill="#3B82F6" name="Surveys" radius={[4, 4, 0, 0]} />
              <Bar dataKey="responses" fill="#10B981" name="Responses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Response Rate Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tren Response Rate</h3>
            <ArrowPathIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={responseRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Bar dataKey="surveys" fill="#e5e7eb" name="Jumlah Survei" />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#2563eb" 
                strokeWidth={3}
                name="Response Rate (%)"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Demographic Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Analisis Demografis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={demographicData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="age" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Area
                type="monotone"
                dataKey="count"
                stackId="1"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.6}
                name="Jumlah Responden"
              />
              <Area
                type="monotone"
                dataKey="political_interest"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.4}
                name="Minat Politik (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Engagement */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pola Keterlibatan Harian</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Sesi"
              />
              <Line
                type="monotone"
                dataKey="responses"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Respons"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Kinerja Regional</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={regionalPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="performance" type="number" domain={[70, 90]} name="Kinerja" stroke="#6b7280" />
              <YAxis dataKey="participation" type="number" domain={[65, 85]} name="Partisipasi" stroke="#6b7280" />
              <Scatter name="Wilayah" dataKey="population" fill="#2563eb" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Analisis Sentimen Kebijakan</h3>
          <p className="text-sm text-gray-600 mt-1">Persepsi masyarakat terhadap berbagai kebijakan pemerintah</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {sentimentData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  <span className="text-xs text-gray-500">Total: {item.positive + item.negative + item.neutral}%</span>
                </div>
                <div className="flex rounded-lg overflow-hidden h-3 bg-gray-100">
                  <div
                    className="bg-emerald-500"
                    style={{ width: `${item.positive}%` }}
                    title={`Positif: ${item.positive}%`}
                  />
                  <div
                    className="bg-gray-400"
                    style={{ width: `${item.neutral}%` }}
                    title={`Netral: ${item.neutral}%`}
                  />
                  <div
                    className="bg-red-500"
                    style={{ width: `${item.negative}%` }}
                    title={`Negatif: ${item.negative}%`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Positif: {item.positive}%</span>
                  <span>Netral: {item.neutral}%</span>
                  <span>Negatif: {item.negative}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Political Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Tren Elektabilitas Politik</h3>
          <p className="text-sm text-gray-600 mt-1">Pergerakan dukungan kandidat dalam 4 bulan terakhir</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={[
              { month: 'Jan', 'Kandidat A': 35, 'Kandidat B': 28, 'Kandidat C': 22, 'Belum Memilih': 15 },
              { month: 'Feb', 'Kandidat A': 38, 'Kandidat B': 30, 'Kandidat C': 20, 'Belum Memilih': 12 },
              { month: 'Mar', 'Kandidat A': 42, 'Kandidat B': 28, 'Kandidat C': 18, 'Belum Memilih': 12 },
              { month: 'Apr', 'Kandidat A': 45, 'Kandidat B': 31, 'Kandidat C': 16, 'Belum Memilih': 8 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 50]} />
              <Line type="monotone" dataKey="Kandidat A" stroke="#2563eb" strokeWidth={3} />
              <Line type="monotone" dataKey="Kandidat B" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="Kandidat C" stroke="#f59e0b" strokeWidth={3} />
              <Line type="monotone" dataKey="Belum Memilih" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}