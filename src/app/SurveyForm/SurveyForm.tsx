'use client';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  PlusIcon, 
  MinusIcon, 
  DocumentTextIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { SurveyType } from '../types/survey';

interface Question {
  id: string;
  type: 'text' | 'radio' | 'checkbox' | 'scale' | 'textarea';
  title: string;
  options?: string[];
  required: boolean;
}

interface SurveyFormData {
  title: string;
  type: SurveyType;
  description: string;
  location: string;
  targetRespondents: number;
  startDate: string;
  endDate: string;
  questions: Question[];
}

const surveyTypeDescriptions = {
  [SurveyType.POLITICAL_SOCIAL_MAPPING]: 'Pemetaan sosial politik berbasis desa/kelurahan untuk strategi pemenangan kandidat',
  [SurveyType.POLITICAL_VOICE_MAPPING]: 'Gambaran suara pemilih untuk meningkatkan popularitas dan elektabilitas kandidat',
  [SurveyType.TRACKING_QUICK_COUNT]: 'Pelacakan pergerakan suara pemilih secara berkala selama kontestasi politik',
  [SurveyType.BRAND_EQUITY]: 'Analisis kekuatan branding produk untuk strategi pemasaran yang efektif',
  [SurveyType.POLICY_EVALUATION]: 'Evaluasi tingkat kepuasan masyarakat terhadap kinerja pemerintah daerah'
};

const questionTemplates = {
  [SurveyType.POLITICAL_SOCIAL_MAPPING]: [
    { title: 'Usia responden', type: 'radio', options: ['18-25', '26-35', '36-45', '46-55', '56+'] },
    { title: 'Tingkat pendidikan', type: 'radio', options: ['SD', 'SMP', 'SMA', 'Diploma', 'S1', 'S2/S3'] },
    { title: 'Pekerjaan utama', type: 'text' },
    { title: 'Partisipasi politik sebelumnya', type: 'checkbox', options: ['Pemilu Presiden', 'Pemilu Legislatif', 'Pilkada', 'Belum pernah'] }
  ],
  [SurveyType.POLITICAL_VOICE_MAPPING]: [
    { title: 'Pilihan kandidat saat ini', type: 'radio', options: ['Kandidat A', 'Kandidat B', 'Kandidat C', 'Belum menentukan'] },
    { title: 'Faktor utama dalam memilih', type: 'checkbox', options: ['Program kerja', 'Track record', 'Popularitas', 'Rekomendasi tokoh'] },
    { title: 'Tingkat keyakinan terhadap pilihan', type: 'scale' },
    { title: 'Isu yang paling penting', type: 'textarea' }
  ],
  [SurveyType.TRACKING_QUICK_COUNT]: [
    { title: 'Pilihan kandidat minggu ini', type: 'radio', options: ['Kandidat A', 'Kandidat B', 'Kandidat C', 'Belum memutuskan'] },
    { title: 'Perubahan pilihan dari survei sebelumnya', type: 'radio', options: ['Tetap sama', 'Berubah', 'Baru memutuskan'] },
    { title: 'Pengaruh kampanye terhadap pilihan', type: 'scale' },
    { title: 'Media informasi utama', type: 'checkbox', options: ['TV', 'Radio', 'Media Sosial', 'Koran', 'Word of mouth'] }
  ],
  [SurveyType.BRAND_EQUITY]: [
    { title: 'Brand yang paling dikenal', type: 'radio', options: ['Brand A', 'Brand B', 'Brand C', 'Lainnya'] },
    { title: 'Tingkat kepuasan terhadap brand', type: 'scale' },
    { title: 'Likelihood to recommend', type: 'scale' },
    { title: 'Atribut brand yang paling menarik', type: 'checkbox', options: ['Kualitas', 'Harga', 'Pelayanan', 'Inovasi'] }
  ],
  [SurveyType.POLICY_EVALUATION]: [
    { title: 'Tingkat kepuasan terhadap kinerja pemerintah', type: 'scale' },
    { title: 'Program pemerintah yang paling bermanfaat', type: 'textarea' },
    { title: 'Area yang perlu diperbaiki', type: 'checkbox', options: ['Ekonomi', 'Kesehatan', 'Pendidikan', 'Infrastruktur', 'Keamanan'] },
    { title: 'Frekuensi mendapat informasi kebijakan', type: 'radio', options: ['Sangat sering', 'Sering', 'Kadang-kadang', 'Jarang', 'Tidak pernah'] }
  ]
};

export default function SurveyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<SurveyFormData>({
    title: '',
    type: SurveyType.POLITICAL_SOCIAL_MAPPING,
    description: '',
    location: '',
    targetRespondents: 500,
    startDate: '',
    endDate: '',
    questions: []
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleTypeChange = (type: SurveyType) => {
    setFormData(prev => ({
      ...prev,
      type,
      description: surveyTypeDescriptions[type],
      questions: questionTemplates[type]?.map((q, index) => ({
        id: `q_${index}`,
        type: q.type as Question['type'],
        title: q.title,
        options: q.options,
        required: true
      })) || []
    }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type: 'text',
      title: '',
      required: true
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | boolean | string[] | undefined) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const addOption = (questionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: [...(q.options || []), ''] }
          : q
      )
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options?.map((opt, j) => j === optionIndex ? value : opt) 
            }
          : q
      )
    }));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options?.filter((_, j) => j !== optionIndex) 
            }
          : q
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Survey data:', formData);
    // Here you would typically send the data to your backend
    navigate('/surveys');
  };

  const steps = [
    { id: 1, name: 'Survey Details', icon: DocumentTextIcon },
    { id: 2, name: 'Questions', icon: ChartBarIcon },
    { id: 3, name: 'Settings', icon: UserGroupIcon }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Survey' : 'Create New Survey'}
          </h1>
          <p className="text-gray-600 mt-2">Design your political survey with AI-powered insights</p>
        </div>
        <button
          onClick={() => navigate('/surveys')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                <div className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white'
                        : 'border-2 border-gray-300 text-gray-500'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </button>
                  <span className={`ml-4 text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute top-5 right-0 left-5 w-full h-0.5 bg-gray-200">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        currentStep > step.id ? 'bg-blue-600 w-full' : 'bg-gray-200 w-0'
                      }`}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Survey Details */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Survey Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter survey title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Survey Type</label>
                <select
                  title="Select Survey Type"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value as SurveyType)}
                >
                  <option value={SurveyType.POLITICAL_SOCIAL_MAPPING}>Political Social Mapping</option>
                  <option value={SurveyType.POLITICAL_VOICE_MAPPING}>Political Voice Mapping</option>
                  <option value={SurveyType.TRACKING_QUICK_COUNT}>Tracking & Quick Count</option>
                  <option value={SurveyType.BRAND_EQUITY}>Brand Equity</option>
                  <option value={SurveyType.POLICY_EVALUATION}>Policy Evaluation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Respondents</label>
                <input
                  title='Target Respondents'
                  type="number"
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.targetRespondents}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetRespondents: parseInt(e.target.value) }))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose and scope of this survey..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Survey location (e.g., Jakarta Selatan)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    title="Start Date"
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    title="End Date"
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Questions */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Survey Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                    <button
                      title="Remove Question"
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={question.title}
                        onChange={(e) => updateQuestion(index, 'title', e.target.value)}
                        placeholder="Enter question..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                      <select
                        title="Select Question Type"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={question.type}
                        onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                      >
                        <option value="text">Text Input</option>
                        <option value="textarea">Text Area</option>
                        <option value="radio">Single Choice</option>
                        <option value="checkbox">Multiple Choice</option>
                        <option value="scale">Rating Scale</option>
                      </select>
                    </div>
                  </div>

                  {(question.type === 'radio' || question.type === 'checkbox') && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Options</label>
                        <button
                          type="button"
                          onClick={() => addOption(index)}
                          className="text-blue-600 text-sm hover:text-blue-700"
                        >
                          Add Option
                        </button>
                      </div>
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={option}
                              onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            <button
                              title="Remove Option"
                              type="button"
                              onClick={() => removeOption(index, optionIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id={`required-${question.id}`}
                      className="mr-2"
                      checked={question.required}
                      onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                    />
                    <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
                      Required question
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Survey Settings</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Collection Method</label>
                  <select 
                    title="Select Data Collection Method"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="online">Online Survey</option>
                    <option value="offline">Face-to-face Interview</option>
                    <option value="phone">Phone Interview</option>
                    <option value="hybrid">Hybrid Method</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sampling Method</label>
                  <select
                    title="Select Sampling Method"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="random">Random Sampling</option>
                    <option value="stratified">Stratified Sampling</option>
                    <option value="cluster">Cluster Sampling</option>
                    <option value="quota">Quota Sampling</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Analysis Settings</label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" id="sentiment" className="mr-3" defaultChecked />
                    <label htmlFor="sentiment" className="text-sm text-gray-700">Enable sentiment analysis</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="prediction" className="mr-3" defaultChecked />
                    <label htmlFor="prediction" className="text-sm text-gray-700">Generate predictive insights</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="anomaly" className="mr-3" defaultChecked />
                    <label htmlFor="anomaly" className="text-sm text-gray-700">Detect response anomalies</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="trends" className="mr-3" defaultChecked />
                    <label htmlFor="trends" className="text-sm text-gray-700">Track demographic trends</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Settings</label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" id="milestone" className="mr-3" defaultChecked />
                    <label htmlFor="milestone" className="text-sm text-gray-700">Notify when reaching response milestones</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="daily" className="mr-3" />
                    <label htmlFor="daily" className="text-sm text-gray-700">Daily progress reports</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="anomalies" className="mr-3" defaultChecked />
                    <label htmlFor="anomalies" className="text-sm text-gray-700">Alert on data anomalies</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {isEdit ? 'Update Survey' : 'Create Survey'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}