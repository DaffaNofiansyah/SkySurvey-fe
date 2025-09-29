'use client';
import React, { useEffect, useState } from 'react';
import { 
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import api from '../lib/api';
import API_ENDPOINTS from '../lib/endpoint';


interface Answer {
  id: string;
  survey_title: string;
  question_text: string;
  answer_text: string;
  submitted_at: string;
}

const mockData: Answer[] = [
  {
    id: '1',
    survey_title: 'Jakarta Political Social Mapping 2024',
    question_text: 'What is your opinion on the current political situation in Jakarta?',
    answer_text: 'I believe the current political situation is quite dynamic and requires careful consideration.',
    submitted_at: '2024-01-20 14:30:00',
  },
  {
    id: '2',
    survey_title: 'Surabaya Voice Mapping Survey',
    question_text: 'How do you perceive the voice of Surabaya residents in the current political landscape?',
    answer_text: 'The voice of Surabaya residents is often overlooked, and there needs to be more representation.',
    submitted_at: '2024-01-20 14:25:00',
  },
  {
    id: '3',
    survey_title: 'Bandung Economic Survey 2024',
    question_text: 'What are your thoughts on the economic development in Bandung?',
    answer_text: 'I think the economic development in Bandung is promising, but there are still many challenges to address.',
    submitted_at: '2024-01-20 14:20:00',
  },
  {
    id: '4',
    survey_title: 'Brand Equity Analysis',
    question_text: 'How do you evaluate the brand equity of local products?',
    answer_text: 'I believe local products have strong brand equity, but they need more marketing support.',
    submitted_at: '2024-01-20 14:15:00',
  },
  {
    id: '5',
    survey_title: 'Bandung Barat Survey 2024',
    question_text: 'How do you assess the development in Bandung Barat?',
    answer_text: 'The development in Bandung Barat is progressing well, but there are still areas that need improvement.',
    submitted_at: '2024-01-20 14:15:00',
  },
  {
    id: '6',
    survey_title: 'Policy Evaluation Survey',
    question_text: 'How effective do you find the current policies in addressing social issues?',
    answer_text: 'I think the current policies are a good start, but more needs to be done to address the root causes of social issues.',
    submitted_at: '2024-01-20 14:10:00',
  },
  {
    id: '7',
    survey_title: 'Jakarta Political Social Mapping 2024',
    question_text: 'What is your opinion on the current political situation in Jakarta?',
    answer_text: 'I believe the current political situation is quite dynamic and requires careful consideration.',
    submitted_at: '2024-01-20 14:30:00',
  },
  {
    id: '8',
    survey_title: 'Medan Kota Survey 2024',
    question_text: 'How do you evaluate the development in Medan Kota?',
    answer_text: 'The development in Medan Kota is on the right track, but there are still many challenges to overcome.',
    submitted_at: '2024-01-20 14:10:00',
  },
  {
    id: '9',
    survey_title: 'Jakarta Timur Survey 2024',
    question_text: 'What are your thoughts on the social issues in Jakarta Timur?',
    answer_text: 'Social issues in Jakarta Timur are complex and require a multi-faceted approach.',
    submitted_at: '2024-01-20 14:05:00',
  },
  {
    id: '10',
    survey_title: 'Jakarta Political Social Mapping 2024',
    question_text: 'What is your opinion on the current political situation in Jakarta?',
    answer_text: 'I believe the current political situation is quite dynamic and requires careful consideration.',
    submitted_at: '2024-01-20 14:30:00',
  },
  {
    id: '11',
    survey_title: 'Jakarta Political Social Mapping 2024',
    question_text: 'What is your opinion on the current political situation in Jakarta?',
    answer_text: 'I believe the current political situation is quite dynamic and requires careful consideration.',
    submitted_at: '2024-01-20 14:30:00',
  },
  {
    id: '12',
    survey_title: 'Jakarta Timur Survey 2024',
    question_text: 'What are your thoughts on the social issues in Jakarta Timur?',
    answer_text: 'Social issues in Jakarta Timur are complex and require a multi-faceted approach.',
    submitted_at: '2024-01-20 14:05:00',
  },
  {
    id: '13',
    survey_title: 'Jakarta Political Social Mapping 2024',
    question_text: 'What is your opinion on the current political situation in Jakarta?',
    answer_text: 'I believe the current political situation is quite dynamic and requires careful consideration.',
    submitted_at: '2024-01-20 14:30:00',
  },
  {
    id: '14',
    survey_title: 'Jakarta Political Social Mapping 2024',
    question_text: 'What is your opinion on the current political situation in Jakarta?',
    answer_text: 'I believe the current political situation is quite dynamic and requires careful consideration.',
    submitted_at: '2024-01-20 14:30:00',
  }
];

const statusColors = {
  completed: 'bg-emerald-100 text-emerald-800',
  partial: 'bg-orange-100 text-orange-800',
  abandoned: 'bg-red-100 text-red-800'
};

export default function DataTable() {
  const [data, setData] = useState<Answer[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Answer>('submitted_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const getAnswers = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.ANSWERS);
        const mappedData = response.data.map(answer => ({
          id: answer.id,
          survey_title: answer.Question?.Survey?.title || 'N/A',
          question_text: answer.Question?.question_text || 'N/A',
          answer_text: answer.answer_text || '',
          submitted_at: answer.Response?.submitted_at || ''
        }));
        setData(mappedData);
      } catch (error) {
        console.error('Error fetching answers:', error);
      }
    };
    getAnswers();
  }, []);



  const filteredData = data.filter(row => {
    const matchesSearch = row.survey_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         row.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         row.answer_text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof Answer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Survey Title', 'Question', 'Answer', 'Submitted At'],
      ...sortedData.map(row => [
        row.survey_title,
        row.question_text,
        row.answer_text,
        row.submitted_at
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'survey_responses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(paginatedData);
    }, 3000);

    return () => clearInterval(interval);
  }, [paginatedData]);


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Response Data</h1>
          <p className="text-gray-600 mt-2">Detailed view of all survey responses</p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search surveys, respondents, locations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Showing {paginatedData.length} of {filteredData.length} results
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: 'survey_title', label: 'Survey Title' },
                  { key: 'question_text', label: 'Question' },
                  { key: 'answer_text', label: 'Answer' },
                  { key: 'submitted_at', label: 'Submitted At' },
                ].map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key as keyof Answer)}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {sortField === column.key && (
                        <span className={`text-blue-600 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`}>
                          ↑
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 max-w-xs break-words">
                    <div className="text-sm font-medium text-gray-900">{row.survey_title}</div>
                  </td>
                  <td className="px-4 py-2 max-w-xs break-words">
                    <div className="text-sm text-gray-700">{row.question_text}</div>
                  </td>
                  <td className="px-4 py-2 max-w-xs break-words">
                    <div className="text-sm text-gray-700">{row.answer_text}</div>
                  </td>
                  <td className="px-4 py-2 max-w-xs break-words">
                    <div className="text-sm text-gray-500">{row.submitted_at}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>Page {currentPage} of {totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}