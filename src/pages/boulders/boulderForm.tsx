import { useState } from 'react';
import { submitSessionClimb, createRequestData } from '../../api/boulders';
import type { SessionClimbFormData, SessionClimbBoulder } from '../../models/climbing_models';
import type { ApiFormErrors } from '../../api/utils';

const MAX_VGRADE = 17;
const MAX_INCLINE = 90 / 5;
const MAX_RATING = 10;

function BoulderForm(props: BoulderFormProps) {
  const [formData, setFormData] = useState<SessionClimbFormData>({
    nickname: '',
    vgrade_range_min: 1,
    vgrade_range_max: 1,
    self_grade: undefined,
    notes: '',
    incline: 0,
    rating: 10,
    boulder_type: 'Indoor',
    attempts: 0,
    percent_finished: 0,
    warmup: false,
  });
  const [errors, setErrors] = useState<ApiFormErrors | undefined>(props.errors);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const getFieldError = (field: string) => {
    if (!errors || 'form' in errors) return undefined;

    const fieldErrors = errors[field];
    return Array.isArray(fieldErrors) ? fieldErrors[0] : undefined;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(undefined);
    setSubmitError(undefined);
    setSubmitting(true);

    try {
      const response = await submitSessionClimb(createRequestData(formData, props.sessionId, props.userId));

      if (response.ok && response.data) {
        props.handleBoulderCreated(response.data)
      } else if (!response.ok) {
        if (response.errors) {
          setErrors(response.errors);
        } else {
          setSubmitError(response.error || 'Failed to submit climb');
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err?.message || 'Failed to submit climb');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
    const numericFields = [
      'vgrade_range_min',
      'vgrade_range_max',
      'self_grade',
      'rating',
      'incline',
      'attempts',
      'percent_finished',
    ];
    const parsedValue =
      type === 'checkbox'
        ? checked
        : numericFields.includes(name)
          ? Number(value)
          : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  return (
    <section className="form-panel">
      <h2 className="form-panel__title">Add a climb</h2>
      <p className="form-panel__hint">Brief details to track this boulder.</p>

      <form className="form-stack" onSubmit={handleSubmit}>
        {(submitError || (errors && 'form' in errors)) && (
          <p className="error-banner" role="alert">
            {submitError ?? (errors && 'form' in errors ? errors.form : '')}
          </p>
        )}

        <div className="fields-grid">
          <div className="field field--full">
            <label htmlFor="nickname">Nickname</label>
            {getFieldError('nickname') && (
              <p className="field-error">{getFieldError('nickname')}</p>
            )}
            <input
              id="nickname"
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="Project name or hold color"
            />
          </div>

          <div className="field field--full">
            <span className="field__label">Type</span>
            {getFieldError('boulder_type') && (
              <p className="field-error">{getFieldError('boulder_type')}</p>
            )}
            <div className="choice-row">
              {['Indoor', 'Outdoor', 'Kilter Board'].map((type) => (
                <label key={type} className="choice">
                  <input
                    type="radio"
                    name="boulder_type"
                    value={type}
                    checked={formData.boulder_type === type}
                    onChange={handleChange}
                  />
                  {type === 'Kilter Board' ? 'Kilter' : type}
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="vgrade_range_min">V grade (min)</label>
            {getFieldError('vgrade_range_min') && (
              <p className="field-error">{getFieldError('vgrade_range_min')}</p>
            )}
            <GradeSelect
              id="vgrade_range_min"
              name="vgrade_range_min"
              value={formData.vgrade_range_min}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="vgrade_range_max">V grade (max)</label>
            {getFieldError('vgrade_range_max') && (
              <p className="field-error">{getFieldError('vgrade_range_max')}</p>
            )}
            <GradeSelect
              id="vgrade_range_max"
              name="vgrade_range_max"
              value={formData.vgrade_range_max}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="self_grade">Your grade</label>
            {getFieldError('self_grade') && (
              <p className="field-error">{getFieldError('self_grade')}</p>
            )}
            <GradeSelect
              id="self_grade"
              name="self_grade"
              value={formData.self_grade}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="attempts">Attempts</label>
            <input
              id="attempts"
              type="number"
              name="attempts"
              min={0}
              value={formData.attempts}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="percent_finished">% finished</label>
            <input
              id="percent_finished"
              type="number"
              name="percent_finished"
              min={0}
              max={100}
              value={formData.percent_finished}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="incline">Incline</label>
            {getFieldError('incline') && (
              <p className="field-error">{getFieldError('incline')}</p>
            )}
            <select id="incline" name="incline" value={formData.incline} onChange={handleChange}>
              <option value={0}>0°</option>
              {[...Array(MAX_INCLINE).keys()].map((k) => (
                <option key={k} value={(k + 1) * 5}>
                  {(k + 1) * 5}°
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="rating">Rating</label>
            {getFieldError('rating') && (
              <p className="field-error">{getFieldError('rating')}</p>
            )}
            <select id="rating" name="rating" value={formData.rating} onChange={handleChange}>
              {[...Array(MAX_RATING).keys()].map((k) => (
                <option key={k} value={k + 1}>
                  {k + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="field field--full">
            <label htmlFor="notes">Notes</label>
            {getFieldError('notes') && (
              <p className="field-error">{getFieldError('notes')}</p>
            )}
            <input
              id="notes"
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Beta, crux, conditions…"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Adding…' : 'Add climb'}
          </button>
        </div>
      </form>
    </section>
  );
}

function GradeSelect(props: {
  id: string;
  name: string;
  value: number | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <select id={props.id} name={props.name} onChange={props.onChange} value={props.value ?? ''}>
      <option value="">— Select —</option>
      {[...Array(MAX_VGRADE).keys()].map((k) => (
        <option key={k} value={k + 1}>
          V{k + 1}
        </option>
      ))}
    </select>
  );
}


type BoulderFormProps = {
  sessionId: string | undefined;
  userId: number;
  errors?: ApiFormErrors;
  sessionClimbs?: SessionClimbBoulder[];
  handleBoulderCreated: (newBoulder: SessionClimbBoulder) => void;
};

export default BoulderForm;
