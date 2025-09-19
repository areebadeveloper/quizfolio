import React, { useMemo, useState } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonToast,
} from '@ionic/react';
import axios from 'axios';

interface CategoryFormProps {
  onCategoryAdded: () => void;
  /** Pass existing category names for client-side duplicate check (case-insensitive). */
  existingNames?: string[];
}

const collapse = (s: string) => (s ?? '').replace(/\s+/g, ' ').trim();
// Only common characters; require at least one A–Z letter.
const allowedRe = /^[A-Za-z0-9\s&()'’\-_/.,]+$/;

const CategoryForm: React.FC<CategoryFormProps> = ({ onCategoryAdded, existingNames = [] }) => {
  const [name, setName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<{open: boolean; msg: string; color?: 'success'|'danger'}>({open: false, msg: ''});

  const normalizedExisting = useMemo(
    () => new Set(existingNames.map(n => collapse(n).toLocaleLowerCase())),
    [existingNames]
  );

  const validate = (raw: string): string[] => {
    const e: string[] = [];
    const v = collapse(raw);

    if (!v) {
      e.push('Category name is required (not just spaces).');
      return e;
    }
    if (!/[A-Za-z]/.test(v)) e.push('Include at least one letter (A–Z).');
    if (v.length < 2) e.push('Name is too short (min 2 characters).');
    if (v.length > 40) e.push('Name is too long (max 40 characters).');
    if (!allowedRe.test(v)) e.push('Only letters, numbers, spaces, and basic punctuation (&()\'-_/.,) allowed.');
    if (normalizedExisting.has(v.toLocaleLowerCase())) e.push('This category already exists.');
    return e;
  };

  const currentErrors = useMemo(() => validate(name), [name, normalizedExisting]);

  const handleSubmit = async () => {
    const errs = validate(name);
    setErrors(errs);
    if (errs.length) return;

    try {
      setSubmitting(true);
      const payload = { name: collapse(name) };
      await axios.post('http://localhost:5000/api/categories', payload);
      setToast({open: true, msg: 'Category created', color: 'success'});
      setName('');
      onCategoryAdded();
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        (err?.response?.status === 409 ? 'Category already exists.' : 'Failed to create category.');
      setToast({open: true, msg: apiMsg, color: 'danger'});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-3 p-3 border rounded bg-white">
      <IonItem>
        <IonLabel position="stacked">Category Name</IonLabel>
        <IonInput
          value={name}
          placeholder="e.g., Mathematics"
          onIonChange={(e) => setName(String(e.detail.value ?? ''))}
          maxlength={60}
          inputmode="text"
          autocomplete="off"
        />
      </IonItem>

      {/* Inline validation messages */}
      {currentErrors.map((err, i) => (
        <IonText key={i} color="danger">
          <p className="ion-padding-start">{err}</p>
        </IonText>
      ))}

      <IonButton
        className="mt-2"
        onClick={handleSubmit}
        disabled={submitting || currentErrors.length > 0}
      >
        {submitting ? 'Saving…' : 'Save Category'}
      </IonButton>

      <IonToast
        isOpen={toast.open}
        message={toast.msg}
        color={toast.color}
        duration={2000}
        onDidDismiss={() => setToast({open: false, msg: ''})}
      />
    </div>
  );
};

export default CategoryForm;
