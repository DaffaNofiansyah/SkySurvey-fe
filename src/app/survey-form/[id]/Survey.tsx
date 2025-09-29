"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../lib/api";
import API_ENDPOINTS from "../../lib/endpoint";

interface Question {
  id: string;
  question_text: string;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  Questions: Question[];
}

export default function SurveyForm() {
  const params = useParams();
  const id = params["id"];

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        const response = await api.get<Survey>(API_ENDPOINTS.SURVEY_BY_ID(id));
        console.log(response.data);
        setSurvey(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id]);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitStatus("idle");

      const answersArray = Object.entries(answers).map(([questionId, answer_text]) => ({
        question_id: questionId,
        answer_text,
      }));

      await api.post(API_ENDPOINTS.RESPONSES, {
        submitted_at: new Date().toISOString(),
        status: "completed",
        survey_id: survey?.id,
        answers: answersArray,
      });

      setSubmitStatus("success");
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    }
  };


  if (loading) return <p>Loading survey...</p>;
  if (!survey) return <p>Survey not found.</p>;

  return (
    <div className="text-black max-w-3xl mx-auto p-6 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold mb-2">{survey.title}</h1>
      <p className="mb-6 text-gray-600">{survey.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {survey.Questions && survey.Questions.map((q) => (
          <div key={q.id}>
            <label className="block font-semibold mb-1">{q.question_text}</label>
            <input
              title="Answer"
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>

        {submitStatus === "success" && (
          <p className="text-green-600 mt-2">Submitted successfully!</p>
        )}
        {submitStatus === "error" && (
          <p className="text-red-600 mt-2">Submission failed.</p>
        )}
      </form>
    </div>
  );
}
