import React, { useEffect, useState, useContext } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonSearchbar,
  IonSpinner,
  IonText
} from '@ionic/react';
import { arrowBackOutline, checkmarkCircleOutline, timeOutline, documentTextOutline } from 'ionicons/icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext';
import Layout from '../components/otherlayout';  // Ensure using our main layout
import './AssignedQuizzes.css';

interface Quiz {
  _id: string;
  name: string;
  totalMarks: number;
  timeLimit: number;
  categoryId?: { name: string }; // Include category name
}

interface Class {
  _id: string;
  name: string;
}

const ClassQuizzes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchClasses();
    fetchCategories();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories.');
    }
  };

  const fetchClassQuizzes = async (classId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/classes/${classId}/quizzes`);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Failed to load quizzes.');
    }
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    fetchClassQuizzes(classId);
  };

  const handleBackClick = () => {
    setSelectedClassId(null);
    setQuizzes([]);
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/studentQuizzes/my-quizzes', {
          headers: { 'x-auth-token': token }
        });
        setQuizzes(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load assigned quizzes');
        setLoading(false);
        console.error('Error fetching quizzes:', err);
      }
    };

    fetchQuizzes();
  }, [token]);

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.quizData.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Determine if a quiz is available now
  const isQuizAvailable = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  return (
    <IonPage>
      <Layout title="Assigned Quizzes" showBackButton={true}>
        <IonContent className="ion-padding">
          <div className="page-header">
            <h1 className="page-title">Your Assigned Quizzes</h1>
            <p className="page-subtitle">View quizzes that have been assigned to you</p>
          </div>

          <IonSearchbar
            value={searchTerm}
            onIonChange={e => setSearchTerm(e.detail.value!)}
            placeholder="Search quizzes..."
            className="quiz-searchbar"
          />

          {loading ? (
            <div className="loading-container">
              <IonSpinner name="circular" />
              <p>Loading quizzes...</p>
            </div>
          ) : error ? (
            <IonCard className="error-card">
              <IonCardContent>
                <IonText color="danger">{error}</IonText>
              </IonCardContent>
            </IonCard>
          ) : filteredQuizzes.length === 0 ? (
            <IonCard className="empty-card">
              <IonCardContent className="ion-text-center">
                <IonIcon icon={documentTextOutline} size="large" color="medium" />
                <IonText color="medium">
                  <p>No assigned quizzes found</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonList>
              {filteredQuizzes.map((quiz) => {
                const available = isQuizAvailable(quiz.startDate, quiz.endDate);
                return (
                  <IonCard key={quiz._id} className="quiz-card">
                    <IonCardHeader>
                      <IonCardTitle className="quiz-card-title">{quiz.quizData.title}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="quiz-details">
                        <div className="quiz-detail-item">
                          <IonIcon icon={timeOutline} className="quiz-detail-icon" />
                          <span>Available: {formatDate(quiz.startDate)} - {formatDate(quiz.endDate)}</span>
                        </div>
                        <div className="quiz-detail-item">
                          <IonIcon 
                            icon={checkmarkCircleOutline} 
                            className="quiz-detail-icon"
                            color={available ? "success" : "medium"} 
                          />
                          <span className={available ? "available-text" : "unavailable-text"}>
                            {available ? "Available Now" : "Not Available"}
                          </span>
                        </div>
                      </div>
                      <div className="quiz-actions">
                        <IonButton 
                          expand="block" 
                          disabled={!available}
                          routerLink={`/quiz/attempt/${quiz.quizData._id}`}
                          className="take-quiz-button"
                        >
                          {available ? "Take Quiz" : "Quiz Not Available"}
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                );
              })}
            </IonList>
          )}
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default ClassQuizzes;
