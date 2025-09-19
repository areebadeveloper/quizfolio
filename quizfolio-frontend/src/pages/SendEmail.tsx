import React, { useState, useEffect, useContext } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonCard, 
  IonCardHeader, 
  IonCardContent, 
  IonInput, 
  IonTextarea, 
  IonLabel, 
  IonItem, 
  IonCheckbox, 
  IonList, 
  IonAlert, 
  IonSpinner, 
  IonBadge, 
  IonChip, 
  IonToast, 
  IonAvatar,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { mailOutline, arrowBackOutline, peopleOutline, sendOutline, checkmarkCircle, personCircle } from 'ionicons/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Layout from '../components/otherlayout';
import './SendEmail.css';

interface User {
  _id: string;
  name: string;
  email: string;
  userType: string;
  studentId?: string;
  studentClass?: string;
}

const SendEmail: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');
  const [showConfirm, setShowConfirm] = useState(false);
  
  const { token } = useContext(AuthContext);
  const history = useHistory();

  // Get unique classes for filtering
  const uniqueClasses = Array.from(
    new Set(
      users
        .filter(user => user.userType === 'student' && user.studentClass)
        .map(user => user.studentClass)
    )
  ).sort();

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/users/all', {
          headers: { 'x-auth-token': token }
        });
        
        // Filter to get only students
        const students = response.data.filter((user: User) => user.userType === 'student');
        setUsers(students);
        setFilteredUsers(students);
      } catch (error) {
        console.error('Error fetching users:', error);
        showToastMessage('Failed to load students', 'danger');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Filter users based on search term and class filter
  useEffect(() => {
    let filtered = [...users];
    
    // Apply class filter
    if (classFilter) {
      filtered = filtered.filter(user => user.studentClass === classFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user => user.name.toLowerCase().includes(term) || 
                user.email.toLowerCase().includes(term) ||
                (user.studentId && user.studentId.toLowerCase().includes(term))
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, classFilter]);

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      // If all are selected, deselect all
      setSelectedUsers([]);
    } else {
      // Otherwise, select all filtered users
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectByClass = (className: string) => {
    const usersInClass = users
      .filter(user => user.studentClass === className)
      .map(user => user._id);
    
    setSelectedUsers(prev => {
      // Check if all users of this class are already selected
      const allSelected = usersInClass.every(id => prev.includes(id));
      
      if (allSelected) {
        // If all are selected, remove them
        return prev.filter(id => !usersInClass.includes(id));
      } else {
        // Otherwise, add all missing ones
        const newSelection = [...prev];
        usersInClass.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      }
    });
  };

  const handleSendEmail = async () => {
    if (selectedUsers.length === 0) {
      showToastMessage('Please select at least one student', 'warning');
      return;
    }

    if (!subject.trim()) {
      showToastMessage('Please enter a subject for your email', 'warning');
      return;
    }

    if (!message.trim()) {
      showToastMessage('Please enter a message for your email', 'warning');
      return;
    }

    setShowConfirm(true);
  };

  const confirmSendEmail = async () => {
    setSending(true);
    try {
      console.log('Sending email to:', selectedUsers);
      
      const response = await axios.post(
        'http://localhost:5000/api/email/send-email',
        { 
          userIds: selectedUsers, 
          subject, 
          message 
        },
        { 
          headers: { 'x-auth-token': token } 
        }
      );
      
      console.log('Email API response:', response.data);
      
      showToastMessage(response.data.msg || 'Emails sent successfully!', 'success');
      
      // Reset form after successful send
      setSubject('');
      setMessage('');
      setSelectedUsers([]);
      
    } catch (error: any) {
      console.error('Error sending emails:', error);
      
      // Extract the most useful error message
      let errorMessage = 'Failed to send emails. Please try again.';
      
      if (error.response?.data?.msg) {
        // Use server error message if available
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        // Otherwise use the axios error message
        errorMessage = error.message;
      }
      
      showToastMessage(errorMessage, 'danger');
    } finally {
      setSending(false);
    }
  };

  const showToastMessage = (message: string, color: string) => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  const getSelectedUserCount = () => {
    if (selectedUsers.length === 0) return 'No students selected';
    if (selectedUsers.length === 1) return '1 student selected';
    return `${selectedUsers.length} students selected`;
  };

  return (
    <IonPage>
      <Layout title="Send Emails" hideFooter={true}>
        <IonContent className="ion-padding">
          {/* Header */}
          <div className="email-header">
            <IonButton 
              color="medium" 
              fill="outline" 
              onClick={() => history.push('/teacher')}
            >
              <IonIcon slot="start" icon={arrowBackOutline} />
              Back to Dashboard
            </IonButton>
            <h1>
              <IonIcon icon={mailOutline} className="page-icon" />
              Send Emails to Students
            </h1>
          </div>

          {/* Email Form */}
          <IonCard>
            <IonCardHeader>
              <h2>Compose Email</h2>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Subject</IonLabel>
                <IonInput 
                  value={subject} 
                  onIonChange={e => setSubject(e.detail.value || '')}
                  placeholder="Enter email subject"
                />
              </IonItem>
              
              <IonItem className="message-input">
                <IonLabel position="stacked">Message</IonLabel>
                <IonTextarea 
                  value={message} 
                  onIonChange={e => setMessage(e.detail.value || '')}
                  placeholder="Type your message here..."
                  rows={6}
                  autoGrow={true}
                />
              </IonItem>
            </IonCardContent>
          </IonCard>

          {/* User Selection */}
          <IonCard>
            <IonCardHeader>
              <div className="selection-header">
                <h2>
                  <IonIcon icon={peopleOutline} />
                  Select Recipients
                </h2>
                <IonBadge color="primary">{getSelectedUserCount()}</IonBadge>
              </div>
            </IonCardHeader>
            <IonCardContent>
              {/* Search and Filter */}
              <div className="filter-container">
                <IonItem className="search-item">
                  <IonLabel position="stacked">Search Students</IonLabel>
                  <IonInput
                    value={searchTerm}
                    onIonChange={e => setSearchTerm(e.detail.value || '')}
                    placeholder="Search by name, email, or ID"
                    clearInput
                  />
                </IonItem>
                <IonItem className="class-filter-item">
                  <IonLabel>Filter by Class</IonLabel>
                  <IonSelect 
                    value={classFilter} 
                    onIonChange={e => setClassFilter(e.detail.value)}
                    placeholder="All Classes"
                  >
                    <IonSelectOption value="">All Classes</IonSelectOption>
                    {uniqueClasses.map(className => (
                      <IonSelectOption key={className} value={className}>
                        {className}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </div>

              {/* Class Quick Selection */}
              <div className="class-chips">
                <div className="chip-label">Quick Select by Class:</div>
                <div className="chips-container">
                  {uniqueClasses.map(className => (
                    <IonChip 
                      key={className} 
                      color="primary" 
                      outline={!selectedUsers.some(id => 
                        users.find(u => u._id === id)?.studentClass === className
                      )}
                      onClick={() => handleSelectByClass(className)}
                    >
                      {className}
                    </IonChip>
                  ))}
                </div>
              </div>

              {/* Select All Button */}
              <div className="select-all-container">
                <IonButton 
                  fill="outline" 
                  size="small" 
                  onClick={handleSelectAll}
                >
                  {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'} 
                  ({filteredUsers.length} students)
                </IonButton>
              </div>

              {/* User List */}
              {loading ? (
                <div className="loading-container">
                  <IonSpinner name="crescent" />
                  <p>Loading students...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="no-results">
                  <p>No students match your search criteria.</p>
                </div>
              ) : (
                <IonList className="user-list">
                  {filteredUsers.map(user => (
                    <IonItem key={user._id} className="user-item">
                      <IonCheckbox
                        slot="start"
                        checked={selectedUsers.includes(user._id)}
                        onIonChange={() => handleUserSelection(user._id)}
                      />
                      <IonAvatar slot="start">
                        <IonIcon icon={personCircle} />
                      </IonAvatar>
                      <IonLabel>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        <div className="user-details">
                          <IonBadge color="light">{user.studentId}</IonBadge>
                          {user.studentClass && (
                            <IonBadge color="primary">Class: {user.studentClass}</IonBadge>
                          )}
                        </div>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              )}

              {/* Send Button */}
              <div className="send-button-container">
                <IonButton 
                  expand="block" 
                  disabled={selectedUsers.length === 0 || !subject || !message || sending}
                  onClick={handleSendEmail}
                >
                  <IonIcon slot="start" icon={sendOutline} />
                  {sending ? 'Sending...' : `Send Email to ${selectedUsers.length} Students`}
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Confirmation Alert */}
          <IonAlert
            isOpen={showConfirm}
            onDidDismiss={() => setShowConfirm(false)}
            header="Confirm Email"
            message={`Are you sure you want to send this email to ${selectedUsers.length} students?`}
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
              },
              {
                text: 'Send',
                handler: confirmSendEmail
              }
            ]}
          />

          {/* Toast Notification */}
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={3000}
            color={toastColor}
            position="top"
            buttons={[
              {
                icon: checkmarkCircle,
                role: 'cancel'
              }
            ]}
          />
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default SendEmail; 