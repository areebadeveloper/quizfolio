import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonToast,
} from '@ionic/react';

interface Quiz {
  _id: string;
  name: string;
  totalMarks: number;
  timeLimit: number;
}

const ClassQuizzes: React.FC<{ classId: string }> = ({ classId }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchClassQuizzes();
  }, [classId]);

  const fetchClassQuizzes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/classes/${classId}/quizzes`);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setToastMessage('Error fetching quizzes for class');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Class Quizzes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <IonItem key={quiz._id}>
                <IonLabel>
                  <h2>{quiz.name}</h2>
                  <p>Total Marks: {quiz.totalMarks}</p>
                  <p>Time Limit: {quiz.timeLimit} minutes</p>
                </IonLabel>
              </IonItem>
            ))
          ) : (
            <IonLabel>No quizzes assigned to this class.</IonLabel>
          )}
        </IonList>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default ClassQuizzes;
