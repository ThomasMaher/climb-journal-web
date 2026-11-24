import { useState, useEffect, useRef } from 'react';
import { submitSessionClimb, createRequestData } from '../../../api/boulders';
import GradeSelect from '../../shared/gradeSelect';
import { getFieldError } from '../../../utils/utils';
import { getAllTags } from '../../../api/tags';

import type { SessionClimbFormData, SessionClimbBoulder } from '../../../models/climbing_models';
import type { ApiFormErrors } from '../../../api/utils';
import type { TagModel } from '../../../models/climbing_models';

const MAX_INCLINE = 90 / 5;

type NewBoulderFormProps = {
  sessionId: string | undefined;
  userId: string | undefined;
  errors?: ApiFormErrors;
  formData: SessionClimbFormData;
  setFormData: React.Dispatch<React.SetStateAction<SessionClimbFormData>>;
  handleBoulderCreated: (newBoulder: SessionClimbBoulder) => void;
};

function NewBoulderForm(props: NewBoulderFormProps) {
  const [errors, setErrors] = useState<ApiFormErrors | undefined>(props.errors);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [tags, setTags] = useState<TagModel[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagModel[]>([]);
  const [tagSearch, setTagSearch] = useState<string>('');
  const [tagDropdownOpen, setTagDropdownOpen] = useState<boolean>(false);
  const tagPickerRef = useRef<HTMLDivElement>(null);

  const availableTags = tags.filter((tag) =>
    !selectedTags.some((selectedTag) => selectedTag.id === tag.id)
  );
  const filteredTags = availableTags.filter((tag) =>
    `${tag.tag} ${tag.category}`.toLowerCase().includes(tagSearch.trim().toLowerCase())
  );

  const selectTag = (tag: TagModel) => {
    setSelectedTags((currentTags) => [...currentTags, tag]);
    setTagSearch('');
    setTagDropdownOpen(true);
  };

  const removeTag = (tagId: string) => {
    setSelectedTags((currentTags) => currentTags.filter((tag) => tag.id !== tagId));
  };

  useEffect(() => {
    if (!tagDropdownOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !tagPickerRef.current?.contains(event.target)) {
        setTagDropdownOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [tagDropdownOpen]);

  useEffect(() => {
    async function fetchTags() {
      setTags([]);
      try {
        const response = await getAllTags();
        if(response.ok && response.data) {
          setTags(response.data);
        } else {
          console.error('Failed to fetch tags');
        }
      } catch (err) {
        console.error('Failed to fetch tags', err);
      }
    }
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!props.sessionId) {
      setSubmitError("Unable to submit from without session loaded.");  
      return;
    } else if (!props.userId) {
      setSubmitError("User id not found.");  
      return;
    }
    setErrors(undefined);
    setSubmitError(undefined);
    setSubmitting(true);

    try {
      const response = await submitSessionClimb(
        createRequestData(props.formData, selectedTags, props.sessionId, props.userId)
      );

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

  const getNumberVal = (val: string): number | '' => {
    if (val === '') return '';

    try {
      return Number(val);
    } catch {
      return '';
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
    const numericFields = [
      'vgrade_range_min',
      'vgrade_range_max',
      'self_grade',
      'incline',
      'attempts',
      'percent_finished',
    ];
    const parsedValue =
      type === 'checkbox'
        ? checked
        : numericFields.includes(name)
          ? getNumberVal(value)
          : value;

    if (typeof parsedValue === "number") {
      if (name === 'percent_finished' && parsedValue > 100) { return; }
      if (['percent_finished', 'attempts'].includes(name) && parsedValue < 0) { return; }
    }

    props.setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  return (
    <>
      <p className="form-panel__hint">Brief details to track this boulder.</p>

      <form className="form-stack" onSubmit={handleSubmit}>
        {(submitError || (errors && 'form' in errors)) && (
          <p className="error-banner" role="alert">
            {submitError ?? (errors && 'form' in errors ? errors.form : '')}
            {getFieldError('created_by_id', errors) && (
              <p className="field-error">{getFieldError('created_by_id', errors)}</p>
            )}
          </p>
        )}

        <div className="fields-grid">
          <div className="field field--full">
            <label htmlFor="nickname">Nickname</label>
            {getFieldError('nickname', errors) && (
              <p className="field-error">{getFieldError('nickname', errors)}</p>
            )}
            <input
              id="nickname"
              type="text"
              name="nickname"
              value={props.formData?.nickname}
              onChange={handleChange}
              placeholder="Project name or hold color"
            />
          </div>

          <div className="field field--full">
            <span className="field__label">Type</span>
            {getFieldError('boulder_type', errors) && (
              <p className="field-error">{getFieldError('boulder_type', errors)}</p>
            )}
            <div className="choice-row">
              {['Indoor', 'Outdoor', 'Kilter Board'].map((type) => (
                <label key={type} className="choice">
                  <input
                    type="radio"
                    name="boulder_type"
                    value={type}
                    checked={props.formData?.boulder_type === type}
                    onChange={handleChange}
                  />
                  {type === 'Kilter Board' ? 'Kilter' : type}
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="vgrade_range_min">V grade (min)</label>
            {getFieldError('vgrade_range_min', errors) && (
              <p className="field-error">{getFieldError('vgrade_range_min', errors)}</p>
            )}
            <GradeSelect
              id="vgrade_range_min"
              name="vgrade_range_min"
              value={props.formData?.vgrade_range_min}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="vgrade_range_max">V grade (max)</label>
            {getFieldError('vgrade_range_max', errors) && (
              <p className="field-error">{getFieldError('vgrade_range_max', errors)}</p>
            )}
            <GradeSelect
              id="vgrade_range_max"
              name="vgrade_range_max"
              value={props.formData?.vgrade_range_max}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="self_grade">Your grade</label>
            {getFieldError('self_grade', errors) && (
              <p className="field-error">{getFieldError('self_grade', errors)}</p>
            )}
            <GradeSelect
              id="self_grade"
              name="self_grade"
              value={props.formData?.self_grade}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="attempts">Attempts</label>
            <input
              id="attempts"
              type="text"
              name="attempts"
              placeholder='0'
              value={props.formData?.attempts}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="percent_finished">% finished</label>
            <input
              id="percent_finished"
              type="number"
              name="percent_finished"
              placeholder='0'
              value={props.formData?.percent_finished}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="incline">Incline</label>
            {getFieldError('incline', errors) && (
              <p className="field-error">{getFieldError('incline', errors)}</p>
            )}
            <select id="incline" name="incline" value={props.formData?.incline} onChange={handleChange}>
              <option value={0}>0°</option>
              {[...Array(MAX_INCLINE).keys()].map((k) => (
                <option key={k} value={(k + 1) * 5}>
                  {(k + 1) * 5}°
                </option>
              ))}
            </select>
          </div>

          <div className="field field--full">
            {getFieldError('warmup', errors) && (
              <p className="field-error">{getFieldError('warmup', errors)}</p>
            )}
            <div className="new-boulder-form__warmup-tags">
              <div className="choice-row">
                <label key='warmup' className="choice">
                  <input
                    type="checkbox"
                    name="warmup"
                    value="warmup"
                    checked={props.formData?.warmup}
                    onChange={handleChange}
                  />
                  Warmup
                </label>
              </div>

              <div className="field new-boulder-form__tag-field">
                <div className="tag-picker" ref={tagPickerRef}>
                  <div className="tag-picker__control">
                    {selectedTags.map((tag) => (
                      <span className="tag-picker__chip" key={tag.id}>
                        {tag.tag}
                        <button
                          type="button"
                          aria-label={`Remove ${tag.tag}`}
                          onClick={() => removeTag(tag.id)}>
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      id="new-boulder-tags"
                      type="text"
                      role="combobox"
                      aria-label="Tags"
                      aria-autocomplete="list"
                      aria-expanded={tagDropdownOpen}
                      aria-controls="new-boulder-tag-options"
                      autoComplete="off"
                      placeholder={selectedTags.length ? '' : 'Search or select tags'}
                      value={tagSearch}
                      onFocus={() => setTagDropdownOpen(true)}
                      onChange={(event) => {
                        setTagSearch(event.target.value);
                        setTagDropdownOpen(true);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') setTagDropdownOpen(false);
                      }}
                    />
                    <button
                      type="button"
                      className="tag-picker__toggle"
                      aria-label={tagDropdownOpen ? 'Hide tags' : 'Show tags'}
                      onClick={() => setTagDropdownOpen((open) => !open)}>
                      <span aria-hidden="true">▾</span>
                    </button>
                  </div>
                  {tagDropdownOpen && (
                    <div className="tag-picker__options" id="new-boulder-tag-options" role="listbox" aria-label="Available tags">
                      {filteredTags.length > 0 ? filteredTags.map((tag) => (
                        <button
                          type="button"
                          className="tag-picker__option"
                          key={tag.id}
                          role="option"
                          aria-selected="false"
                          onClick={() => selectTag(tag)}>
                          <span>{tag.tag}</span>
                          <span className="tag-picker__category">{tag.category}</span>
                        </button>
                      )) : (
                        <p className="tag-picker__empty">No matching tags</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="field field--full">
            <label htmlFor="notes">Notes</label>
            {getFieldError('notes', errors) && (
              <p className="field-error">{getFieldError('notes', errors)}</p>
            )}
            <input
              id="notes"
              type="text"
              name="notes"
              value={props.formData?.notes}
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
    </>
  );
}

export default NewBoulderForm;
