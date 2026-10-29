import { useState } from 'react';
import GradeSelect from '../../shared/gradeSelect';
import { submitBoulderSearch, builderSearchQuery } from '../../../api/boulders.ts';
import BoulderResults from './BoulderResults/boulderResults';

import type { Boulder, BoulderSearchType } from '../../../models/climbing_models';
import type { ApiFormErrors } from '../../../api/utils.ts';
import type { Dispatch, SetStateAction } from 'react';


export default function BoulderSearchForm(props: {
    boulders: Boulder[], 
    setBoulders: Dispatch<SetStateAction<Boulder[]>>,
    formData: BoulderSearchType,
    setFormData: Dispatch<SetStateAction<BoulderSearchType>>,
}) {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<ApiFormErrors | undefined>(undefined);

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

        props.setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const failedMessage = 'Unable to get a response';
        setSubmitting(true);

        try {
            const response = await submitBoulderSearch(builderSearchQuery(props.formData));

            if (response.ok && response.data) {
                props.setBoulders(response.data);
            } else if (!response.ok) {
                if (response.errors) {
                    setErrors(response.errors);
                } else {
                    setErrors({ general: [failedMessage] });
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrors({ general: [err?.message || failedMessage] })
            } else {
                setErrors({ general: [failedMessage] });
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <p>Search for an existing boulder to add to your session.</p>

            {errors && errors.general && <p>{errors.general[0]}</p>}

            <form className="form-stack" onSubmit={handleSubmit}>
                <div className="fields-grid">
                    <div className="field field--full">
                        <label htmlFor="nickname">Nickname</label>

                        <input
                            id="nickname"
                            type="text"
                            name="nickname"
                            value={props.formData?.nickname}
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
                        value={props.formData?.vgrade_range_min}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <label htmlFor="vgrade_range_max">V grade (max)</label>

                    <GradeSelect
                        id="vgrade_range_max"
                        name="vgrade_range_max"
                        value={props.formData?.vgrade_range_max}
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
                            checked={props.formData?.boulder_type === type}
                            onChange={handleChange}
                        />
                        {type === 'Kilter Board' ? 'Kilter' : type}
                        </label>
                    ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn" disabled={submitting}>
                        {submitting ? 'Searching…' : 'Search climb'}
                    </button>
                </div>
            </form>

            <BoulderResults boulders={props.boulders} />
        </>
    )
}