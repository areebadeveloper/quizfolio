import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonButton, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import Layout from '../components/otherlayout';
import axios from 'axios';
import { personCircleOutline, createOutline, listOutline, peopleOutline } from 'ionicons/icons';
import './AdminProfile.css';

const AdminProfile: React.FC = () => {
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
         const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        } 

        const [adminRes, usersRes, quizzesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/profile', { headers: { 'x-auth-token': token } }),
          axios.get('http://localhost:5000/api/users', { headers: { 'x-auth-token': token } }),
          axios.get('http://localhost:5000/api/quizzes', { headers: { 'x-auth-token': token } })
        ]);

        setAdmin(adminRes.data);
        setUsers(usersRes.data);
        setQuizzes(quizzesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        window.location.href = '/login';
      }
    };

    fetchAdminDetails();
  }, []);

  return (
    <IonPage>
      <Layout title="Admin Profile" isLoggedIn>
        <IonContent>
          <div className="admin-profile ion-padding">
            <h2><IonIcon icon={personCircleOutline} /> Admin Profile</h2>
            {admin ? (
              <div>
                <p><strong>Name:</strong> {admin.name}</p>
                <p><strong>Email:</strong> {admin.email}</p>
                {/* Add more admin details as needed */}
              </div>
            ) : (
              <p>Loading admin details...</p>
            )}
            
            <IonButton expand="full" className="mt-4" routerLink="/create-quiz">
              <IonIcon icon={createOutline} /> Create Quiz
            </IonButton>

            <IonButton expand="full" className="mt-2" routerLink="/show-users">
              <IonIcon icon={peopleOutline} /> Show Users
            </IonButton>

            <IonButton expand="full" className="mt-2" routerLink="/manage-quizzes">
              <IonIcon icon={listOutline} /> Manage Quizzes
            </IonButton>

            <div className="mt-4">
              <h3>Users</h3>
              <IonList>
                {users.map(user => (
                  <IonItem key={user.id}>
                    <IonLabel>
                      <h2>{user.name}</h2>
                      <p>{user.email}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </div>

            <div className="mt-4">
              <h3>Quizzes</h3>
              <IonList>
                {quizzes.map(quiz => (
                  <IonItem key={quiz.id}>
                    <IonLabel>
                      <h2>{quiz.title}</h2>
                      <p>{quiz.description}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </div>
          </div>
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default AdminProfile;
