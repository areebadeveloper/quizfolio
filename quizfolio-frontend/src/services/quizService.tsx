import api from './api';
import { AxiosError } from 'axios';

export interface Option {
  _id: string;
  optionText: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  text: string;
  options: Option[];
}

export interface Quiz {
  _id: string;
  categoryId: {
    _id: string;
    name: string;
  };
  questions: Question[];
  title: string;
}

export interface Answer {
  questionId: string;
  selectedAnswer: string;
}

// Fetch a quiz by category ID
export const fetchQuizByCategory = async (categoryId: string, token: string) => {
  try {
    console.log("Fetching quiz with categoryId:", categoryId); // Log the categoryId
    const response = await api.get<Quiz>(`/quiz/category/${categoryId}`, {
      headers: { 'x-auth-token': token },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching quiz by category:", error.response?.data || error.message);
      // Adding specific error response logging to help with debugging
      if (error.response) {
        console.error("Status code:", error.response.status);
        console.error("Error data:", error.response.data);
      }
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
    throw error;
  }
};

// Submit quiz attempt
export const submitQuizAttempt = async (quizId: string, answers: Answer[], token: string) => {
  try {
    const response = await api.post<{ score: number }>(`/quiz/attempt/${quizId}`, { answers }, {
      headers: { 'x-auth-token': token }
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error submitting quiz attempt:", error.response?.data || error.message);
      if (error.response) {
        console.error("Status code:", error.response.status);
        console.error("Error data:", error.response.data);
      }
    } else {
      console.error("Unexpected error:", (error as Error).message);
    }
    throw error;
  }
};
