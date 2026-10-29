import { vGradeRange } from "../../../utils/utils";

import type { Boulder } from "../../../models/climbing_models";
import { useState } from "react";

export default function AddBoulderToSession(props: { boulder: Boulder; onClose: () => void }) {
    const [formData, setFormData] = useState({
        attempts: '',
        percent_finished: '',
        warmup: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const getFieldError = (_field: string) => {
        // Implement your field error logic here
        return '';
    };

    return (
        <>
            <div className="boulder-modal__summary">
                <p className="boulder-modal__name">
                    {props.boulder.nickname}
                    <span className="badge">{vGradeRange(props.boulder)}</span>
                </p>
                <p className="boulder-modal__meta">{props.boulder.boulder_type}</p>
            </div>

            <form className="form-stack">
                <div className="fields-grid">
                    <div className="field">
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
                        {getFieldError('warmup') && (
                        <p className="field-error">{getFieldError('warmup')}</p>
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
                    <button type="submit" className="btn">
                        Add to Session
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