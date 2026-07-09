import { createSession } from '../api/sessions';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type NewSessionData = {
    date: string;
    gym_name: string;
    notes: string;
}

function NewSession() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<NewSessionData>({
        date: '',
        gym_name: '',
        notes: '',
    });
    const [errors, setErrors] = useState<any | undefined>(undefined);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await createSession(formData);
            if (response.ok && response.status === 200) {
                navigate('/sessions');
            } else {
                setErrors(response.data?.errors || {form: 'Failed to create session'});
            }
        } catch (err: any) {
            setErrors(err?.message ? {form: err.message} : err);
        }
    };

    return (
        <>
            <h1>New Session</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Gym</label>
                    <p>{!!errors?.gym_name ? errors.gym_name : ''}</p>
                    <input
                        value={formData.gym_name}
                        onChange={(e) => setFormData({...formData, gym_name: e.target.value})}
                    />
                </div>

                <div>
                    <label>Date</label>
                    <p>{!!errors?.date ? errors.date : ''}</p>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                </div>

                <div>
                    <label>Notes</label>
                    <p>{!!errors?.notes ? errors.notes : ''}</p>
                    <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                </div>

                <button type="submit">Save Session</button>
            </form>
        </>
    );
}

export default NewSession;