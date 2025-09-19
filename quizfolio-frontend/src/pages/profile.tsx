import React, { useState, useEffect, useContext } from 'react';
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonItem, IonLabel, IonAvatar, IonGrid, IonRow, IonCol, IonButton, IonIcon, 
  IonInput, IonSelect, IonSelectOption, IonAlert, IonToast, IonModal, IonHeader, 
  IonToolbar, IonTitle, IonButtons, IonFooter } from '@ionic/react';
import { personCircle, mail, school, idCard, create, trashOutline, saveOutline, closeCircle, warningOutline } from 'ionicons/icons';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import Layout from '../components/otherlayout';
import './profile.css';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{isOpen: boolean, message: string, color: string}>({isOpen: false, message: '', color: 'success'});
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
  
  const { token, logout } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/auth/user', {
        headers: { 'x-auth-token': token },
      });
      setProfile(res.data);
      setEditedProfile(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
      console.error('Error fetching profile:', err);
    }
  };

  const handleEdit = () => {
    setEditedProfile({...profile});
    setShowEditModal(true);
  };

  const handleInputChange = (name: string, value: any) => {
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleSaveProfile = async () => {
    try {
      let dataToSubmit = {...editedProfile};
      
      // Add password if it's updated
      if (showPasswordFields && password) {
        if (password !== confirmPassword) {
          setShowToast({
            isOpen: true, 
            message: 'Passwords do not match', 
            color: 'danger'
          });
          return;
        }
        dataToSubmit.password = password;
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${profile._id}`,
        dataToSubmit,
        { headers: { 'x-auth-token': token } }
      );

      if (response.data) {
        setProfile(editedProfile);
        setShowEditModal(false);
        setShowToast({
          isOpen: true,
          message: 'Profile updated successfully',
          color: 'success'
        });
        
        // Reset password fields
        setPassword('');
        setConfirmPassword('');
        setShowPasswordFields(false);
      }
    } catch (err: any) {
      setShowToast({
        isOpen: true,
        message: err.response?.data?.msg || 'Failed to update profile',
        color: 'danger'
      });
      console.error('Error updating profile:', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/users/${profile._id}`,
        { headers: { 'x-auth-token': token } }
      );
      
      setShowDeleteAlert(false);
      setShowToast({
        isOpen: true,
        message: 'Account deleted successfully',
        color: 'success'
      });
      
      // Log out and redirect after a brief delay
      setTimeout(() => {
        logout();
        history.push('/home');
      }, 1500);
    } catch (err: any) {
      setShowToast({
        isOpen: true,
        message: err.response?.data?.msg || 'Failed to delete account',
        color: 'danger'
      });
      console.error('Error deleting account:', err);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <Layout title="Profile">
          <IonContent className="ion-padding">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading profile...</p>
            </div>
          </IonContent>
        </Layout>
      </IonPage>
    );
  }

  if (error || !profile) {
    return (
      <IonPage>
        <Layout title="Profile">
          <IonContent className="ion-padding">
            <IonCard className="error-card">
              <IonCardContent>
                <p>{error || 'Failed to load profile data'}</p>
                <IonButton expand="block" onClick={() => fetchProfile()}>
                  Retry
                </IonButton>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </Layout>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Layout title="Profile">
        <IonContent className="ion-padding">
          <div className="profile-header">
            <div className="profile-avatar-container">
              <IonAvatar className="profile-avatar">
                <IonIcon icon={personCircle} className="profile-avatar-icon" />
              </IonAvatar>
            </div>
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-role">{profile.userType === 'student' ? 'Student' : 'Teacher'}</p>
          </div>

          <IonCard className="profile-card">
            <IonCardHeader>
              <IonCardTitle className="profile-card-title">Personal Information</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonItem lines="none" className="profile-item">
                      <IonIcon icon={mail} slot="start" className="profile-icon" />
                      <IonLabel>
                        <h2 className="profile-label">Email</h2>
                        <p className="profile-value">{profile.email}</p>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                </IonRow>

                {profile.userType === 'student' && profile.studentId && (
                  <IonRow>
                    <IonCol size="12">
                      <IonItem lines="none" className="profile-item">
                        <IonIcon icon={idCard} slot="start" className="profile-icon" />
                        <IonLabel>
                          <h2 className="profile-label">Student ID</h2>
                          <p className="profile-value">{profile.studentId}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                )}

                {profile.userType === 'student' && profile.studentClass && (
                  <IonRow>
                    <IonCol size="12">
                      <IonItem lines="none" className="profile-item">
                        <IonIcon icon={school} slot="start" className="profile-icon" />
                        <IonLabel>
                          <h2 className="profile-label">Class/Grade</h2>
                          <p className="profile-value">{profile.studentClass}th Grade</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                )}

                {profile.userType === 'teacher' && profile.teacherId && (
                  <IonRow>
                    <IonCol size="12">
                      <IonItem lines="none" className="profile-item">
                        <IonIcon icon={idCard} slot="start" className="profile-icon" />
                        <IonLabel>
                          <h2 className="profile-label">Teacher ID</h2>
                          <p className="profile-value">{profile.teacherId}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                )}
              </IonGrid>
            </IonCardContent>
          </IonCard>

          <div className="profile-actions">
            <IonButton expand="block" className="edit-profile-button" onClick={handleEdit}>
              <IonIcon icon={create} slot="start" />
              Edit Profile
            </IonButton>
            
            <IonButton expand="block" color="danger" className="delete-account-button" onClick={() => setShowDeleteAlert(true)}>
              <IonIcon icon={trashOutline} slot="start" />
              Delete Account
            </IonButton>
          </div>

          {/* Edit Profile Modal */}
          <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Edit Profile</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowEditModal(false)}>
                    <IonIcon icon={closeCircle} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            
            <IonContent className="ion-padding">
              <IonItem>
                <IonLabel position="stacked">Full Name</IonLabel>
                <IonInput 
                  value={editedProfile.name} 
                  onIonChange={(e) => handleInputChange('name', e.detail.value)}
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput 
                  type="email"
                  value={editedProfile.email} 
                  onIonChange={(e) => handleInputChange('email', e.detail.value)}
                />
              </IonItem>
              
              {editedProfile.userType === 'student' && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Student ID</IonLabel>
                    <IonInput 
                      value={editedProfile.studentId} 
                      onIonChange={(e) => handleInputChange('studentId', e.detail.value)}
                    />
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel position="stacked">Class/Grade</IonLabel>
                    <IonSelect 
                      value={editedProfile.studentClass}
                      onIonChange={(e) => handleInputChange('studentClass', e.detail.value)}
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
              
              {editedProfile.userType === 'teacher' && (
                <IonItem>
                  <IonLabel position="stacked">Teacher ID</IonLabel>
                  <IonInput 
                    value={editedProfile.teacherId} 
                    onIonChange={(e) => handleInputChange('teacherId', e.detail.value)}
                  />
                </IonItem>
              )}
              
              <div className="password-section">
                {!showPasswordFields ? (
                  <IonButton 
                    expand="block" 
                    fill="outline" 
                    onClick={() => setShowPasswordFields(true)}
                    className="change-password-button"
                  >
                    Change Password
                  </IonButton>
                ) : (
                  <>
                    <IonItem>
                      <IonLabel position="stacked">New Password</IonLabel>
                      <IonInput 
                        type="password" 
                        value={password} 
                        onIonChange={(e) => setPassword(e.detail.value || '')}
                      />
                    </IonItem>
                    
                    <IonItem>
                      <IonLabel position="stacked">Confirm Password</IonLabel>
                      <IonInput 
                        type="password" 
                        value={confirmPassword} 
                        onIonChange={(e) => setConfirmPassword(e.detail.value || '')}
                      />
                    </IonItem>
                    
                    <IonButton 
                      expand="block" 
                      fill="outline" 
                      color="medium"
                      onClick={() => {
                        setShowPasswordFields(false);
                        setPassword('');
                        setConfirmPassword('');
                      }}
                      className="cancel-password-button"
                    >
                      Cancel Password Change
                    </IonButton>
                  </>
                )}
              </div>
            </IonContent>
            
            <IonFooter>
              <IonToolbar>
                <IonRow>
                  <IonCol>
                    <IonButton 
                      expand="block" 
                      fill="outline" 
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton 
                      expand="block" 
                      onClick={handleSaveProfile}
                    >
                      <IonIcon icon={saveOutline} slot="start" />
                      Save
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonToolbar>
            </IonFooter>
          </IonModal>

          {/* Delete Account Alert */}
          <IonAlert
            isOpen={showDeleteAlert}
            onDidDismiss={() => setShowDeleteAlert(false)}
            header="Delete Account"
            message="Are you sure you want to delete your account? This action cannot be undone."
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
              },
              {
                text: 'Delete',
                role: 'destructive',
                handler: handleDeleteAccount
              }
            ]}
          />

          {/* Toast for notifications */}
          <IonToast
            isOpen={showToast.isOpen}
            onDidDismiss={() => setShowToast({...showToast, isOpen: false})}
            message={showToast.message}
            duration={2000}
            color={showToast.color}
          />
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default Profile;
