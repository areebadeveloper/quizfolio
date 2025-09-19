import React from 'react';
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/react';
import { bookOutline, flashOutline, earthOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import Layout from '../components/otherlayout';
import './OfflineQuizzes.css';

const OfflineQuizzes: React.FC = () => {
  const history = useHistory();

  const startQuiz = (subject: string) => {
    history.push(`/offline-quiz/${subject}`);
  };

  return (
    <IonPage>
      <Layout title="Offline Quizzes" hideFooter={true}>
        <IonContent className="ion-padding">
          <div className="page-header">
            <h1>Offline Quizzes</h1>
            <p>Select a subject below to start a quiz</p>
          </div>

          <div className="quiz-grid">
            <IonCard className="quiz-card">
              <IonCardHeader>
                <IonIcon icon={bookOutline} className="quiz-icon" />
                <IonCardTitle>Math Quiz</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Test your math skills with questions on algebra, geometry, and arithmetic.</p>
                <p className="quiz-info">4 questions • 5 minutes</p>
                <IonButton expand="block" onClick={() => startQuiz('math')}>
                  Start Quiz
                </IonButton>
              </IonCardContent>
            </IonCard>

            <IonCard className="quiz-card">
              <IonCardHeader>
                <IonIcon icon={flashOutline} className="quiz-icon" />
                <IonCardTitle>Science Quiz</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Challenge yourself with questions on chemistry, physics, and biology.</p>
                <p className="quiz-info">4 questions • 5 minutes</p>
                <IonButton expand="block" onClick={() => startQuiz('science')}>
                  Start Quiz
                </IonButton>
              </IonCardContent>
            </IonCard>

            <IonCard className="quiz-card">
              <IonCardHeader>
                <IonIcon icon={earthOutline} className="quiz-icon" />
                <IonCardTitle>Geography Quiz</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Test your knowledge of countries, capitals, and world geography.</p>
                <p className="quiz-info">4 questions • 5 minutes</p>
                <IonButton expand="block" onClick={() => startQuiz('geography')}>
                  Start Quiz
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>

          <div className="back-button-container">
            <IonButton
              expand="block"
              color="medium"
              routerLink="/student"
            >
              Back to Dashboard
            </IonButton>
          </div>
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default OfflineQuizzes; 