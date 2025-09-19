import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { fetchQuizByCategory, Quiz } from '../services/quizService';
import QuizAttempt from '../components/QuizAttempt';
import { AuthContext } from '../contexts/AuthContext';

const QuizPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>(); // This should capture the correct categoryId
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (!token) {
      console.error("User is not logged in");
      history.push('/login');
      return;
    }

    const getQuiz = async () => {
      try {
        if (!categoryId) throw new Error("Invalid categoryId");
        const response = await fetchQuizByCategory(categoryId, token);
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getQuiz();
  }, [categoryId, token, history]);

  if (loading) return <div>Loading...</div>;
  if (!quiz) return <div>No quiz available in this category.</div>;

  return (
    <div>
      <h2>{quiz.title}</h2>
      <p>Category: {quiz.categoryId.name}</p>
      <QuizAttempt quiz={quiz} />
    </div>
  );
};

export default QuizPage;
