import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonButton, IonInput, IonSelect, IonSelectOption, IonIcon, IonImg, IonText, IonItem, IonGrid, IonRow, IonCol } from '@ionic/react';
import { personOutline, mailOutline, lockClosedOutline, schoolOutline, idCardOutline, createOutline } from 'ionicons/icons';
import Layout from '../components/otherlayout';
import axios from 'axios';
import './register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'student',
    studentId: '',
    studentClass: '',
    teacherId: ''
  });

  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]{5,}$/;
    return nameRegex.test(name);
  };

  const handleInputChange = (name: string, value: string | null | undefined) => {
    setFormData({ ...formData, [name]: value || '' });
  };

  const onSelectChange = (e: CustomEvent) => {
    setFormData({ ...formData, userType: e.detail.value });
  };

  const onClassChange = (e: CustomEvent) => {
    setFormData({ ...formData, studentClass: e.detail.value });
  };

  const goToNextStep = () => {
    // Validate first step
    if (activeStep === 1) {
      if (!validateName(formData.name)) {
        setMessage({ type: 'error', text: 'Name must be at least 5 characters long and contain only letters and spaces.' });
        return;
      }
      if (!formData.email || !formData.password) {
        setMessage({ type: 'error', text: 'Please fill in all required fields.' });
        return;
      }
    }
    
    setActiveStep(activeStep + 1);
    setMessage(null);
  };

  const goToPreviousStep = () => {
    setActiveStep(activeStep - 1);
    setMessage(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(formData.name)) {
      setMessage({ type: 'error', text: 'Name must be at least 5 characters long and contain only letters and spaces.' });
      return;
    }

    try {
      console.log('Registering with data:', formData);
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('Registration response:', res.data);
      setMessage({ type: 'success', text: 'Registration successful! You can now log in.' });
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      const errorData = err.response?.data;
      const errorMessage = Array.isArray(errorData?.errors)
        ? errorData.errors.map((error: any) => error.msg).join(', ')
        : errorData?.msg || 'Registration failed';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const onClear = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      userType: 'student',
      studentId: '',
      studentClass: '',
      teacherId: ''
    });
  };

  // Auto-dismiss messages after 3 seconds for all message types
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <IonPage>
      <Layout title="Register">
        <IonContent className="ion-padding">
          <div className="register-container">
            <div className="register-header">
              <IonImg 
                src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg" 
                alt="Register" 
                className="register-image"
              />
              <h1 className="register-title">Create Account</h1>
              <p className="register-subtitle">Join our learning community today</p>
            </div>
            
            <div className="progress-indicator">
              <div className={`progress-step ${activeStep >= 1 ? 'active' : ''}`}>1</div>
              <div className="progress-line"></div>
              <div className={`progress-step ${activeStep >= 2 ? 'active' : ''}`}>2</div>
              <div className="progress-line"></div>
              <div className={`progress-step ${activeStep >= 3 ? 'active' : ''}`}>3</div>
            </div>
            
            <div className="step-label">
              {activeStep === 1 && <span>Basic Information</span>}
              {activeStep === 2 && <span>Account Type</span>}
              {activeStep === 3 && <span>Confirmation</span>}
            </div>
            
            <div className="register-card-container">
              <form onSubmit={activeStep === 3 ? onSubmit : (e) => e.preventDefault()}>
                {/* Step 1: Basic Information */}
                {activeStep === 1 && (
                  <div className="register-step">
                    <div className="input-group">
                      <div className="input-icon-wrapper">
                        <IonIcon icon={personOutline} className="input-icon" />
                      </div>
                      <IonInput
                        placeholder="Full Name"
                        value={formData.name}
                        onIonChange={e => handleInputChange('name', e.detail.value)}
                        required
                        className="styled-input"
                      />
                    </div>
                    
                    <div className="input-group">
                      <div className="input-icon-wrapper">
                        <IonIcon icon={mailOutline} className="input-icon" />
                      </div>
                      <IonInput
                        type="email"
                        placeholder="Email Address"
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
                    
                    <IonButton 
                      expand="block" 
                      className="step-button"
                      onClick={goToNextStep}
                    >
                      Continue
                    </IonButton>
                  </div>
                )}
                
                {/* Step 2: Account Type */}
                {activeStep === 2 && (
                  <div className="register-step">
                    <div className="account-type-selector">
                      <div 
                        className={`account-type-option ${formData.userType === 'student' ? 'selected' : ''}`}
                        onClick={() => handleInputChange('userType', 'student')}
                      >
                        <div className="account-type-icon">
                          <IonIcon icon={personOutline} />
                        </div>
                        <div className="account-type-label">Student</div>
                      </div>
                      
                      <div 
                        className={`account-type-option ${formData.userType === 'teacher' ? 'selected' : ''}`}
                        onClick={() => handleInputChange('userType', 'teacher')}
                      >
                        <div className="account-type-icon">
                          <IonIcon icon={schoolOutline} />
                        </div>
                        <div className="account-type-label">Teacher</div>
                      </div>
                    </div>
                    
                    {formData.userType === 'student' && (
                      <>
                        <div className="input-group">
                          <div className="input-icon-wrapper">
                            <IonIcon icon={idCardOutline} className="input-icon" />
                          </div>
                          <IonInput
                            placeholder="Student ID"
                            value={formData.studentId}
                            onIonChange={e => handleInputChange('studentId', e.detail.value)}
                            className="styled-input"
                          />
                        </div>
                        
                        <IonItem className="class-select-item">
                          <IonSelect
                            value={formData.studentClass}
                            onIonChange={onClassChange}
                            placeholder="Select Class/Grade"
                            interface="popover"
                            className="class-select"
                          >
                            {[...Array(12)].map((_, i) => (
                              <IonSelectOption key={i + 1} value={`${i + 1}`}>
                                {i + 1}th Grade
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        </IonItem>
                      </>
                    )}
                    
                    {formData.userType === 'teacher' && (
                      <div className="input-group">
                        <div className="input-icon-wrapper">
                          <IonIcon icon={idCardOutline} className="input-icon" />
                        </div>
                        <IonInput
                          placeholder="Teacher ID"
                          value={formData.teacherId}
                          onIonChange={e => handleInputChange('teacherId', e.detail.value)}
                          className="styled-input"
                        />
                      </div>
                    )}
                    
                    <IonGrid>
                      <IonRow>
                        <IonCol>
                          <IonButton 
                            expand="block" 
                            fill="outline"
                            className="back-step-button"
                            onClick={goToPreviousStep}
                          >
                            Back
                          </IonButton>
                        </IonCol>
                        <IonCol>
                          <IonButton 
                            expand="block" 
                            className="step-button"
                            onClick={goToNextStep}
                          >
                            Continue
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>
                )}
                
                {/* Step 3: Confirmation */}
                {activeStep === 3 && (
                  <div className="register-step">
                    <div className="confirmation-box">
                      <h3>Review Your Information</h3>
                      
                      <div className="confirmation-item">
                        <IonIcon icon={personOutline} />
                        <div className="confirmation-label">Name:</div>
                        <div className="confirmation-value">{formData.name}</div>
                      </div>
                      
                      <div className="confirmation-item">
                        <IonIcon icon={mailOutline} />
                        <div className="confirmation-label">Email:</div>
                        <div className="confirmation-value">{formData.email}</div>
                      </div>
                      
                      <div className="confirmation-item">
                        <IonIcon icon={schoolOutline} />
                        <div className="confirmation-label">Account Type:</div>
                        <div className="confirmation-value">{formData.userType === 'student' ? 'Student' : 'Teacher'}</div>
                      </div>
                      
                      {formData.userType === 'student' && formData.studentId && (
                        <div className="confirmation-item">
                          <IonIcon icon={idCardOutline} />
                          <div className="confirmation-label">Student ID:</div>
                          <div className="confirmation-value">{formData.studentId}</div>
                        </div>
                      )}
                      
                      {formData.userType === 'student' && formData.studentClass && (
                        <div className="confirmation-item">
                          <IonIcon icon={createOutline} />
                          <div className="confirmation-label">Class/Grade:</div>
                          <div className="confirmation-value">{formData.studentClass}th</div>
                        </div>
                      )}
                      
                      {formData.userType === 'teacher' && formData.teacherId && (
                        <div className="confirmation-item">
                          <IonIcon icon={idCardOutline} />
                          <div className="confirmation-label">Teacher ID:</div>
                          <div className="confirmation-value">{formData.teacherId}</div>
                        </div>
                      )}
                    </div>
                    
                    <IonGrid>
                      <IonRow>
                        <IonCol>
                          <IonButton 
                            expand="block" 
                            fill="outline"
                            className="back-step-button"
                            onClick={goToPreviousStep}
                          >
                            Back
                          </IonButton>
                        </IonCol>
                        <IonCol>
                          <IonButton 
                            expand="block" 
                            className="register-button"
                            type="submit"
                          >
                            Register
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                    
                    <div className="terms-agreement">
                      <p>By clicking Register, you agree to our <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.</p>
                    </div>
                  </div>
                )}
                
                {message && (
                  <div className={`auth-message ${message.type === 'success' ? 'success' : 'error'}`}>
                    {message.text}
                  </div>
                )}
                
                {activeStep === 1 && (
                  <div className="login-prompt">
                    <IonText color="medium">Already have an account?</IonText>
                    <IonButton 
                      fill="clear" 
                      routerLink="/login"
                      size="small"
                      className="login-link"
                    >
                      Login Now
                    </IonButton>
                  </div>
                )}
              </form>
            </div>
          </div>
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default Register;
