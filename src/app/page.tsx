"use client";
import React, {useState, useEffect} from 'react';
import StatCard from './components/common/StatCard';
import {
  DocumentChartBarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

import api from './lib/api';
import API_ENDPOINTS from './lib/endpoint';


export default function Dashboard() {

  interface Survey {
    id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    max_respondents: number;
    status: string;
    respondent_count: number;
    survey_link: string;
  }

  interface Activity {
    id: string;
    activity_type: string;
    activity_timestamp: string;
    details: string;
  }

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [addSurveyOpen, setAddSurveyOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [maxRespondents, setMaxRespondents] = useState<number>(0);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    const getSurveys = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.SURVEYS);
        setSurveys(response.data);
      }
      catch (error) {
        console.error('Error fetching surveys:', error);
        return [];
      }
    };

    const getActivities = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.ACTIVITIES);
        setActivities(response.data.sort((a: Activity, b: Activity) => new Date(b.activity_timestamp).getTime() - new Date(a.activity_timestamp).getTime()));
      }
      catch (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
    };

    getSurveys();
    getActivities();
  }, [surveys]);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log(surveys);
      console.log(activities);
    }, 60000);
    return () => clearInterval(interval);
  }, [surveys, activities]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleMaxRespondentsChange = (e) => {
    setMaxRespondents(e.target.value);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const addQuestionField = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestionField = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSurvey = {
        title,
        description,
        max_respondents: maxRespondents,
        questions
      };
      const response = await api.post(API_ENDPOINTS.SURVEYS, newSurvey);
      setSurveys([...surveys, response.data]);
      setAddSurveyOpen(false);
    } catch (err) {
      console.error('Error creating survey:', err);
      alert('Failed to create survey. Please try again.');
    }
  };

  const totalRespondents = surveys.reduce((total, s) => total + s.respondent_count, 0);
  const totalMax = surveys.reduce((total, s) => total + s.max_respondents, 0);
  const responseRate = totalMax > 0 ? ((totalRespondents / totalMax) * 100).toFixed(1) : '0';

  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const newThisMonth = surveys.reduce(
    (total, survey) => total + (survey.created_at.startsWith(currentMonth) ? 1 : 0),
    0
  );


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Political Survey Management Overview</p>
        </div>
        <div className="flex space-x-3">
          {/* <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export Report
          </button> */}
          <button 
          onClick={() => setAddSurveyOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            New Survey
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Surveys"
          value={surveys.length}
          change={`${newThisMonth} surveys created this month`}
          trend="up"
          icon={DocumentChartBarIcon}
        />
        <StatCard
          title="Active Respondents"
          value={surveys.reduce((total, survey) => total + survey.respondent_count, 0)}
          change={`${responseRate}% response rate`}
          trend="up"
          icon={UserGroupIcon}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col max-h-[calc(100vh-4rem)]">
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600 mt-1">Latest survey updates</p>
        </div>

        <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    activity.activity_type === "survey_created"
                      ? "bg-blue-500"
                      : activity.activity_type === "survey_completed"
                      ? "bg-emerald-500"
                      : activity.activity_type === "survey_deleted"
                      ? "bg-orange-500"
                      : "bg-purple-500"
                  }`}
                />
                <div>
                  <p className="font-medium text-gray-900">{activity.details}</p>
                  <time className="text-sm text-gray-600">
                    {new Date(activity.activity_timestamp).toLocaleString()}
                  </time>
                </div>
              </div>

              <span className="text-sm text-gray-500">
                {new Date().getTime() - new Date(activity.activity_timestamp).getTime() < 60000
                  ? "Just now"
                  : new Date().getTime() - new Date(activity.activity_timestamp).getTime() < 3600000
                  ? `${Math.floor(
                      (new Date().getTime() - new Date(activity.activity_timestamp).getTime()) / 60000
                    )} min ago`
                  : new Date().getTime() - new Date(activity.activity_timestamp).getTime() < 86400000
                  ? `${Math.floor(
                      (new Date().getTime() - new Date(activity.activity_timestamp).getTime()) / 3600000
                    )} hrs ago`
                  : `${Math.floor(
                      (new Date().getTime() - new Date(activity.activity_timestamp).getTime()) / 86400000
                    )} days ago`}
              </span>
            </div>
          ))}
        </div>
      </div>


      {addSurveyOpen && (
        <div className="text-black fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Survey</h2>
            {/* Form fields for new survey */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleTitleChange} value={title} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3} onChange={handleDescriptionChange} value={description}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Respondents</label>
                <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleMaxRespondentsChange} value={maxRespondents} />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Questions</label>
                {questions.map((q, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      placeholder={`Question ${index + 1}`}
                      className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestionField(index)}
                        className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addQuestionField}
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  + Add Question
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setAddSurveyOpen(false)} 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Survey
                </button>
              </div>
            </form>
            {/* Close button */}
            <button
              onClick={() => setAddSurveyOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}