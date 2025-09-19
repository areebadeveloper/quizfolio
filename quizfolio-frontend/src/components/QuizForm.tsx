import React, { useState, useEffect } from 'react';
import {
  IonButton, IonInput, IonLabel, IonItem, IonSelect, IonSelectOption, IonText,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonGrid, IonRow, IonCol, IonCheckbox
} from '@ionic/react';
import { documentTextOutline, arrowBack } from 'ionicons/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './QuizForm.css';

interface QuizFormProps {
  quiz?: { _id: string; categoryId: string; questions: string[]; totalMarks: number; timeLimit: number };
  onQuizSaved: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ quiz, onQuizSaved }) => {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [questions, setQuestions] = useState<{ _id: string; text: string }[]>([]);
  const [categoryId, setCategoryId] = useState(quiz?.categoryId || '');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(quiz?.questions || []);
  const [totalMarks, setTotalMarks] = useState(quiz?.totalMarks || 100);
  const [timeLimit, setTimeLimit] = useState(quiz?.timeLimit || 30);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [classAssigned, setClassAssigned] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const history = useHistory();

  // Load categories
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setMessage({ type: 'error', text: 'Failed to load categories.' }));
  }, []);

  // Load questions by category
  useEffect(() => {
    const value = String(categoryId ?? '').trim();
    if (value) {
      axios.get(`http://localhost:5000/api/questions/category/${value}`)
        .then((res) => setQuestions(res.data))
        .catch(() => setMessage({ type: 'error', text: 'Failed to load questions for this category.' }));
    } else {
      setQuestions([]);
      setSelectedQuestions([]);
    }
  }, [categoryId]);

  // Auto-clear transient message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const validate = (): boolean => {
    const newErrors: string[] = [];

    // Category must not be empty, spaces only, and must contain letters
    if (!categoryId || String(categoryId).trim() === '' || !/[A-Za-z]/.test(categoryId)) {
      newErrors.push('Category must be selected and contain valid letters.');
    }

    if (totalMarks <= 4) newErrors.push('Total Marks must be greater than 4.');
    if (timeLimit <= 0 || timeLimit > 300) newErrors.push('Time Limit must be between 1 and 300.');
    if (!startDate || !endDate) newErrors.push('Start and End Date are required.');
    else if (new Date(startDate) >= new Date(endDate)) newErrors.push('Start Date must be before End Date.');
    if (!classAssigned) newErrors.push('Class must be selected.');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSaveQuiz = async () => {
    if (!validate()) return;

    try {
      const quizData = {
        categoryId: String(categoryId).trim(),
        questions: selectedQuestions,
        totalMarks,
        timeLimit,
        startDate,
        endDate,
        classAssigned,
      };

      if (quiz?._id) {
        await axios.put(`http://localhost:5000/api/quizzes/${quiz._id}`, quizData);
        setMessage({ type: 'success', text: 'Quiz updated successfully.' });
      } else {
        await axios.post('http://localhost:5000/api/quizzes', quizData);
        setMessage({ type: 'success', text: 'Quiz created successfully.' });
      }

      onQuizSaved();
      history.push('/quizzes');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save quiz. Please try again.' });
    }
  };

  const handleBackToQuizMenu = () => {
    history.push('/quizzes');
  };

  return (
    <div className="quiz-form-container">
      <div className="form-header">
        <h2 className="form-title">{quiz ? 'Edit Quiz' : 'Create New Quiz'}</h2>

        <IonButton
          className="back-to-menu-button"
          fill="clear"
          onClick={handleBackToQuizMenu}
        >
          <IonIcon icon={arrowBack} slot="start" />
          Back to Teacher Menu
        </IonButton>
      </div>

      {message && (
        <div className={`form-message ${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {errors.length > 0 && (
        <div className="form-errors">
          <ul>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <IonCard className="form-card">
        <IonCardHeader>
          <IonCardTitle>Quiz Details</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonItem className="form-item">
                  <IonLabel position="stacked">Category</IonLabel>
                  <IonSelect
                    value={categoryId}
                    onIonChange={(e) => setCategoryId(String(e.detail.value ?? '').trim())}
                    interface="popover"
                    placeholder="Select Category"
                    className="form-select"
                  >
                    <IonSelectOption value="" disabled>
                      Select Category
                    </IonSelectOption>
                    {categories.map((cat) => (
                      <IonSelectOption key={cat._id} value={cat._id}>
                        {cat.name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                {(!categoryId || String(categoryId).trim() === '' || !/[A-Za-z]/.test(categoryId)) && (
                  <IonText color="danger" className="ion-padding-start">
                    Category is required and must contain letters.
                  </IonText>
                )}
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonItem className="form-item">
                  <IonLabel position="stacked">Class Assigned</IonLabel>
                  <IonSelect
                    value={classAssigned}
                    onIonChange={(e) => setClassAssigned(e.detail.value!)}
                    interface="popover"
                    placeholder="Select Class"
                    className="form-select"
                  >
                    {[
                      '1st', '2nd', '3rd', '4th', '5th', '6th',
                      '7th', '8th', '9th', '10th', '11th', '12th',
                    ].map((label, index) => (
                      <IonSelectOption key={index} value={label}>
                        {label}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonItem className="form-item">
                  <IonLabel position="stacked">Total Marks</IonLabel>
                  <IonInput
                    type="number"
                    value={totalMarks}
                    onIonChange={(e) => setTotalMarks(Number(e.detail.value!))}
                    placeholder="Enter total marks"
                    className="form-input"
                  />
                </IonItem>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonItem className="form-item">
                  <IonLabel position="stacked">Time Limit (minutes)</IonLabel>
                  <IonInput
                    type="number"
                    value={timeLimit}
                    onIonChange={(e) => setTimeLimit(Number(e.detail.value!))}
                    placeholder="Enter time limit"
                    className="form-input"
                  />
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonItem className="form-item">
                  <IonLabel position="stacked">Start Date</IonLabel>
                  <IonInput
                    type="datetime-local"
                    value={startDate}
                    onIonChange={(e) => setStartDate(e.detail.value!)}
                    className="form-input"
                  />
                </IonItem>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonItem className="form-item">
                  <IonLabel position="stacked">End Date</IonLabel>
                  <IonInput
                    type="datetime-local"
                    value={endDate}
                    onIonChange={(e) => setEndDate(e.detail.value!)}
                    className="form-input"
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      {questions.length > 0 && (
        <IonCard className="questions-card">
          <IonCardHeader>
            <IonCardTitle>Select Questions</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="questions-list">
              {questions.map((question) => (
                <div key={question._id} className="question-item">
                  <IonCheckbox
                    checked={selectedQuestions.includes(question._id)}
                    onIonChange={() =>
                      setSelectedQuestions((prev) =>
                        prev.includes(question._id)
                          ? prev.filter((id) => id !== question._id)
                          : [...prev, question._id]
                      )
                    }
                  />
                  <span className="question-text">{question.text}</span>
                </div>
              ))}
            </div>
          </IonCardContent>
        </IonCard>
      )}

      <div className="form-actions">
        <IonButton
          expand="block"
          onClick={handleSaveQuiz}
          className="save-button"
        >
          <IonIcon icon={documentTextOutline} slot="start" />
          {quiz ? 'Update Quiz' : 'Create Quiz'}
        </IonButton>

        <IonButton
          expand="block"
          fill="outline"
          onClick={handleBackToQuizMenu}
          className="cancel-button"
        >
          <IonIcon icon={arrowBack} slot="start" />
          Cancel
        </IonButton>
      </div>
    </div>
  );
};

export default QuizForm;
