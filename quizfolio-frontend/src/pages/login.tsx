import React, { useState, useContext, useEffect } from 'react';
import { IonPage, IonContent, IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonText, IonAlert, IonLoading } from '@ionic/react';
import { logInOutline, mailOutline, lockClosedOutline, logoGoogle, logoFacebook } from 'ionicons/icons';
import Layout from '../components/otherlayout';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './login.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<{ status: string, message: string } | null>(null);
  const history = useHistory();
  const { login, isLoggedIn } = useContext(AuthContext);

  // Auto-dismiss messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Check API connectivity on component mount
  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health');
        setNetworkStatus({ status: 'connected', message: 'API is reachable' });
      } catch (error) {
        
      }
    };
    
    checkNetwork();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      history.push('/home');
    }
  }, [isLoggedIn, history]);

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
        history.push('/');
      }
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Login error:', err.response?.data);
        const errorText = err.response?.data?.msg || 'Login failed';
        setMessage({ type: 'error', text: errorText });
      } else {
        console.error('Login error:', err);
        setMessage({ type: 'error', text: 'Login failed' });
      }
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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorText = err.response?.data?.msg || 'Failed to send reset email';
        setMessage({ type: 'error', text: errorText });
      } else {
        setMessage({ type: 'error', text: 'Failed to send reset email' });
      }
    }
  };

  return (
    <IonPage>
      <Layout title="Login">
        <IonContent className="ion-padding">
          <div className="login-container">
            <div className="login-header">
              <IonImg 
                src="https://img.freepik.com/free-vector/sign-concept-illustration_114360-5425.jpg" 
                alt="Login" 
                className="login-image"
              />
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to continue your learning journey</p>
            </div>
            
            {/* Network Status Alert */}
            <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              header="Connection Issue"
              message={networkStatus?.message || "Can't connect to the server. Please check your internet connection."}
              buttons={['OK']}
            />
            
            {/* Error display */}
            {message && message.text && (
              <div className="error-container">
                <IonText color={message.type === 'error' ? 'danger' : 'success'}>
                  {message.text}
                </IonText>
              </div>
            )}
            
            <IonCard className="login-card">
              <IonCardContent>
                <form onSubmit={onSubmit}>
                  <div className="input-group">
                    <div className="input-icon-wrapper">
                      <IonIcon icon={mailOutline} className="input-icon" />
                    </div>
                    <IonInput
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onIonChange={e => handleInputChange('email', e.detail.value)}
                      required
                      className="styled-input"
                    />
                  </div>
                  
                  <div className="input-group">
                    <div className="input-icon-wrapper">
                      <IonIcon icon={lockClosedOutline} className="input-icon" />
                    </div>
                    <IonInput
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onIonChange={e => handleInputChange('password', e.detail.value)}
                      required
                      className="styled-input"
                    />
                  </div>
                  
                  <div className="forgot-password">
                    <IonButton 
                      fill="clear" 
                      onClick={onForgotPassword}
                      size="small"
                      className="forgot-button"
                    >
                      Forgot password?
                    </IonButton>
                  </div>
                  
                  <IonButton 
                    type="submit" 
                    expand="block" 
                    className="login-button"
                    disabled={!formData.email || !formData.password}
                  >
                    Sign In
                  </IonButton>
                </form>
                
                {message && (
                  <div className={`auth-message ${message.type === 'success' ? 'success' : 'error'}`}>
                    {message.text}
                  </div>
                )}
                
                <div className="register-prompt">
                  <IonText color="medium">Don't have an account?</IonText>
                  <IonButton 
                    fill="clear" 
                    routerLink="/register"
                    size="small"
                    className="register-link"
                  >
                    Register Now
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
          
          {/* Loading overlay */}
          <IonLoading isOpen={false} message={"Please wait..."} />
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default Login;
