import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, IonInput, IonItem, IonLabel, IonTextarea, IonAlert } from '@ionic/react';
import Layout from '../components/otherlayout';
import axios from 'axios';

const CreateQuiz: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: ''
  });

  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      await axios.post('http://localhost:5000/api/quizzes', formData, {
        headers: { 'x-auth-token': token }
      });

      setMessage({ type: 'success', text: 'Quiz created successfully' });
      setFormData({ title: '', description: '', questions: '' });
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage({ type: 'error', text: err.response.data.msg || 'Creation failed' });
      } else {
        setMessage({ type: 'error', text: 'Creation failed' });
      }
    }
  };

  return (
    <IonPage>
      <Layout title="Create Quiz" isLoggedIn>
        <IonContent>
          <form onSubmit={onSubmit} className="ion-padding">
            <IonItem className="mb-3">
              <IonLabel position="stacked">Quiz Title</IonLabel>
              <IonInput name="title" type="text" value={formData.title} onIonChange={onChange} required />
            </IonItem>
            <IonItem className="mb-3">
              <IonLabel position="stacked">Description</IonLabel>
              <IonTextarea name="description" value={formData.description} onIonChange={onChange} rows={4} required />
            </IonItem>
            <IonItem className="mb-3">
              <IonLabel position="stacked">Questions</IonLabel>
              <IonTextarea name="questions" value={formData.questions} onIonChange={onChange} rows={6} required />
            </IonItem>
            <IonButton type="submit" expand="full">Create Quiz</IonButton>

            {message && (
              <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header={message.type === 'success' ? 'Success' : 'Error'}
                message={message.text}
                buttons={['OK']}
              />
            )}
          </form>
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default CreateQuiz;
