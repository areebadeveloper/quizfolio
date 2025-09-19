import React, { useEffect, useState, useContext } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

interface Quiz {
  _id: string;
  categoryId?: { name: string };
  totalMarks: number;
  timeLimit: number;
  isActive: boolean;
  classAssigned: string; // Class assigned for each quiz
}

interface UserProfile {
  studentClass: string; // Fetch student's class from profile
  name: string;
  email: string;
}

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { token } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { 'x-auth-token': token },
        });
        setUserProfile(res.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/quizzes');
        setQuizzes(res.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchUserProfile();
    fetchQuizzes();
  }, [token]);

  useEffect(() => {
    if (userProfile && quizzes.length > 0) {
      // Updated filtering logic to handle potential format differences
      // This handles cases where one might be "4" and another "4th" or similar
      const matchedQuizzes = quizzes.filter(quiz => {
        // Extract just the numeric part for comparison
        const quizClassNum = quiz.classAssigned.replace(/[^0-9]/g, '');
        const studentClassNum = userProfile.studentClass.replace(/[^0-9]/g, '');
        return quizClassNum === studentClassNum;
      });
      setFilteredQuizzes(matchedQuizzes);
    }
  }, [userProfile, quizzes]);

  const handleStartQuiz = (quizId: string) => {
    history.push(`/quiz/attempt/${quizId}`);
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Available Quizzes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="d-flex justify-content-between mb-3">
          <IonButton color="secondary" onClick={() => history.push('/student')}>
            Back to Student Dashboard
          </IonButton>
        </div>

        <IonList>
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <IonItem key={quiz._id} className="bg-light border rounded my-2 p-3">
                <IonLabel>
                  <h5>{quiz.categoryId?.name || 'Quiz'}</h5>
                  <p>Total Marks: {quiz.totalMarks}</p>
                  <p>Time Limit: {quiz.timeLimit} minutes</p>
                  <p>Status: {quiz.isActive ? 'Active' : 'Inactive'}</p>
                </IonLabel>
                {quiz.isActive && (
                  <IonButton color="primary" onClick={() => handleStartQuiz(quiz._id)}>
                    Start Quiz
                  </IonButton>
                )}
              </IonItem>
            ))
          ) : (
            <IonItem>
              <IonLabel>No quizzes available for your class.</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default QuizList;
