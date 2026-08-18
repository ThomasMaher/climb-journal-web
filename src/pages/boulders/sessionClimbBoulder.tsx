import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBoulder } from '../../api/boulders';
import GradeSelect from '../shared/gradeSelect';
import BoulderImages from './boulderImages';
import PersonalBoulderStats from './personalBoulderStats';
import type { Boulder } from '../../models/climbing_models';
import type { ApiFormErrors } from '../../api/utils';

function SessionClimbBoulder() {
    const { boulderId } = useParams<{ boulderId: string }>();
    const [boulder, setBoulder] = useState<Boulder | undefined>(undefined);
    const [formData, setFormData] = useState<Boulder>({
        nickname: '',
        boulder_id: '',
        vgrade_range_min: 1,
        vgrade_range_max: 1,
        self_grade: 1,
        incline: 0,
        rating: 0,
        boulder_type: ''
    })

    const [loadingBoulder, setLoadingBoulder] = useState<boolean>(false);
    const [boulderErrors, setBoulderErrors] = useState<ApiFormErrors | undefined>(undefined);
    const [pageError, setPageError] = useState<string | undefined>(undefined);
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (!boulderId) return; 

        setBoulder(undefined);
        setBoulderErrors(undefined);
        setPageError(undefined);

        setLoadingBoulder(true);

        getBoulder(boulderId).then(response => {
            if (!response.ok) {
                setPageError(response.error ?? 'Unable to load climb info');
            } else if (response.data) {
                setBoulder(response.data);
                setFormData(response.data);
            }
        })

        setLoadingBoulder(false);
    }, [boulderId]);

    const userCreatedBoulder = () => {
        return true
    }

    const renderBoulderInfo = () => {
        if (!boulder) return;

        return (
            <>
                <div className="field">
                    <label>Nickname</label>
                    <p>{boulder.nickname}</p>
                </div>

                <div className="field">
                    <label>Type</label>
                    <p>{boulder.boulder_type}</p>
                </div>

                <div className="field">
                    <label>VGrade</label>
                    <p>V{boulder.vgrade_range_min} (min) - V{boulder.vgrade_range_min} (max) - V{boulder.self_grade} (custom grade)</p>
                </div>
            </>
        )
    }

    const getFieldError = (field: string) => {
        if (!boulderErrors) return undefined;

        const fieldErrors = boulderErrors[field];
        return Array.isArray(fieldErrors) ? fieldErrors[0] : undefined;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
        const numericFields = [
        'vgrade_range_min',
        'vgrade_range_max',
        'self_grade',
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

    const renderBoulderForm = () => {
        if (!boulder) return;

        return (
            <>
                <div className="field field--full">
                    <label htmlFor="nicknae">Nickname</label>
                    {getFieldError("nickname") && (
                        <p className="field-error">{getFieldError("nickname")}</p>
                    )}
                    <input
                        id="nickname"
                        type="text"
                        value={formData.nickname}
                        onChange={handleChange} />
                </div>

                <div className="choice-row field--full">
                    {['Indoor', 'Outdoor', 'Kilter Board'].map((type) => (
                        <label key={type} className="choice">
                        {getFieldError("boulder_type") && (
                            <p className="field-error">{getFieldError("boulder_type")}</p>
                        )}
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

                <div className="form-actions">
                    <button type="submit" className="btn" disabled={submitting}>
                        {submitting ? 'Updating…' : 'Update climb'}
                    </button>
                </div>
            </>
        )
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSubmitting(true);
        setSubmitting(false);
    }

    return(
        <div style={{textAlign: 'center'}}>
            <h2>{boulder && !loadingBoulder ? boulder.nickname : ''}</h2>

            {pageError}
            <div className="home-stats__body">
                <BoulderImages />
                <PersonalBoulderStats boulderId={boulderId} />
            </div>
            <form className="form-stack" onSubmit={handleSubmit}>
                <div className="fields-grid">
                    {userCreatedBoulder() ? renderBoulderForm() : renderBoulderInfo()}
                </div>
            </form>
            
        </div>
    )
}

export default SessionClimbBoulder;