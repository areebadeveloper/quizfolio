import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel, IonButtons, IonButton } from '@ionic/react';
import { homeOutline, personAddOutline, logInOutline, informationCircleOutline, personCircleOutline, arrowBack, peopleOutline, helpCircleOutline, documentTextOutline, statsChartOutline, logOutOutline } from 'ionicons/icons';
import { useLocation, useHistory } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';
import './Layout.css';  

// Inline back button component
const BackButton = () => {
  const history = useHistory();
  return (
    <IonButton 
      className="back-button" 
      onClick={() => history.goBack()}
    >
      <IonIcon icon={arrowBack} />
    </IonButton>
  );
};

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ title, children, showBackButton = true, hideFooter = false }) => {
  const location = useLocation();
  const history = useHistory();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const isHomePage = location.pathname === '/home';
  const currentPath = location.pathname;
  
  // Check if this is a dashboard page
  const isTeacherDashboard = currentPath === '/teacher';
  const isStudentDashboard = currentPath === '/student';
  const isDashboard = isTeacherDashboard || isStudentDashboard;
  
  // Hide footer on dashboards or when explicitly requested
  const shouldHideFooter = hideFooter || isDashboard;
  
  // Determine which tab menu to show based on the user's auth status and current page
  const showAuthTabs = !isLoggedIn;
  const showTeacherTabs = isLoggedIn && (
    currentPath.includes('/teacher') || 
    currentPath.includes('/quizzes') || 
    currentPath.includes('/create-quiz') ||
    currentPath.includes('/quizassign') ||
    currentPath.includes('/categories') ||
    currentPath.includes('/questions') ||
    currentPath.includes('/allUsers') ||
    currentPath.includes('/results')
  );
  
  const showStudentTabs = isLoggedIn && (
    currentPath.includes('/student') || 
    currentPath.includes('/quizlist') || 
    currentPath.includes('/assigned-quizzes') ||
    currentPath.includes('/myresults')
  );

  const handleLogout = () => {
    logout();
    history.push('/home');
  };

  return (
    <>
      <IonHeader>
        <IonToolbar className="header-toolbar">
          <div className="header-left-section">
            {showBackButton && (
              <BackButton />
            )}
          </div>
          
          <div className="logo-title-container">
            <img 
              src="/assets/img/quizfolio.png" 
              alt="Logo" 
              className="header-logo" 
              onClick={() => history.push('/home')} 
              style={{ cursor: 'pointer' }}
            />
            <IonTitle className="header-title">{title}</IonTitle>
          </div>
          
          <div className="header-right-section">
            {isLoggedIn && !isDashboard && (
              <IonButton onClick={handleLogout} className="profile-button">
                <IonIcon icon={personCircleOutline} />
              </IonButton>
            )}
          </div>
          
          <div className="theme-selector-container">
            <ThemeSelector />
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">{children}</IonContent>
      {!shouldHideFooter && (
        <IonFooter>
          {showAuthTabs && (
            <IonTabBar selectedTab={location.pathname} className="footer-tabbar">
              <IonTabButton tab="home" href="/home" className="footer-tabbutton">
                <IonIcon icon={homeOutline} className="footer-icon" />
                <IonLabel className="footer-label">Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="register" href="/register" className="footer-tabbutton">
                <IonIcon icon={personAddOutline} className="footer-icon" />
                <IonLabel className="footer-label">Register</IonLabel>
              </IonTabButton>
              <IonTabButton tab="login" href="/login" className="footer-tabbutton">
                <IonIcon icon={logInOutline} className="footer-icon" />
                <IonLabel className="footer-label">Login</IonLabel>
              </IonTabButton>
              <IonTabButton tab="about" href="/about" className="footer-tabbutton">
                <IonIcon icon={informationCircleOutline} className="footer-icon" />
                <IonLabel className="footer-label">About</IonLabel>
              </IonTabButton>
            </IonTabBar>
          )}
          
          {showTeacherTabs && !isDashboard && (
            <IonTabBar selectedTab={location.pathname} className="footer-tabbar">
              <IonTabButton tab="teacher" href="/teacher" className="footer-tabbutton">
                <IonIcon icon={homeOutline} className="footer-icon" />
                <IonLabel className="footer-label">Dashboard</IonLabel>
              </IonTabButton>
              <IonTabButton tab="quizzes" href="/quizzes" className="footer-tabbutton">
                <IonIcon icon={documentTextOutline} className="footer-icon" />
                <IonLabel className="footer-label">Quizzes</IonLabel>
              </IonTabButton>
              <IonTabButton tab="classes" href="/quizassign" className="footer-tabbutton">
                <IonIcon icon={peopleOutline} className="footer-icon" />
                <IonLabel className="footer-label">Classes</IonLabel>
              </IonTabButton>
              <IonTabButton tab="results" href="/results" className="footer-tabbutton">
                <IonIcon icon={statsChartOutline} className="footer-icon" />
                <IonLabel className="footer-label">Results</IonLabel>
              </IonTabButton>
            </IonTabBar>
          )}
          
          {showStudentTabs && !isDashboard && (
            <IonTabBar selectedTab={location.pathname} className="footer-tabbar">
              <IonTabButton tab="student" href="/student" className="footer-tabbutton">
                <IonIcon icon={homeOutline} className="footer-icon" />
                <IonLabel className="footer-label">Dashboard</IonLabel>
              </IonTabButton>
              <IonTabButton tab="quizlist" href="/quizlist" className="footer-tabbutton">
                <IonIcon icon={documentTextOutline} className="footer-icon" />
                <IonLabel className="footer-label">Quizzes</IonLabel>
              </IonTabButton>
              <IonTabButton tab="myresults" href="/myresults" className="footer-tabbutton">
                <IonIcon icon={statsChartOutline} className="footer-icon" />
                <IonLabel className="footer-label">Results</IonLabel>
              </IonTabButton>
            </IonTabBar>
          )}
        </IonFooter>
      )}
    </>
  );
};

export default Layout;
