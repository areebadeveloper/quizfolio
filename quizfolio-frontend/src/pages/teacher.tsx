// src/pages/Teacher.tsx
import React, { useContext } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonButton, IonIcon, IonCardTitle } from '@ionic/react';
import { documentTextOutline, schoolOutline, peopleOutline, statsChartOutline, logOutOutline, homeOutline, mailOutline } from 'ionicons/icons';
import Layout from '../components/otherlayout';
import { AuthContext } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import './home.css';  

const Teacher: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/home');
  };

  const goHome = () => {
    history.push('/home');
  };

  return (
    <IonPage>
      <Layout title="Teacher Dashboard" hideFooter={true} showBackButton={true}>
        <IonContent className="ion-padding">
          <div className="dashboard-header">
            <img 
              src="/assets/img/quizfolio.png" 
              alt="Quizfolio Logo" 
              className="dashboard-logo"
            />
            <h1 className="dashboard-title">Teacher Dashboard</h1>
          </div>

          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonCard className="dashboard-card">
                  <div className="card-icon-wrapper">
                    <IonIcon icon={documentTextOutline} className="card-icon" />
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">My Quizzes</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">View all your quizzes, edit existing ones or create new ones.</p>
                    <IonButton expand="block" routerLink="/quizzes" className="card-button">
                      Go to Quizzes
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonCard className="dashboard-card">
                  <div className="card-icon-wrapper">
                    <IonIcon icon={schoolOutline} className="card-icon" />
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">Class, Quiz and Category Management</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">Manage your classes, assign quizzes to classes, Add Questions and Categories and view submissions.</p>
                    <IonButton expand="block" routerLink="/quizassign" className="card-button">
                      Manage Classes
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonCard className="dashboard-card">
                  <div className="card-icon-wrapper">
                    <IonIcon icon={peopleOutline} className="card-icon" />
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">Students</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">View student performance, track progress, and manage student accounts.</p>
                    <IonButton expand="block" routerLink="/allUsers" className="card-button">
                      View Students
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonCard className="dashboard-card">
                  <div className="card-icon-wrapper">
                    <IonIcon icon={statsChartOutline} className="card-icon" />
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">Results</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">Access detailed quiz results, analytics, and performance metrics.</p>
                    <IonButton expand="block" routerLink="/results" className="card-button">
                      View Results
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonCard className="dashboard-card">
                  <div className="card-icon-wrapper">
                    <IonIcon icon={mailOutline} className="card-icon" />
                  </div>
                  <IonCardHeader>
                    <IonCardTitle className="card-title">Email Students</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="card-description">Send important announcements or updates to selected students via email.</p>
                    <IonButton expand="block" routerLink="/send-email" className="card-button">
                      Send Emails
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              
              <IonCol size="12" sizeMd="6">
                <div className="dashboard-action-buttons">
                  <IonButton 
                    expand="block" 
                    color="medium" 
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    <IonIcon icon={logOutOutline} slot="start" />
                    Logout
                  </IonButton>
                  
                  <IonButton 
                    expand="block" 
                    color="primary" 
                    className="home-button"
                    onClick={goHome}
                  >
                    <IonIcon icon={homeOutline} slot="start" />
                    Home
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

export default Teacher;
