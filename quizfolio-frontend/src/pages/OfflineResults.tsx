import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton, IonBadge } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline, timeOutline, documentTextOutline } from 'ionicons/icons';
import Layout from '../components/otherlayout';
import './OfflineResults.css';

interface QuizResult {
  quizId: string;
  quizTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  completedOn: string;
  timeSpent: number;
}

const OfflineResults: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load results from localStorage
    const savedResults = localStorage.getItem('offlineQuizResults');
    if (savedResults) {
      const parsedResults: QuizResult[] = JSON.parse(savedResults);
      // Sort by most recent first
      parsedResults.sort((a, b) => 
        new Date(b.completedOn).getTime() - new Date(a.completedOn).getTime()
      );
      setResults(parsedResults);
    }
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const clearResults = () => {
    if (window.confirm('Are you sure you want to clear all your quiz results?')) {
      localStorage.removeItem('offlineQuizResults');
      setResults([]);
    }
  };

  return (
    <IonPage>
      <Layout title="Offline Quiz Results" hideFooter={true}>
        <IonContent className="ion-padding">
          <div className="results-header">
            <h1>Your Quiz Results</h1>
            <p>View your performance on offline quizzes</p>
          </div>

          {loading ? (
            <div className="loading-message">Loading your results...</div>
          ) : (
            <>
              {results.length > 0 ? (
                <>
                  <div className="results-summary">
                    <div className="summary-item">
                      <span className="summary-number">{results.length}</span>
                      <span className="summary-label">Quizzes Completed</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-number">
                        {Math.round(
                          results.reduce((sum, result) => 
                            sum + (result.score / result.totalQuestions * 100), 0
                          ) / results.length
                        )}%
                      </span>
                      <span className="summary-label">Average Score</span>
                    </div>
                  </div>
                  
                  <IonList className="results-list">
                    {results.map((result, index) => (
                      <IonItem key={index} className="result-item">
                        <IonIcon 
                          slot="start" 
                          icon={
                            result.score / result.totalQuestions >= 0.7 
                              ? checkmarkCircleOutline 
                              : closeCircleOutline
                          } 
                          color={
                            result.score / result.totalQuestions >= 0.7 
                              ? "success" 
                              : "danger"
                          }
                        />
                        <IonLabel>
                          <h2>{result.quizTitle}</h2>
                          <p className="result-subject">{result.subject}</p>
                          <div className="result-details">
                            <div className="result-date">
                              <IonIcon icon={documentTextOutline} size="small" />
                              <span>{formatDate(result.completedOn)}</span>
                            </div>
                            <div className="result-time">
                              <IonIcon icon={timeOutline} size="small" />
                              <span>{formatTime(result.timeSpent)}</span>
                            </div>
                          </div>
                        </IonLabel>
                        <IonBadge slot="end" color={
                          result.score / result.totalQuestions >= 0.7 
                            ? "success" 
                            : "danger"
                        }>
                          {result.score}/{result.totalQuestions}
                        </IonBadge>
                      </IonItem>
                    ))}
                  </IonList>
                  
                  <div className="action-buttons">
                    <IonButton 
                      expand="block" 
                      color="danger" 
                      onClick={clearResults}
                      className="clear-button"
                    >
                      Clear All Results
                    </IonButton>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <p>You haven't completed any offline quizzes yet.</p>
                  <p>Take a quiz to see your results here.</p>
                </div>
              )}
              
              <div className="navigation-buttons">
                <IonButton 
                  expand="block" 
                  routerLink="/offline-quizzes"
                  className="back-button"
                >
                  Back to Offline Quizzes
                </IonButton>
                
                <IonButton 
                  expand="block" 
                  color="medium" 
                  routerLink="/student"
                  className="dashboard-button"
                >
                  Student Dashboard
                </IonButton>
              </div>
            </>
          )}
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default OfflineResults; 