import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonToast } from '@ionic/react';
import { arrowBackOutline, createOutline, trashOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import QuizForm from '../components/QuizForm';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Quiz {
  _id: string;
  categoryId?: { name: string };
  questions: { text: string }[];
  totalMarks: number;
  timeLimit: number;
  isActive: boolean;
}

const NewQuiz: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showForm, setShowForm] = useState(true); // Form is shown by default
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const history = useHistory();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/quizzes');
      setQuizzes(res.data);
    } catch (error) {
      console.error('Error fetching quizzes', error);
    }
  };

  const handleQuizCreationOrUpdate = () => {
    fetchQuizzes();
    setShowForm(false);
    setEditingQuiz(null);
    setToastMessage('Quiz saved successfully');
    setShowToast(true);
  };

  const toggleQuizActivation = async (quizId: string, currentStatus: boolean) => {
    try {
      await axios.put(`http://localhost:5000/api/quizzes/${quizId}/activate`);
      setToastMessage(currentStatus ? 'Quiz deactivated' : 'Quiz activated');
      fetchQuizzes();
      setShowToast(true);
    } catch (error) {
      console.error('Error toggling quiz activation status', error);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${id}`);
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>New Quiz Creation</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <IonButton color="secondary" onClick={() => history.push('/quizhome')}>
            <IonIcon icon={arrowBackOutline} slot="start" /> Back to Quiz Menu
          </IonButton>
        </div>

        {showForm && (
          <QuizForm
            quiz={editingQuiz || undefined}
            onQuizSaved={handleQuizCreationOrUpdate}
          />
        )}

        {/* <IonList>
          {quizzes.map((quiz) => (
            <IonItem key={quiz._id} className="bg-light border rounded my-2 p-3">
              <IonLabel>
                <h5 className="fw-bold mb-2">{quiz.categoryId?.name || 'No Category'}</h5>
                <p>Total Marks: {quiz.totalMarks}</p>
                <p>Time Limit: {quiz.timeLimit} minutes</p>
                <p>Status: {quiz.isActive ? 'Active' : 'Inactive'}</p>
                <h6>Questions:</h6>
                <ul>
                  {quiz.questions.map((question, index) => (
                    <li key={index}>{question.text}</li>
                  ))}
                </ul>
              </IonLabel>
              <IonButton color="primary" fill="clear" onClick={() => { setEditingQuiz(quiz); setShowForm(true); }}>
                <IonIcon icon={createOutline} slot="icon-only" />
              </IonButton>
              <IonButton color="danger" fill="clear" onClick={() => handleDeleteQuiz(quiz._id)}>
                <IonIcon icon={trashOutline} slot="icon-only" />
              </IonButton>
              <IonButton
                color={quiz.isActive ? 'danger' : 'success'}
                onClick={() => toggleQuizActivation(quiz._id, quiz.isActive)}
              >
                {quiz.isActive ? 'Deactivate' : 'Activate'}
              </IonButton>
            </IonItem>
          ))}
        </IonList> */}

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

export default NewQuiz;
