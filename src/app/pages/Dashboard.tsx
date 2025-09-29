'use client';
import React, { useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import {
  DocumentChartBarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

import axios from '../lib/axios';
import API_ENDPOINTS from '../lib/endpoint';




export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Survey Management Overview</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            New Survey
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Surveys"
          value="127"
          change="+12% from last month"
          trend="up"
          icon={DocumentChartBarIcon}
        />
        <StatCard
          title="Active Respondents"
          value="15,420"
          change="+8% from last month"
          trend="up"
          icon={UserGroupIcon}
        />
        <StatCard
          title="Response Rate"
          value="87.3%"
          change="+2.1% from last month"
          trend="up"
          icon={ChartBarIcon}
        />
        <StatCard
          title="Avg. Completion Time"
          value="4.2 min"
          change="-0.8 min from last month"
          trend="up"
          icon={ClockIcon}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600 mt-1">Latest survey updates and responses</p>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { action: 'New survey created', survey: 'Jakarta Political Mapping 2024', time: '2 hours ago', status: 'active' },
            { action: 'Survey completed', survey: 'Brand Equity Analysis', time: '4 hours ago', status: 'completed' },
            { action: 'Response threshold reached', survey: 'Policy Evaluation Survey', time: '6 hours ago', status: 'milestone' },
            { action: 'Survey published', survey: 'Surabaya Quick Count', time: '1 day ago', status: 'published' },
          ].map((activity, index) => (
            <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'active' ? 'bg-emerald-500' :
                  activity.status === 'completed' ? 'bg-blue-500' :
                  activity.status === 'milestone' ? 'bg-orange-500' :
                  'bg-purple-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.survey}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}