import { createSession } from '../../api/sessions'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type NewSessionData = {
    date: string
    gym_name: string
    notes: string
}

type ApiFormErrors = Record<string, string[]> | { form: string }

function NewSession() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<NewSessionData>({
        date: '',
        gym_name: '',
        notes: '',
    })
    const [errors, setErrors] = useState<ApiFormErrors | undefined>(undefined)

    const getFieldError = (field: string) => {
        if (!errors) return ''

        const fieldErrors = errors[field]
        return Array.isArray(fieldErrors) ? fieldErrors[0] : ''
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors(undefined)

        try {
            const response = await createSession(formData)
            if (response.ok) {
                navigate('/')
            } else {
                setErrors(response.data?.errors || { form: response.error || 'Failed to create session' })
            }
        } catch (err: any) {
            setErrors({ form: err?.message || 'Failed to create session' })
        }
    }

    return (
        <>
            <h1>New Session</h1>

            <form onSubmit={handleSubmit}>
                {errors && 'form' in errors && <p>{errors.form}</p>}

                <div>
                    <label>Gym</label>
                    <p>{getFieldError('gym_name')}</p>
                    <input
                        value={formData.gym_name}
                        onChange={(e) => setFormData({ ...formData, gym_name: e.target.value })}
                    />
                </div>

                <div>
                    <label>Date</label>
                    <p>{getFieldError('date')}</p>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>

                <div>
                    <label>Notes</label>
                    <p>{getFieldError('notes')}</p>
                    <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                <button type="submit">Save Session</button>
            </form>
        </>
    )
}

export default NewSession;