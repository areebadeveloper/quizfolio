import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonToast,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { bookOutline, homeOutline, appsOutline } from 'ionicons/icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Quiz {
  _id: string;
  name: string;
  totalMarks: number;
  timeLimit: number;
}

interface Class {
  _id: string;
  name: string;
  description: string;
  quizzes: Quiz[];
}

const ClassesWithQuizzes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchClassesWithQuizzes();
  }, []);

  const fetchClassesWithQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes-with-quizzes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes with quizzes:', error);
      setToastMessage('Error fetching classes with quizzes');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Classes and Assigned Quizzes</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between mb-3">
          <IonButton color="primary" href="/teacher" className="d-flex align-items-center">
            <IonIcon icon={appsOutline} slot="start" />
            Dashboard
          </IonButton>
          
          <IonButton color="secondary" href="/home" className="d-flex align-items-center">
            <IonIcon icon={homeOutline} slot="start" />
            Home
          </IonButton>
        </div>

        {/* Classes and Quizzes List */}
        <IonAccordionGroup>
          {classes.map((cls) => (
            <IonAccordion key={cls._id} value={cls._id}>
              <IonItem slot="header">
                <IonLabel>
                  <h2>{cls.name}</h2>
                  <p>{cls.description}</p>
                </IonLabel>
              </IonItem>
              <IonList slot="content">
                {cls.quizzes.length > 0 ? (
                  cls.quizzes.map((quiz) => (
                    <IonItem key={quiz._id} lines="none">
                      <IonLabel>
                        <h3>{quiz.name}</h3>
                        <p>Total Marks: {quiz.totalMarks}</p>
                        <p>Time Limit: {quiz.timeLimit} minutes</p>
                      </IonLabel>
                    </IonItem>
                  ))
                ) : (
                  <IonLabel className="ion-padding">No quizzes assigned to this class.</IonLabel>
                )}
              </IonList>
            </IonAccordion>
          ))}
        </IonAccordionGroup>

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

export default ClassesWithQuizzes;
