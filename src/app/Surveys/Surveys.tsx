'use client';
import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';
import { SurveyStatus } from '../types/survey';
import api from '../lib/api';
import API_ENDPOINTS from '../lib/endpoint';
import Link from 'next/dist/client/link';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  max_respondents: number;
  respondent_count: number;
  Questions?: { id: string; question_text: string }[];
}

const statusColors = {
  [SurveyStatus.ACTIVE]: 'bg-emerald-100 text-emerald-800',
  [SurveyStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
  [SurveyStatus.DRAFT]: 'bg-gray-300 text-gray-800'
};

export default function Surveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<SurveyStatus | 'all'>('all');
  const [addSurveyOpen, setAddSurveyOpen] = useState<boolean>(false);
  const [editSurveyOpen, setEditSurveyOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [maxRespondents, setMaxRespondents] = useState<number>(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [targetSurvey, setTargetSurvey] = useState<Survey | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleMaxRespondentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxRespondents(Number(e.target.value));
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const addQuestionField = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestionField = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newSurvey = {
        title,
        description,
        max_respondents: maxRespondents,
        status: "draft",
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

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedSurvey = {
        title,
        description,
        max_respondents: maxRespondents,
        questions,
      };
      const response = await api.put(API_ENDPOINTS.SURVEY_BY_ID(targetSurvey?.id || ''), updatedSurvey);
      setSurveys(prevSurveys => prevSurveys.map(survey => survey.id === targetSurvey?.id ? response.data : survey));
      setEditSurveyOpen(false);
    } catch (err) {
      console.error('Error updating survey:', err);
      alert('Failed to update survey. Please try again.');
    }
  };

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
    getSurveys();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(surveys);
    }, 5000);
    return () => clearInterval(interval);
  }, [surveys]);

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || survey.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };


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
    getSurveys();
  }, []);

  const handleDeleteSurvey = async (surveyId: string) => {
    if (!confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`${API_ENDPOINTS.SURVEYS}/${surveyId}`);
      setSurveys(prevSurveys => prevSurveys.filter(survey => survey.id !== surveyId));
    } catch (error) {
      console.error('Error deleting survey:', error);
      alert('Failed to delete survey. Please try again.');
    }
  };

  const handleActivateSurvey = async (survey_id: string) => {
    try {
      await api.patch(API_ENDPOINTS.SURVEY_ACTIVATE(survey_id));
      setSurveys(prevSurveys => prevSurveys.map(survey => 
        survey.id === survey_id ? { ...survey, status: SurveyStatus.ACTIVE } : survey
      ));
    } catch (error) {
      console.error('Error activating survey:', error);
      alert('Failed to activate survey. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Survey Management</h1>
          <p className="text-gray-600 mt-2">Create and manage your political surveys</p>
        </div>
        <button onClick={() => { setAddSurveyOpen(true); setTitle(''); setDescription(''); setMaxRespondents(0); setQuestions([]); }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Survey
        </button>
      </div>

      {/* Filters */}
      <div className="text-black bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search surveys..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              title="Select Survey Status"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as SurveyStatus | 'all')}
            >
              <option value="all">All</option>
              <option value={SurveyStatus.ACTIVE}>Active</option>
              <option value={SurveyStatus.COMPLETED}>Completed</option>
              <option value={SurveyStatus.DRAFT}>Draft</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Survey Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <div key={survey.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{survey.title}</h3>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                    {survey.description}
                  </span>
                </div>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[survey.status]}`}>
                  {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of Questions:</span>
                  <span className="font-medium text-gray-900">{survey.Questions ? survey.Questions.length : 0}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium text-gray-900">
                      {survey.respondent_count} / {survey.max_respondents}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(survey.respondent_count, survey.max_respondents)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <button
                    title="Edit Survey"
                    onClick={() => { setEditSurveyOpen(true); setTitle(survey.title); setDescription(survey.description); setMaxRespondents(survey.max_respondents); setQuestions(survey.Questions ? survey.Questions.map(q => q.question_text) : []); setTargetSurvey(survey); }}
                    className={`p-2 rounded-lg transition-colors ${
                      survey.status === "draft"
                        ? "text-gray-600 hover:bg-gray-200"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={survey.status !== "draft"}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSurvey(survey.id)}
                    title="Delete Survey"
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                {survey.status === "draft" && (
                  <button onClick={() => handleActivateSurvey(survey.id)}
                    className="px-4 py-2 text-sm font-medium text-green-600 rounded-lg border bg-green-200 border-gray-100 cursor-pointer hover:bg-green-300 transition-colors">
                    Publish Survey
                  </button>
                )}
                {survey.status !== "draft" && (
                  <Link target="_blank" href={`survey-form/${survey.id}`} className="px-4 py-2 text-sm font-medium bg-blue-200 text-blue-600 hover:bg-blue-300 rounded-lg transition-colors">
                    Link to Survey
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <DocumentChartBarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or create a new survey.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Create New Survey
          </button>
        </div>
      )}

      {addSurveyOpen && (
        <div className="text-black fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Survey</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input title="Survey Title" type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleTitleChange} value={title} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea title="Survey Description" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3} onChange={handleDescriptionChange} value={description}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Respondents</label>
                <input title="Max Respondents" type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleMaxRespondentsChange} value={maxRespondents} />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Questions</label>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
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
                </div>
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
            <button
              title="Close"
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

      {editSurveyOpen && (
        <div className="text-black fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Survey</h2>
            <form className="space-y-4" onSubmit={handleEdit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input title="Survey Title" type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleTitleChange} value={title} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea title="Survey Description" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3} onChange={handleDescriptionChange} value={description}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Respondents</label>
                <input title="Max Respondents" type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleMaxRespondentsChange} value={maxRespondents} />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Questions</label>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
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
                </div>
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
                  onClick={() => setEditSurveyOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
            {/* Close button */}
            <button
              title="Close"
              onClick={() => setEditSurveyOpen(false)}
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