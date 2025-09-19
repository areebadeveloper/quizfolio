import { Redirect,BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/login';
import About from './pages/about';
import Profile from './pages/profile';
import CreateQuiz from './pages/CreateQuiz';
import AllCategories from './pages/AllCategories';
import AllQuestions from './pages/AllQuestions';
import AllQuizzes from './pages/AllQuizzes';
import QuizHome from './pages/quizhome';
import ClassManagement from './pages/classManagement';
import CreateClass from './pages/CreateClass';
import ClassQuizzes from './pages/AssignedQuizzes'
import QuizComponent from './pages/ScheduleQuiz'
import Quiz from './components/Quiz';
import QuizPage from './pages/QuizPage';
import QuizList from './pages/QuizList';
import QuizAttempt from './components/QuizAttempt';
import AllResults from './pages/Results';
import MyResults from './pages/studentresult';
import NewQuiz from './pages/newQuiz';
import OfflineQuizzes from './pages/OfflineQuizzes';
import OfflineQuizAttempt from './pages/OfflineQuizAttempt';
import OfflineResults from './pages/OfflineResults';
import SendEmail from './pages/SendEmail';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import ClassesWithQuizzes from './pages/AssignQuizzes'
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Teacher from './pages/teacher';
import Student from './pages/student';
import AllUsers from './pages/AllUsers';

setupIonicReact();

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <IonApp>
      {!isOnline && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#f44336',
          color: 'white',
          padding: '8px',
          textAlign: 'center',
          zIndex: 9999
        }}>
          You are offline. Some features may be limited.
        </div>
      )}
      
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route path="/home" component={Home} exact={true} />
                <Route path="/teacher" component={Teacher} exact />
                <Route path="/quizassign" component={ClassManagement} />
                <Route path="/register" component={Register} exact={true} />
                <Route path="/login" component={Login} exact={true} />
                <Route path="/about" component={About} exact={true} />
                <Route path="/teacher" component={Teacher} exact={true} />
                <Route path="/student" component={Student} exact={true} />
                <Route path="/create-class" component={CreateClass} exact />
                <Route path="/profile" component={Profile} exact={true} />
                <Route path="/home" component={Home} exact={true} />
                <Route path="/categories" component={AllCategories} exact={true} />
                <Route path="/questions" component={AllQuestions} exact={true} />
                <Route path="/quizzes" component={AllQuizzes} exact={true} />
                <Route path="/create-quiz" component={CreateQuiz} exact={true} />
                <Route path="/AllUsers" component={AllUsers} exact={true} />
                <Route path="/assigned-quizzes" component={ClassQuizzes} exact />
                <Route path="/listassigned" component={ClassesWithQuizzes} exact />
                <Route path="/send-message" component={QuizComponent} exact />
                <Route path="/takequiz" component={Quiz} exact />
                <Route path="/quizlist" component={QuizList } /> 
                <Route path="/quiz/attempt/:quizId" component={QuizAttempt} /> 
                <Route path="/quiz/category/:categoryId" component={QuizPage} />
                <Route path="/results" component={AllResults} />
                <Route path="/myresults" component={MyResults} />
                <Route path="/newquiz" component={NewQuiz} exact={true} />
                <Route path="/offline-quizzes" component={OfflineQuizzes} exact />
                <Route path="/offline-quiz/:subject" component={OfflineQuizAttempt} exact />
                <Route path="/offline-results" component={OfflineResults} exact />
                <Route path="/send-email" component={SendEmail} exact />

                
                
                {/* //  <Route path="/quiz/:categoryId" component={QuizPage} /> */}


                
                
                <Redirect from="/" to="/home" exact={true} />
              </IonRouterOutlet>
            </IonReactRouter>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </IonApp>
  );
};
export default App;
