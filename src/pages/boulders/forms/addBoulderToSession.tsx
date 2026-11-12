import { useState } from "react";
import { vGradeRange, limitedDisplayString, getFieldError } from "../../../utils/utils";
import { addBoulderToSession } from "../../../api/boulders";

import type { Boulder, SessionClimbOnlyData, SessionClimbBoulder } from "../../../models/climbing_models";
import type { ApiFormErrors } from "../../../api/utils";


export default function AddBoulderToSession(props: { 
    boulder: Boulder; 
    onClose: () => void,
    sessionId: string,
    handleAdd: (sessionBoulder: SessionClimbBoulder) => void
}) {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<ApiFormErrors | undefined>(undefined);
    const [formData, setFormData] = useState<SessionClimbOnlyData>({
        attempts: '',
        percent_finished: '',
        warmup: false
    });

    const NAME_LIMIT = 45;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const failedMessage = "Unable to add boulder to session";

        setSubmitting(true);
        setErrors(undefined);
        try {
            const response = await addBoulderToSession(
                props.sessionId,
                props.boulder.boulder_id,
                formData
            )

            if (response.ok && response.data) {
                props.handleAdd(response.data);
            } else if (!response.ok) {
                const newErrors = response.errors ?? {};
                newErrors.general = [response.error ?? failedMessage];
                setErrors(newErrors);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrors({ general: [err?.message || failedMessage ]});
            } else {
                setErrors({ general: [failedMessage] });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="boulder-modal__summary">
                <p className="boulder-modal__name">
                    <span className="boulder-modal__nickname">
                        {limitedDisplayString(props.boulder.nickname, NAME_LIMIT)}
                    </span>
                    <span className="badge">{vGradeRange(props.boulder)}</span>
                </p>
                <p className="boulder-modal__meta">{props.boulder.boulder_type}</p>
            </div>

            <form className="form-stack" onSubmit={handleAdd}>
                {errors?.general?.[0] && (
                    <p className="field-error" role="alert">{errors.general[0]}</p>
                )}

                <div className="fields-grid">
                    <div className="field">
                        {getFieldError('attempts', errors) && (
                            <p className="field-error">{getFieldError('attempts', errors)}</p>
                        )}
                        <label htmlFor="attempts">Attempts</label>
                        <input
                        id="attempts"
                        type="number"
                        name="attempts"
                        min="0"
                        placeholder="0"
                        value={formData.attempts}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="field">
                        {getFieldError('percent_finished', errors) && (
                            <p className="field-error">{getFieldError('percent_finished', errors)}</p>
                        )}
                        <label htmlFor="percent_finished">Finished</label>
                        <input
                        id="percent_finished"
                        type="number"
                        name="percent_finished"
                        min="0"
                        max="100"
                        placeholder="0"
                        value={formData.percent_finished}
                        onChange={handleChange}
                        />
                    </div>

                    <div className="field field--full">
                        {getFieldError('warmup', errors) && (
                            <p className="field-error">{getFieldError('warmup', errors)}</p>
                        )}
                        <div className="choice-row">
                        <label className="choice">
                            <input
                            type="checkbox"
                            name="warmup"
                            checked={formData.warmup}
                            onChange={handleChange}
                            />
                            Warmup
                        </label>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn" disabled={submitting}>
                        {submitting ? 'Adding...' : 'Add to Session'}
                    </button>
                    <button
                        type="button"
                        className="btn btn--ghost form-actions__close"
                        onClick={props.onClose}
                    >
                        Close
                    </button>
                </div>
            </form>
        </>
    )
}