import React, { useContext, useEffect, useState } from 'react';
import { IonPage, IonCol, IonContent, IonTitle, IonRow, IonGrid, IonHeader, IonList, IonItem, IonLabel, IonToolbar, IonButton, IonIcon, IonAlert, IonToast, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import { pencilOutline, homeOutline, logOutOutline, trashOutline, addCircleOutline } from 'ionicons/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './AllUsers.css';

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null); // User currently being edited
  const history = useHistory();
  const { token, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const res = await axios.get('http://localhost:5000/api/users/all', {
        headers: { 'x-auth-token': token } // Pass token in headers
      });
      setUsers(res.data); // Assuming res.data is an array of user objects
    } catch (error) {
      console.error('Error fetching users:', error);
      setShowToast({ isOpen: true, message: 'Failed to load users' });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setUsers(users.filter(user => user._id !== id));  // Make sure to filter by user._id for MongoDB
      setShowToast({ isOpen: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Failed to delete user:', error);
      setShowToast({ isOpen: true, message: 'Failed to delete user' });
    }
  };

  const confirmDelete = (id: string) => {
    setUserIdToDelete(id);
    setShowAlert(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user); // Set the user data to be edited
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, editingUser, {
        headers: { 'x-auth-token': token }
      });
      setShowToast({ isOpen: true, message: 'User updated successfully' });
      fetchUsers(); // Refresh the list after updating
      setEditingUser(null); // Close the form after updating
    } catch (error) {
      console.error('Failed to update user:', error);
      setShowToast({ isOpen: true, message: 'Failed to update user' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditingUser((prevUser: any) => ({
      ...prevUser,
      [field]: e.target.value,
    }));
  };

  const handleSelectChange = (e: any, field: string) => {
    setEditingUser((prevUser: any) => ({
      ...prevUser,
      [field]: e.detail.value,
    }));
  };

  const goToHome = () => {
    history.push('/home');
  };

  const handleLogout = () => {
    logout();
    history.push('/login'); // Redirect to login after logout
  };

  return (
    <IonPage>
  <IonHeader>
    <IonToolbar>
      <IonTitle>Teacher Dashboard</IonTitle>
    </IonToolbar>
  </IonHeader>

  <IonContent className="ion-padding">
    {/* Add New User Button */}
    <IonButton
      style={{
        width: '250px',
        display: 'block',
        margin: '10px auto',
        borderRadius: '12px'
      }}
      color="success"
      routerLink="/register"
    >
      <IonIcon icon={addCircleOutline} slot="start" /> Add New User
    </IonButton>

    <IonButton
      style={{
        width: '250px',
        display: 'block',
        margin: '10px auto',
        borderRadius: '12px'
      }}
      color="secondary"
      routerLink="/teacher"
    >
      <IonIcon icon={homeOutline} slot="start" /> Go To Teacher Dashboard
    </IonButton>

    {/* Home and Logout Buttons */}
    <IonButton
      style={{
        width: '250px',
        display: 'block',
        margin: '10px auto',
        borderRadius: '12px'
      }}
      color="tertiary"
      onClick={goToHome}
    >
      <IonIcon slot="start" icon={homeOutline} />
      Home
    </IonButton>

    <IonButton
      style={{
        width: '250px',
        display: 'block',
        margin: '10px auto',
        borderRadius: '12px'
      }}
      color="danger"
      onClick={handleLogout}
    >
      <IonIcon slot="start" icon={logOutOutline} />
      Logout
    </IonButton>

        {/* Edit User Form */}
        {editingUser && (
          <div className="edit-form">
            <h3>Edit User</h3>
            <IonInput
              value={editingUser.name}
              placeholder="Name"
              onIonChange={(e) => handleInputChange(e, 'name')}
            />
            <IonInput
              value={editingUser.email}
              placeholder="Email"
              onIonChange={(e) => handleInputChange(e, 'email')}
            />
            <IonInput
              value={editingUser.studentId || ''}
              placeholder="Student ID"
              onIonChange={(e) => handleInputChange(e, 'studentId')}
            />
            <IonInput
              value={editingUser.studentClass || ''}
              placeholder="Class"
              onIonChange={(e) => handleInputChange(e, 'studentClass')}
            />
            <IonSelect
              value={editingUser.userType}
              onIonChange={(e) => handleSelectChange(e, 'userType')}
            >
              <IonSelectOption value="student">Student</IonSelectOption>
              <IonSelectOption value="teacher">Teacher</IonSelectOption>
            </IonSelect>
            <IonButton onClick={handleUpdateUser}>Update</IonButton>
            <IonButton onClick={() => setEditingUser(null)} color="medium">Close</IonButton>
          </div>
        )}

        {/* Users List */}
        <IonList>
          {users.map((user) => (
            <IonItem key={user._id} lines="inset" className="user-item">
              <IonLabel>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <p>{user.userType === 'student' ? `Student ID: ${user.studentId}, Class: ${user.studentClass}` : `Teacher ID: ${user.teacherId}`}</p>
              </IonLabel>
              <IonButton
                color="tertiary"
                fill="clear"
                onClick={() => handleEditUser(user)} // Open edit form
              >
                <IonIcon icon={pencilOutline} slot="icon-only" />
              </IonButton>
              <IonButton
                color="danger"
                fill="clear"
                onClick={() => confirmDelete(user._id)} // Confirm delete
              >
                <IonIcon icon={trashOutline} slot="icon-only" />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {/* Confirm Delete Alert */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirm Delete"
          message={`Are you sure you want to delete this user?`}
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            {
              text: 'Delete',
              handler: () => userIdToDelete && handleDeleteUser(userIdToDelete),
            },
          ]}
        />

        {/* Success/Error Toast */}
        <IonToast
          isOpen={showToast.isOpen}
          onDidDismiss={() => setShowToast({ isOpen: false, message: '' })}
          message={showToast.message}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default AllUsers;
