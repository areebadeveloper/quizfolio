// src/components/Layout.tsx
import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonTabBar, IonTabButton, IonIcon } from '@ionic/react';
import { home, list, helpCircle } from 'ionicons/icons';
import ThemeSelector from './ThemeSelector';
import { useHistory } from 'react-router-dom';
import { IonButton } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import './Layout.css';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

// Replace this with a reference to our enhanced otherlayout
// This will forward all usage of Layout to otherlayout
import OtherLayout from './otherlayout';

const Layout: React.FC<LayoutProps> = (props) => {
  return <OtherLayout {...props} />;
};

export default Layout;
