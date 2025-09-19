// src/pages/StudentQuizzes.tsx

import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import axios from 'axios';

interface Quiz {
  _id: string;
  title: string;
}

const StudentQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const studentClassId = "studentClassId"; // Use the logged-in student's class ID here

  useEffect(() => {
    fetchAssignedQuizzes();
  }, []);

  const fetchAssignedQuizzes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/classes/${studentClassId}/quizzes`);
      setQuizzes(res.data);
    } catch (error) {
      console.error('Error fetching assigned quizzes', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Quizzes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {quizzes.map((quiz) => (
            <IonItem key={quiz._id}>
              <IonLabel>{quiz.title}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default StudentQuizzes;
