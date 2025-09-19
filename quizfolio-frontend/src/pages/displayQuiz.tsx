import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IonButton, IonLabel, IonItem, IonInput } from '@ionic/react';

const QuizPage = ({ quizId, userId }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${quizId}`).then((res) => setQuiz(res.data.quiz));
  }, [quizId]);

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find((ans) => ans.questionId === questionId);
      if (existingAnswer) {
        return prevAnswers.map((ans) =>
          ans.questionId === questionId ? { ...ans, selectedAnswer } : ans
        );
      }
      return [...prevAnswers, { questionId, selectedAnswer }];
    });
  };

  const handleSubmit = () => {
    axios
      .post(`http://localhost:5000/api/quizzes/submit/${quizId}`, {
        userId,
        answers,
      })
      .then((res) => {
        setScore(res.data.score);
        alert('Quiz submitted successfully!');
      })
      .catch((err) => console.error('Error submitting quiz:', err));
  };

  if (!quiz) return <div>Loading quiz...</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div>
      <IonLabel>{`Question ${currentQuestionIndex + 1}: ${currentQuestion.text}`}</IonLabel>
      <IonInput
        type="text"
        onIonChange={(e) => handleAnswerChange(currentQuestion._id, e.detail.value)}
        placeholder="Enter your answer"
      />
      <IonButton onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>Next</IonButton>
      {currentQuestionIndex === quiz.questions.length - 1 && (
        <IonButton onClick={handleSubmit}>Submit Quiz</IonButton>
      )}
      {score !== null && <div>Your score is: {score}</div>}
    </div>
  );
};

export default QuizPage;
