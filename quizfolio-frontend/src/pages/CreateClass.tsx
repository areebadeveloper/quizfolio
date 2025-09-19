import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonToast } from '@ionic/react';
import axios from 'axios';

const CreateClass: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [existingClasses, setExistingClasses] = useState<string[]>([]);

  const classOptions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  // Fetch existing class names from the backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/classes');
        setExistingClasses(res.data.map((cls: any) => cls.name)); // Assumes response is an array of class objects with a `name` field
      } catch (error) {
        console.error('Error fetching existing classes:', error);
      }
    };
    fetchClasses();
  }, []);

  const handleCreateClass = async () => {
    if (!name || !description) {
      setToastMessage('Please provide a class name and description');
      setShowToast(true);
      return;
    }

    // Check if the selected class name already exists
    if (existingClasses.includes(name)) {
      setToastMessage('Class already exists. Please choose a different class.');
      setShowToast(true);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/classes', { name, description });
      setToastMessage('Class created successfully');
      setShowToast(true);
      setName('');
      setDescription('');
      setExistingClasses([...existingClasses, name]); // Update the local state with the new class
    } catch (error) {
      console.error('Error creating class:', error);
      setToastMessage('Failed to create class');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Class</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Class Name</IonLabel>
          <IonSelect value={name} placeholder="Select Class" onIonChange={(e) => setName(e.detail.value!)}>
            {classOptions.map((classOption) => (
              <IonSelectOption key={classOption} value={classOption}>
                {classOption}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonInput
            value={description}
            placeholder="Enter class description"
            onIonChange={(e) => setDescription(e.detail.value!)}
          />
        </IonItem>
        <IonButton expand="full" onClick={handleCreateClass}>
          Create Class
        </IonButton>
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default CreateClass;
