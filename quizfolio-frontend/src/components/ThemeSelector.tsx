import React, { useContext } from 'react';
import { IonButton, IonIcon, IonActionSheet } from '@ionic/react';
import { colorPaletteOutline } from 'ionicons/icons';
import { ThemeContext } from '../contexts/ThemeContext';
import './ThemeSelector.css';
import { useState } from 'react';

const ThemeSelector: React.FC = () => {
  const { setTheme } = useContext(ThemeContext);
  const [showActionSheet, setShowActionSheet] = useState(false);

  return (
    <>
      <IonButton 
        className="theme-button" 
        onClick={() => setShowActionSheet(true)}
      >
        <IonIcon icon={colorPaletteOutline} />
      </IonButton>

      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        header="Select Theme"
        buttons={[
          {
            text: 'Blue (Default)',
            handler: () => {
              setTheme('primary');
            }
          },
          {
            text: 'Emerald Green',
            handler: () => {
              setTheme('emerald');
            }
          },
          {
            text: 'Sunset Orange',
            handler: () => {
              setTheme('sunset');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]}
      />
    </>
  );
};

export default ThemeSelector; 