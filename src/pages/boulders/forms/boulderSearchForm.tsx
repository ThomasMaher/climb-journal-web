import { useState } from 'react';
import GradeSelect from '../../shared/gradeSelect';
import { submitBoulderSearch, builderSearchQuery } from '../../../api/boulders.ts';

import type { Boulder, BoulderSearchType } from '../../../models/climbing_models';


export default function BoulderSearchForm() {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [boulders, setBoulders] = useState<Boulder[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [formData, setFormData] = useState<BoulderSearchType>({
        nickname: '',
        vgrade_range_min: 1,
        vgrade_range_max: 1,
        boulder_type: 'Indoor',
      });

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
        ];
        const parsedValue =
        type === 'checkbox'
            ? checked
            : numericFields.includes(name)
            ? getNumberVal(value)
            : value;

        setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const failedMessage = 'Unable to get a reesponse';
        setSubmitting(true);

        try {
            const response = await submitBoulderSearch(builderSearchQuery(formData));

            if (response.ok && response.data) {
                setBoulders(response.data);
            } else if (!response.ok) {
                if (response.error) {
                    setError(response.error);
                } else {
                    setError(failedMessage);
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err?.message || failedMessage)
            } else {
                setError(failedMessage);
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <p>Search for an existing boulder to add to your session.</p>

            <form className="form-stack" onSubmit={handleSubmit}>
                <div className="fields-grid">
                    <div className="field field--full">
                        <label htmlFor="nickname">Nickname</label>

                        <input
                            id="nickname"
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="Project name"
                        />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="vgrade_range_min">V grade (min)</label>

                    <GradeSelect
                        id="vgrade_range_min"
                        name="vgrade_range_min"
                        value={formData.vgrade_range_min}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <label htmlFor="vgrade_range_max">V grade (max)</label>

                    <GradeSelect
                        id="vgrade_range_max"
                        name="vgrade_range_max"
                        value={formData.vgrade_range_max}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <span className="field__label">Type</span>

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

                <div className="form-actions">
                    <button type="submit" className="btn" disabled={submitting}>
                        {submitting ? 'Adding…' : 'Add climb'}
                    </button>
                </div>
            </form>
        </>
    )
}