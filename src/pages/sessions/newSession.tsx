import { createSession } from '../../api/sessions';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

type NewSessionData = {
  date: string;
  gym_name: string;
  notes: string;
};

type ApiFormErrors = Record<string, string[]> | { form: string };

function NewSession() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewSessionData>({
    date: '',
    gym_name: '',
    notes: '',
  });
  const [errors, setErrors] = useState<ApiFormErrors | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const getFieldError = (field: string) => {
    if (!errors || 'form' in errors) return '';
    const fieldErrors = (errors as Record<string, string[]>)[field];
    return Array.isArray(fieldErrors) ? fieldErrors[0] : '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(undefined);
    setSubmitting(true);

    try {
      const response = await createSession(formData);
      if (response.ok) {
        navigate('/');
      } else {
        setErrors(response.data?.errors || { form: response.error || 'Failed to create session' });
      }
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to create session' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">Sessions</p>
          <h1>New session</h1>
          <p className="page-header__sub">Where and when did you climb?</p>
        </div>
        <Link to="/" className="btn btn--ghost">
          Cancel
        </Link>
      </header>

      <form className="form-panel form-stack" onSubmit={handleSubmit}>
        {errors && 'form' in errors && (
          <p className="error-banner" role="alert">
            {errors.form}
          </p>
        )}

        <div className="field">
          <label htmlFor="gym_name">Gym</label>
          {getFieldError('gym_name') && (
            <p className="field-error">{getFieldError('gym_name')}</p>
          )}
          <input
            id="gym_name"
            type="text"
            value={formData.gym_name}
            onChange={(e) => setFormData({ ...formData, gym_name: e.target.value })}
            placeholder="e.g. Central Rock"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          {getFieldError('date') && <p className="field-error">{getFieldError('date')}</p>}
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="notes">Notes</label>
          {getFieldError('notes') && <p className="field-error">{getFieldError('notes')}</p>}
          <input
            id="notes"
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Optional — conditions, partners, goals"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save session'}
          </button>
        </div>
      </form>
    </>
  );
}

export default NewSession;
