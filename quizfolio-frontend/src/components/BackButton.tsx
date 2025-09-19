import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './BackButton.css';

const BackButton: React.FC = () => {
  const history = useHistory();
  
  const handleBack = () => {
    history.goBack();
  };
  
  return (
    <IonButton 
      className="back-button" 
      onClick={handleBack}
    >
      <IonIcon icon={arrowBack} />
    </IonButton>
  );
};

export default BackButton; 