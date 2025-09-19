import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonProgressBar, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonBadge } from '@ionic/react';
import { checkmarkOutline, arrowBackOutline, arrowForwardOutline, timerOutline, helpOutline, chevronForwardOutline } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import Layout from '../components/otherlayout';
import './OfflineQuizAttempt.css';

// Quiz data by subject
const quizData = {
  math: {
    title: 'Math Quiz',
    questions: [
      {
        question: 'What is 12 × 8?',
        options: ['86', '92', '96', '104'],
        correctAnswer: 2 // Index of '96'
      },
      {
        question: 'Solve for x: 3x + 5 = 20',
        options: ['x = 3', 'x = 5', 'x = 7', 'x = 15/3'],
        correctAnswer: 1 // Index of 'x = 5'
      },
      {
        question: 'What is the area of a circle with radius 4?',
        options: ['8π', '16π', '4π', '12π'],
        correctAnswer: 1 // Index of '16π'
      },
      {
        question: 'If a triangle has sides of length 3, 4, and 5, what type of triangle is it?',
        options: ['Equilateral', 'Isosceles', 'Scalene', 'Right-angled'],
        correctAnswer: 3 // Index of 'Right-angled'
      }
    ]
  },
  science: {
    title: 'Science Quiz',
    questions: [
      {
        question: 'What is the chemical symbol for Gold?',
        options: ['Go', 'Au', 'Gd', 'Ag'],
        correctAnswer: 1 // Index of 'Au'
      },
      {
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
        correctAnswer: 1 // Index of 'Mars'
      },
      {
        question: 'What is the largest organ in the human body?',
        options: ['Heart', 'Liver', 'Skin', 'Lungs'],
        correctAnswer: 2 // Index of 'Skin'
      },
      {
        question: 'Which of these is NOT a state of matter?',
        options: ['Solid', 'Liquid', 'Energy', 'Gas'],
        correctAnswer: 2 // Index of 'Energy'
      }
    ]
  },
  geography: {
    title: 'Geography Quiz',
    questions: [
      {
        question: 'What is the capital of France?',
        options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        correctAnswer: 2 // Index of 'Paris'
      },
      {
        question: 'Which country is known as the Land of the Rising Sun?',
        options: ['China', 'Japan', 'Thailand', 'South Korea'],
        correctAnswer: 1 // Index of 'Japan'
      },
      {
        question: 'Which is the longest river in the world?',
        options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'],
        correctAnswer: 1 // Index of 'Nile'
      },
      {
        question: 'Which of these countries is NOT in Europe?',
        options: ['Portugal', 'Romania', 'Argentina', 'Switzerland'],
        correctAnswer: 2 // Index of 'Argentina'
      }
    ]
  }
};

interface RouteParams {
  subject: string;
}

const OfflineQuizAttempt: React.FC = () => {
  const { subject } = useParams<RouteParams>();
  const history = useHistory();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  // Get quiz for this subject
  const quiz = quizData[subject as keyof typeof quizData];
  
  // If subject doesn't exist, redirect
  useEffect(() => {
    if (!quiz) {
      history.push('/offline-quizzes');
    }
  }, [quiz, history]);

  // Timer effect
  useEffect(() => {
    if (quizComplete) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizComplete]);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    // Calculate score
    let totalCorrect = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        totalCorrect++;
      }
    });
    
    setScore(totalCorrect);
    setQuizComplete(true);
    
    // Save result
    const result = {
      subject: subject,
      title: quiz.title,
      score: totalCorrect,
      totalQuestions: quiz.questions.length,
      date: new Date().toISOString()
    };
    
    // Get existing results or initialize empty array
    const savedResults = localStorage.getItem('offlineQuizResults');
    const results = savedResults ? JSON.parse(savedResults) : [];
    results.push(result);
    localStorage.setItem('offlineQuizResults', JSON.stringify(results));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!quiz) return null;
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <IonPage>
      <Layout title={quiz.title} hideFooter={true}>
        <IonContent className="ion-padding">
          {quizComplete ? (
            <div className="quiz-results">
              <IonCard className="result-card">
                <IonCardHeader>
                  <IonCardTitle>Quiz Complete!</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="score-circle">
                    <div className="score-value">{score}</div>
                    <div className="score-total">/{quiz.questions.length}</div>
                  </div>
                  
                  <div className="score-percent">
                    {Math.round((score / quiz.questions.length) * 100)}%
                  </div>
                  
                  <div className="result-details">
                    <div className="result-row">
                      <div className="result-label">Quiz:</div>
                      <div className="result-value">{quiz.title}</div>
                    </div>
                    <div className="result-row">
                      <div className="result-label">Questions:</div>
                      <div className="result-value">{quiz.questions.length}</div>
                    </div>
                    <div className="result-row">
                      <div className="result-label">Time Used:</div>
                      <div className="result-value">{formatTime(300 - timeRemaining)}</div>
                    </div>
                  </div>
                  
                  <div className="result-buttons">
                    <IonButton expand="block" routerLink="/offline-quizzes">
                      Back to Quizzes
                    </IonButton>
                    <IonButton expand="block" color="medium" routerLink="/student">
                      Go to Dashboard
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          ) : (
            <div className="quiz-container">
              <div className="quiz-header">
                <div className="timer-display">
                  <IonIcon icon={timerOutline} />
                  <IonBadge color={timeRemaining < 60 ? "danger" : "primary"}>
                    {formatTime(timeRemaining)}
                  </IonBadge>
                </div>
                
                <div className="progress-container">
                  <div className="progress-text">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </div>
                  <IonProgressBar value={progress / 100}></IonProgressBar>
                </div>
              </div>
              
              <IonCard className="question-card">
                <IonCardHeader>
                  <div className="question-header">
                    <IonIcon icon={helpOutline} />
                    <IonCardTitle>{currentQuestion.question}</IonCardTitle>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <div className="options-container">
                    {currentQuestion.options.map((option, index) => (
                      <div 
                        key={index}
                        className={`option-item ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                        onClick={() => handleSelectAnswer(index)}
                      >
                        <div className="option-checkbox">
                          {selectedAnswers[currentQuestionIndex] === index && 
                            <IonIcon icon={checkmarkOutline} />
                          }
                        </div>
                        <div className="option-text">{option}</div>
                        <IonIcon icon={chevronForwardOutline} className="option-arrow" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="navigation-buttons">
                    <IonButton 
                      fill="outline"
                      disabled={currentQuestionIndex === 0}
                      onClick={handlePrevious}
                    >
                      <IonIcon slot="start" icon={arrowBackOutline} />
                      Previous
                    </IonButton>
                    
                    <IonButton 
                      onClick={handleNext}
                      disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    >
                      {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
                      <IonIcon slot="end" icon={arrowForwardOutline} />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          )}
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default OfflineQuizAttempt; 