import React, { useContext } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonButton, IonIcon, IonCardTitle } from '@ionic/react';
import { documentTextOutline, helpCircleOutline, statsChartOutline, timeOutline, logOutOutline, cloudOfflineOutline } from 'ionicons/icons';
import Layout from '../components/otherlayout';
import { AuthContext } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import './home.css';

const Student: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/home');
  };

  return (
    <IonPage>
      <Layout title="Student Dashboard" hideFooter={true}>
        <IonContent className="ion-padding">
          <div className="dashboard-header">
          <img
              src="/assets/img/quizfolio.png" 
              alt="Quizfolio Logo" 
              className="dashboard-logo"
            />
            <h1 className="dashboard-title">Student Dashboard</h1>
        </div>

        <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonCard className="dashboard-card">
                  <div className="card-icon-wrapper">
                    <IonIcon icon={documentTextOutline} className="card-icon" />
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">Available Quizzes</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">Browse through all quizzes available for you to take.</p>
                    <IonButton expand="block" routerLink="/quizlist" className="card-button">
                      Browse Quizzes
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonCard className="dashboard-card">
                  <div className="card-icon-wrapper">
                    <IonIcon icon={statsChartOutline} className="card-icon" />
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">My Results</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">View your results and performance metrics for all quizzes you've taken.</p>
                    <IonButton expand="block" routerLink="/myresults" className="card-button">
                      View Results
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonCard className="dashboard-card">
                  <div className="card-icon-wrapper">
                    <IonIcon icon={cloudOfflineOutline} className="card-icon" />
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">Offline Quizzes</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">Access and complete quizzes even when you're offline.</p>
                    <IonButton expand="block" routerLink="/offline-quizzes" className="card-button">
                      View Offline Quizzes
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonCard className="dashboard-card">
                  <div className="card-icon-wrapper">
                    <IonIcon icon={timeOutline} className="card-icon" />
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">Check your Details</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">See your data by clicking on the View Profile and update if needed.</p>
                    <IonButton expand="block" routerLink="/profile" className="card-button">
                      View Profile
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              
              <IonCol size="12" sizeMd="6">
                <div className="logout-container mt-card">
                <IonButton
                    expand="block" 
                    color="medium" 
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <IonIcon icon={logOutOutline} slot="start" />
                    Logout
                </IonButton>
                </div>
              </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      </Layout>
    </IonPage>
  );
};

export default Student;
