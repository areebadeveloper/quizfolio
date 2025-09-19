import React, { useEffect, useState, useContext } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonRow, IonCol, IonText, IonList } from '@ionic/react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { UserContext } from '../contexts/UserContext';
import { useHistory } from 'react-router-dom';

interface QuizResult {
  _id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  email: string;
  quizId: string;
  score: number;
  timeSpent: number;
}

interface Quiz {
  _id: string;
  categoryId: string;
  totalMarks?: number; // Optional to allow defaulting
}

interface Category {
  _id: string;
  name: string;
}

const MyResults: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const history = useHistory();

  const BONUS_THRESHOLD = 30;
  const BONUS_POINTS = 3;
  const DEFAULT_TOTAL_MARKS = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories', {
          headers: { 'x-auth-token': token },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quizzes', {
          headers: { 'x-auth-token': token },
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchCategories();
    fetchQuizzes();
  }, [token]);

  useEffect(() => {
    const fetchAllResults = async () => {
      if (!token || !user?.email) {
        //setError("Unauthorized: No valid authentication token found.");
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/quizResult/all', {
          headers: { 'x-auth-token': token },
        });
        const userResults = response.data.filter(
          (result: QuizResult) => result.email === user.email
        );
        setResults(userResults);
      } catch (error) {
        setError("Failed to fetch results. Please ensure you are authorized.");
        console.error("Error fetching results:", error);
      }
    };

    fetchAllResults();
  }, [token, user?.email]);

  const getQuizTotalMarks = (quizId: string) => {
    const quiz = quizzes.find((q) => q._id === quizId);
    return quiz?.totalMarks ?? DEFAULT_TOTAL_MARKS;
  };

  const getCategoryName = (quizId: string) => {
    const quiz = quizzes.find((q) => q._id === quizId);
    const category = categories.find((cat) => cat._id === quiz?.categoryId);
    if (category && ["Biology", "Physics", "English", "Chemistry"].includes(category.name)) {
      return category.name;
    }
    return 'Physics'; // Default category name
  };

  const calculateScore = (score: number, totalMarks: number, timeSpent: number) => {
    const percentage = (score / totalMarks) * 100;
    const finalScore = timeSpent < BONUS_THRESHOLD ? score + BONUS_POINTS : score;
    return {
      formattedScore: `${finalScore} / ${totalMarks}`,
      percentage: ((finalScore / totalMarks) * 100).toFixed(2) + '%',
    };
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Quiz Results</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <IonButton color="secondary" onClick={() => history.push('/student')}>
            Go Back to Dashboard
          </IonButton>
        </div>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {results.length > 0 ? (
          <IonList>
            <IonRow className="table-header">
              <IonCol><strong>Quiz Category</strong></IonCol>
              <IonCol><strong>Score (Obtained / Total)</strong></IonCol>
              <IonCol><strong>Percentage</strong></IonCol>
              <IonCol><strong>Time Spent (s)</strong></IonCol>
            </IonRow>

            {results.map((result) => {
              const totalMarks = getQuizTotalMarks(result.quizId);
              const { formattedScore, percentage } = calculateScore(
                result.score,
                totalMarks,
                result.timeSpent
              );

              return (
                <IonRow key={result._id}>
                  <IonCol>{getCategoryName(result.quizId)}</IonCol>
                  <IonCol>{formattedScore}</IonCol>
                  <IonCol>{percentage}</IonCol>
                  <IonCol>{result.timeSpent}</IonCol>
                </IonRow>
              );
            })}
          </IonList>
        ) : (
          <IonText>No results available for your quizzes.</IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyResults;
