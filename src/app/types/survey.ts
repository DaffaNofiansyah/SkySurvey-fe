export interface Survey {
  id: string;
  title: string;
  type: SurveyType;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: SurveyStatus;
  respondents: number;
  targetRespondents: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum SurveyType {
  POLITICAL_SOCIAL_MAPPING = 'political_social_mapping',
  POLITICAL_VOICE_MAPPING = 'political_voice_mapping',
  TRACKING_QUICK_COUNT = 'tracking_quick_count',
  BRAND_EQUITY = 'brand_equity',
  POLICY_EVALUATION = 'policy_evaluation'
}

export enum SurveyStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DRAFT = 'draft'
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  responses: Record<string, string | number | boolean | null>;
  location: string;
  timestamp: Date;
}

export interface AIInsight {
  id: string;
  surveyId: string;
  type: 'trend' | 'prediction' | 'recommendation' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  data: Record<string, string | number | boolean | null>;
  createdAt: Date;
}