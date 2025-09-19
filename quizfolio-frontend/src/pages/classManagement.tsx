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
  IonButton,
  IonButtons,         // 👈 added
  IonSelect,
  IonSelectOption,
  IonToast,
  IonIcon,
} from '@ionic/react';
import {
  checkmarkOutline,
  bookOutline,
  informationCircleOutline,
  addCircleOutline,
  clipboardOutline,
  arrowBackOutline
} from 'ionicons/icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

interface Class {
  _id: string;
  name: string;
  description: string;
}

interface Quiz {
  _id: string;
  name: string;
  totalMarks: number;
  timeLimit: number;
  categoryId?: { name: string };
}

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const history = useHistory();

  useEffect(() => {
    fetchClasses();
    fetchQuizzes();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleAssignQuizzes = async () => {
    if (!selectedClassId || selectedQuizIds.length === 0) {
      setToastMessage('Please select a class and at least one quiz');
      setShowToast(true);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/classes/assign-quizzes', {
        classId: selectedClassId,
        quizIds: selectedQuizIds,
      });
      setToastMessage('Quizzes assigned successfully');
      setShowToast(true);
      setSelectedClassId(null);
      setSelectedQuizIds([]);
    } catch (error) {
      console.error('Error assigning quizzes to class:', error);
      setToastMessage('Error assigning quizzes');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
     <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonButton fill="clear" routerLink="/teacher" routerDirection="back">
          <IonIcon slot="start" icon={arrowBackOutline} />
          Go to Quiz Home
        </IonButton>
      </IonButtons>

      <IonTitle>Class Management</IonTitle>

      <IonButtons slot="end">
        <IonButton fill="solid" color="primary" routerLink="/questions">
          <IonIcon slot="start" icon={addCircleOutline} />
          Add Questions
        </IonButton>
        <IonButton fill="solid" color="secondary" className="ms-2" routerLink="/categories">
          <IonIcon slot="start" icon={addCircleOutline} />
          Add Categories
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>

      <IonContent className="ion-padding">
        <h2>Select a Class</h2>
        <IonSelect
          placeholder="Select Class"
          value={selectedClassId}
          onIonChange={(e) => setSelectedClassId(e.detail.value)}
        >
          {classes.map((cls) => (
            <IonSelectOption key={cls._id} value={cls._id}>
              {cls.name}
            </IonSelectOption>
          ))}
        </IonSelect>

        <h2 className="mt-4">Available Quizzes</h2>
        <IonList className="quiz-list">
          {quizzes.map((quiz) => (
            <IonItem key={quiz._id} className="quiz-item bg-white border rounded my-3 shadow-sm p-4">
              <IonLabel>
                <h5 className="fw-bold text-primary">
                  <IonIcon icon={bookOutline} className="me-2" />
                  {quiz.name}
                </h5>
                <div className="d-flex align-items-center mb-2">
                  <IonIcon icon={clipboardOutline} className="text-success me-2" />
                  <strong>Category:</strong> {quiz.categoryId?.name || 'No Category'}
                </div>
                <div className="d-flex align-items-center mb-2">
                  <IonIcon icon={informationCircleOutline} className="text-secondary me-2" />
                  <strong>Total Marks:</strong> {quiz.totalMarks}
                </div>
                <div className="d-flex align-items-center">
                  <IonIcon icon={informationCircleOutline} className="text-info me-2" />
                  <strong>Time Limit:</strong> {quiz.timeLimit} minutes
                </div>
              </IonLabel>
              <IonButton
                className="ms-auto"
                onClick={() =>
                  setSelectedQuizIds((prev) =>
                    prev.includes(quiz._id)
                      ? prev.filter((id) => id !== quiz._id)
                      : [...prev, quiz._id]
                  )
                }
                color={selectedQuizIds.includes(quiz._id) ? 'success' : 'medium'}
                fill="outline"
              >
                <IonIcon icon={selectedQuizIds.includes(quiz._id) ? checkmarkOutline : addCircleOutline} />
                {selectedQuizIds.includes(quiz._id) ? 'Selected' : 'Select'}
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonButton expand="full" color="success" className="mt-4" onClick={handleAssignQuizzes}>
          Assign Selected Quizzes to Class
        </IonButton>

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

export default ClassManagement;
