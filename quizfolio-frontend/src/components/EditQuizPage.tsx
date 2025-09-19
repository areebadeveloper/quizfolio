import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuizForm from '../components/QuizForm'; // adjust path if needed

const EditQuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
        setQuiz(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch quiz:', err);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading quiz...</div>;

  return (
    <div className="container mt-4">
      <QuizForm quiz={quiz} onQuizSaved={() => {}} />
    </div>
  );
};

export default EditQuizPage;
