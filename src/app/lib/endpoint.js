const API_ENDPOINTS = {
  SURVEYS: "/surveys",
  SURVEY_BY_ID: (id) => `/surveys/${id}`,
  SURVEY_ACTIVATE: (id) => `/surveys/${id}/activate`,
  SURVEY_QUESTIONS: (surveyId) => `/surveys/${surveyId}/questions`,
  SURVEY_RESPONSES: (surveyId) => `/surveys/${surveyId}/responses`,
  SURVEY_ACTIVITIES: (surveyId) => `/surveys/${surveyId}/activities`,

  QUESTIONS: "/questions",
  QUESTION_BY_ID: (id) => `/questions/${id}`,
  QUESTION_ANSWERS: (questionId) => `/questions/${questionId}/answers`,

  RESPONSES: "/responses",
  RESPONSE_BY_ID: (id) => `/responses/${id}`,
  RESPONSE_ANSWERS: (responseId) => `/responses/${responseId}/answers`,

  ANSWERS: "/answers",
  ANSWER_BY_ID: (id) => `/answers/${id}`,

  ACTIVITIES: "/activities",
  ACTIVITY_BY_ID: (id) => `/activities/${id}`,
};

export default API_ENDPOINTS;
