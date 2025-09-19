import React, { useState, useContext } from 'react';
import { IonPage, IonContent, IonButton, IonTitle, IonHeader, IonToolbar, IonInput, IonItem, IonLabel } from '@ionic/react';
import Layout from '../components/otherlayout';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const history = useHistory();
  const { login } = useContext(AuthContext);

  const handleInputChange = (name: string, value: string | null | undefined) => {
    setFormData({ ...formData, [name]: value || '' });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Logging in with:', formData);
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const token = res.data.token;

      // Store the token in AuthContext
      login(token);
      setMessage({ type: 'success', text: 'Login successful' });

      // Fetch user details to determine user type
      try {
        const userRes = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { 'x-auth-token': token },
        });

        // Check user type and redirect accordingly
        const userType = userRes.data.userType;
        if (userType === 'student') {
          history.push('/student');
        } else if (userType === 'teacher') {
          history.push('/teacher');
        } else {
          setMessage({ type: 'error', text: 'Unknown user type' });
        }
      } catch (profileErr) {
        console.error('Error fetching user profile:', profileErr);
        // Still consider login successful, but navigate to a default page
        history.push('/');
      }
      
    } catch (err) {
      console.error('Login error:', err.response?.data);
      const errorText = err.response?.data?.msg || 'Login failed';
      setMessage({ type: 'error', text: errorText });
    }
  };

  const onForgotPassword = async () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Please enter your email to reset password.' });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email: formData.email });
      setMessage({ type: 'success', text: 'Password reset email sent. Please check your inbox.' });
    } catch (err) {
      const errorText = err.response?.data?.msg || 'Failed to send reset email';
      setMessage({ type: 'error', text: errorText });
    }
  };

  return (
    <IonPage>
      <Layout title="Login">
        <IonContent>
          <form onSubmit={onSubmit} className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput 
                name="email" 
                type="email" 
                value={formData.email} 
                onIonChange={e => handleInputChange('email', e.detail.value)} 
                required 
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput 
                name="password" 
                type="password" 
                value={formData.password} 
                onIonChange={e => handleInputChange('password', e.detail.value)} 
                required 
              />
            </IonItem>
            <IonButton type="submit" expand="block" className="ion-margin-top">Login</IonButton>
            <IonButton color="tertiary" fill="clear" expand="block" onClick={onForgotPassword}>
              Forgot Password?
            </IonButton>
          </form>
          {message && (
            <div className={`alert mt-3 ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
              {message.text}
            </div>
          )}
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default Login;
