import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserContext } from '../contexts/UserContext';
import './QuizAttempt.css'; // We'll create this file after

interface Option {
  _id: string;
  optionText: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  text: string;
  options: Option[];
}

interface Quiz {
  _id: string;
  title: string;
  categoryId: { name: string };
  questions: Question[];
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  userType: string;
  studentId: string;
  studentClass: string;
}

const QuizAttempt: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeSpent, setTimeSpent] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);

  const { token } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const { quizId } = useParams<{ quizId: string }>();
  const history = useHistory();

  useEffect(() => {
    if (!token) return;

    const fetchQuizAndProfile = async () => {
      try {
        setLoading(true);
        const checkResponse = await axios.get(
          `http://localhost:5000/api/quizResult/check/${quizId}/${user?.studentId}`,
          { headers: { 'x-auth-token': token } }
        );

        if (checkResponse.data.attempted) {
          setAlreadyAttempted(true);
          setLoading(false);
          return;
        }

        const [quizResponse, profileResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/quizzes/${quizId}`, {
            headers: { 'x-auth-token': token },
          }),
          axios.get('http://localhost:5000/api/users/profile', {
            headers: { 'x-auth-token': token },
          }),
        ]);

        setQuiz(quizResponse.data);
        setProfile(profileResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchQuizAndProfile();
  }, [quizId, token, user?.studentId]);

  // Timer effect
  useEffect(() => {
    if (loading || !quiz || submitted || showScore) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto move to next question when time is up
          if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            return 30; // Reset timer
          } else {
            // End quiz if on last question
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
        }
        return prev - 1;
      });
      
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loading, quiz, submitted, showScore, currentQuestionIndex]);

  const handleAnswerOptionClick = (questionId: string, optionId: string) => {
    if (submitted) return;
    
    // Update selected answer
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    // Validate if user has selected an answer
    const currentQuestionId = quiz.questions[currentQuestionIndex]._id;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30); // Reset timer
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateFinalScore = () => {
    if (!quiz) return 0;
    
    let finalScore = 0;
    
    // Loop through all questions and check if the selected answer is correct
    quiz.questions.forEach(question => {
      const selectedOptionId = answers[question._id];
      if (selectedOptionId) {
        const selectedOption = question.options.find(opt => opt._id === selectedOptionId);
        if (selectedOption?.isCorrect) {
          finalScore++;
        }
      }
    });
    
    return finalScore;
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !profile) return;
    
    const confirmSubmit = window.confirm("Are you sure you want to submit the quiz?");
    if (!confirmSubmit) return;

    // Calculate final score
    const finalScore = calculateFinalScore();
    setScore(finalScore);
    setSubmitted(true);
    setShowScore(true);

    try {
      const resultData = {
        studentId: profile.studentId,
        studentName: profile.name,
        studentClass: profile.studentClass,
        email: profile.email,
        quizId,
        score: finalScore,
        timeSpent,
      };

      await axios.post('http://localhost:5000/api/quizResult/submit', resultData, {
        headers: { 'x-auth-token': token },
      });
    } catch (error) {
      console.error('Error submitting quiz result:', error);
    }
  };

  const handleCloseQuiz = () => {
    const confirmClose = window.confirm("Are you sure you want to exit the quiz?");
    if (confirmClose) {
      history.push('/quizlist');
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">Loading quiz...</div>
      </div>
    );
  }

  if (alreadyAttempted) {
    return (
      <div className="quiz-container">
        <div className="already-attempted">
          <h2>You have already attempted this quiz.</h2>
          <button onClick={() => history.push('/quizlist')} className="btn primary">
            Back to Quiz List
          </button>
        </div>
      </div>
    );
  }

  if (!quiz || !profile) {
    return (
      <div className="quiz-container">
        <div className="quiz-error">
          <h2>Quiz not found or error loading quiz.</h2>
          <button onClick={() => history.push('/quizlist')} className="btn primary">
            Back to Quiz List
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOptionId = answers[currentQuestion._id];
  const progressPercent = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-container">
      {showScore ? (
        <div className="score-container">
          <h2>Quiz Complete!</h2>
          <div className="score-details">
            <p className="score">Your Score: <span>{score}</span> / {quiz.questions.length}</p>
            <p className="time-spent">Time Spent: {timeSpent} seconds</p>
          </div>
          
          <div className="user-info">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{profile.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Student ID:</span>
              <span className="value">{profile.studentId}</span>
            </div>
            <div className="info-row">
              <span className="label">Class:</span>
              <span className="value">{profile.studentClass}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{profile.email}</span>
            </div>
          </div>
          
          <button onClick={() => history.push('/quizlist')} className="btn primary">
            Back to Quiz List
          </button>
        </div>
      ) : (
        <div className="active-quiz">
          <div className="quiz-header">
            <h1>{quiz.title || 'Quiz'}</h1>
            <p className="category">Category: {quiz.categoryId?.name || 'General'}</p>
            
            <div className="quiz-progress">
              <div className="progress-info">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span className="timer">Time Left: {timeLeft}s</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="question-card">
            <h2 className="question-text">{currentQuestion.text}</h2>
            
            <div className="options-list">
              {currentQuestion.options.map((option) => (
                <div 
                  key={option._id} 
                  className={`option-item ${selectedOptionId === option._id ? 'selected' : ''}`}
                  onClick={() => handleAnswerOptionClick(currentQuestion._id, option._id)}
                >
                  <div className="checkbox">
                    {selectedOptionId === option._id && <div className="checkbox-inner"></div>}
                  </div>
                  <span className="option-text">{option.optionText}</span>
                </div>
              ))}
            </div>
            
            <div className="navigation-buttons">
              <button 
                onClick={handlePreviousQuestion}
                className="btn secondary"
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              
              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button 
                  onClick={handleSubmitQuiz}
                  className="btn submit"
                >
                  Submit Quiz
                </button>
              ) : (
                <button 
                  onClick={handleNextQuestion}
                  className="btn primary"
                >
                  Next
                </button>
              )}
            </div>
          </div>
          
          <button onClick={handleCloseQuiz} className="btn danger exit-btn">
            Exit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizAttempt;
