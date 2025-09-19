// src/components/CategoryForm.tsx
import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import axios from 'axios';

interface CategoryFormProps {
  onCategoryAdded: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onCategoryAdded }) => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/categories', { name });
      onCategoryAdded();
      setName('');
    } catch (error) {
      console.error('Error creating category', error);
    }
  };

  return (
    <div>
      <IonItem>
        <IonLabel position="stacked">Category Name</IonLabel>
        <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} />
      </IonItem>
      <IonButton expand="full" onClick={handleSubmit}>Create Category</IonButton>
    </div>
  );
};

export default CategoryForm;
