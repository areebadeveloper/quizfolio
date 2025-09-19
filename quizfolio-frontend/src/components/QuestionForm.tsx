import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonToast,
} from '@ionic/react';
import axios from 'axios';

interface QuestionFormProps {
  onQuestionAdded: () => void;
}

const allowedRe = /^[a-zA-Z0-9\s.,!?'"()\-:;_/&%+]*$/; // common safe characters
const hasLetter = (s: string) => /[A-Za-z]/.test(s);     // must contain A–Z
const collapse = (s: string) => (s ?? '').replace(/\s+/g, ' ').trim();

const QuestionForm: React.FC<QuestionFormProps> = ({ onQuestionAdded }) => {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; color?: string }>({
    show: false,
    message: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/categories')
      .then((res) => setCategories(res.data))
      .catch(() =>
        setToast({ show: true, message: 'Failed to load categories.', color: 'danger' })
      );
  }, []);

  const handleOptionChange = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const validate = (): string => {
    // category
    if (!categoryId || String(categoryId).trim() === '') return 'Please select a category.';

    // question text
    const t = collapse(text);
    if (!t) return 'Question text is required.';
    if (t.length < 10) return 'Question is too short (min 10 characters).';
    if (t.length > 150) return 'Question is too long (max 150 characters).';
    if (!hasLetter(t)) return 'Question must include letters (A–Z), not only symbols.';
    if (!allowedRe.test(t)) return 'Use only normal letters, numbers, spaces, and common punctuation.';

    // options (all four required here; change if you want at least two)
    const collapsed = options.map(collapse);
    if (collapsed.some((o) => !o)) return 'All options must be filled.';
    if (collapsed.some((o) => o.length > 80)) return 'Options must be 80 characters or fewer.';
    if (collapsed.some((o) => !allowedRe.test(o))) return 'Options contain invalid characters.';

    // duplicates (case-insensitive)
    const seen = new Set<string>();
    for (const o of collapsed.map((o) => o.toLowerCase())) {
      if (seen.has(o)) return 'Options must be unique (no duplicates).';
      seen.add(o);
    }

    // correct option chosen and non-empty
    if (correctOption === '') return 'Please select the correct option.';
    const idx = Number(correctOption);
    if (Number.isNaN(idx) || !collapsed[idx]) return 'Correct option cannot be empty.';

    return '';
  };

  const handleSubmit = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      setToast({ show: true, message: errorMsg, color: 'danger' });
      return;
    }

    try {
      const questionData = {
        category: String(categoryId).trim(),       // keep your original API field name
        text: collapse(text),
        options: options.map((option, index) => ({
          optionText: collapse(option),
          isCorrect: index.toString() === correctOption,
        })),
      };

      await axios.post('http://localhost:5000/api/questions', questionData);

      onQuestionAdded(); // refresh questions list
      setToast({ show: true, message: 'Question added successfully!', color: 'success' });

      // reset form
      setText('');
      setOptions(['', '', '', '']);
      setCorrectOption('');
      setCategoryId('');
    } catch (error) {
      console.error('Error creating question', error);
      setToast({ show: true, message: 'Failed to add question. Try again.', color: 'danger' });
    }
  };

  return (
    <div>
      <IonItem>
        <IonLabel position="stacked">Category</IonLabel>
        <IonSelect
          value={categoryId}
          placeholder="Select Category"
          onIonChange={(e) => setCategoryId(String(e.detail.value ?? '').trim())}
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

      <IonItem>
        <IonLabel position="stacked">Question Text</IonLabel>
        <IonInput
          value={text}
          placeholder="e.g., What is 7 + 5?"
          onIonChange={(e) => setText(e.detail.value!)}
        />
      </IonItem>

      {options.map((option, index) => (
        <IonItem key={index}>
          <IonLabel position="stacked">Option {index + 1}</IonLabel>
          <IonInput
            value={option}
            placeholder={`Enter option ${index + 1}`}
            onIonChange={(e) => handleOptionChange(index, e.detail.value!)}
          />
        </IonItem>
      ))}

      <IonItem>
        <IonLabel position="stacked">Correct Option</IonLabel>
        <IonSelect
          value={correctOption}
          placeholder="Pick the correct option"
          onIonChange={(e) => setCorrectOption(e.detail.value!)}
        >
          {options.map((_, index) => (
            <IonSelectOption key={index} value={index.toString()}>
              Option {index + 1}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonButton expand="full" onClick={handleSubmit}>
        Add Question
      </IonButton>

      <IonToast
        isOpen={toast.show}
        message={toast.message}
        color={toast.color}
        duration={2000}
        onDidDismiss={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default QuestionForm;
