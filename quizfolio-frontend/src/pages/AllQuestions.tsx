import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonToast,
} from '@ionic/react';
import { addCircleOutline, trashOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import QuestionForm from '../components/QuestionForm';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for styling

const AllQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<
    { _id: string; text: string; options: { optionText: string; isCorrect: boolean }[] }[]
  >([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const history = useHistory();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory]); // dependency is now only `selectedCategory`

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const endpoint = selectedCategory
        ? `http://localhost:5000/api/questions/category/${selectedCategory}`
        : 'http://localhost:5000/api/questions';
      const res = await axios.get(endpoint);
      setQuestions(res.data);
    } catch (error) {
      console.error('Error fetching questions', error);
    }
  };

  const handleQuestionAdded = () => {
    fetchQuestions();
    setShowForm(false);
    setShowToast(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/questions/${id}`);
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Questions</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <IonButton color="secondary" onClick={() => history.push('/teacher')} className="me-2">
            <IonIcon icon={arrowBackOutline} slot="start" /> Back to Teacher Menu
          </IonButton>

          <IonButton color="primary" onClick={() => setShowForm(!showForm)}>
            <IonIcon icon={addCircleOutline} slot="start" /> {showForm ? 'Close Form' : 'Add New Question'}
          </IonButton>
        </div>

        {/* Select Category Dropdown */}
        <IonItem className="mb-3">
          <IonLabel>Filter by Category</IonLabel>
          <IonSelect
            value={selectedCategory}
            onIonChange={(e) => setSelectedCategory(e.detail.value!)}
            placeholder="Select Category"
          >
            <IonSelectOption value="">All Categories</IonSelectOption>
            {categories.map((category) => (
              <IonSelectOption key={category._id} value={category._id}>
                {category.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {showForm && <QuestionForm onQuestionAdded={handleQuestionAdded} />}

        {/* Questions List */}
        <IonList>
          {questions.map((question) => (
            <IonItem key={question._id} className="bg-light border rounded my-2">
              <IonLabel>
                <h5 className="text-dark fw-bold mb-2">{question.text}</h5>
                <ul className="list-unstyled">
                  {question.options.map((option, index) => (
                    <li key={index} className={`fw-bold ${option.isCorrect ? 'text-success' : 'text-danger'}`}>
                      {option.optionText}
                    </li>
                  ))}
                </ul>
              </IonLabel>
              <IonButton color="danger" fill="clear" onClick={() => handleDeleteQuestion(question._id)}>
                <IonIcon icon={trashOutline} slot="icon-only" />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Question added successfully"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default AllQuestions;
