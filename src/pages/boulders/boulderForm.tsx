import { useEffect, useState } from "react"
import { submitSessionBoulder, createRequestData } from "../../api/boulders"

const MAX_VGRADE = 17
const MAX_INCLINE = 90/5
const MAX_RATING = 10

type NewBoulderData = {
    nickname: string
    vgrade_range_min: number
    vgrade_range_max: number
    self_grade: number
    notes: string
    rating: number
    incline: number
    boulder_type: string
    attempts: number
    percent_finished: number
}

type FieldErrors = Record<string, string[]>
type FormErrors = FieldErrors | { form: string }

type BoulderFormProps = {
    sessionId: string
    errors?: FormErrors
    sessionBoulders?: any[]
    setSessionBoulders: (boulders: any[]) => void
}

function BoulderForm(props: BoulderFormProps) {
    const [formData, setFormData] = useState<NewBoulderData>({
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
    })
    const [errors, setErrors] = useState<FormErrors | undefined>(props.errors)
    const [submitError, setSubmitError] = useState<string | undefined>(undefined)

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    const getFieldError = (field: string) => {
        if (!errors || 'form' in errors) return undefined
        const fieldErrors = errors[field]
        return Array.isArray(fieldErrors) ? fieldErrors[0] : undefined
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors(undefined)
        setSubmitError(undefined)

        try {
            const response = await submitSessionBoulder(createRequestData(formData, props.sessionId))

            if (response.ok && response.data) {
                props.setSessionBoulders([...(props.sessionBoulders ?? []), response.data])
            } else {
                if (response.data?.errors) {
                    setErrors(response.data.errors)
                } else {
                    setSubmitError(response.error || 'Failed to submit climb')
                }
            }
        } catch (err: any) {
            setSubmitError(err?.message || 'Failed to submit climb')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target
        const checked = e.target instanceof HTMLInputElement ? e.target.checked : false
        const numericFields = [
            'vgrade_range_min',
            'vgrade_range_max',
            'self_grade',
            'rating',
            'incline',
            'attempts',
            'percent_finished',
        ]
        const parsedValue = type === "checkbox"
            ? checked
            : numericFields.includes(name)
                ? Number(value)
                : value

        setFormData((prev) => ({
            ...prev,
            [name]: parsedValue,
        }))
    }

    return (
        <div className='newClimbForm'>
            <h3>Add a climb to the session</h3>
            <p>Add information about the boulder or search and select an existing to track your climb on.</p>

            <form onSubmit={handleSubmit}>
                {(submitError || (errors && 'form' in errors)) && (
                    <p>{submitError ?? errors?.form}</p>
                )}

                <label>Nickname (This can help you keep track of your progress on individual boulder problems)</label>
                {getFieldError('nickname') && <p>{getFieldError('nickname')}</p>}
                <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} />

                {getFieldError('vgrade_range_min') && <p>{getFieldError('vgrade_range_min')}</p>}
                <GradeSelect label="V Grade (lower bound)" name="vgrade_range_min" value={formData.vgrade_range_min} onChange={handleChange} />
                {getFieldError('vgrade_range_max') && <p>{getFieldError('vgrade_range_max')}</p>}
                <GradeSelect label="V Grade (upper bound)" name="vgrade_range_max" value={formData.vgrade_range_max} onChange={handleChange} />
                {getFieldError('self_grade') && <p>{getFieldError('self_grade')}</p>}
                <GradeSelect label="Your grade (what you think feels right)" name="self_grade" value={formData.self_grade} onChange={handleChange} />

                <label>Incline</label>
                {getFieldError('incline') && <p>{getFieldError('incline')}</p>}
                <select name="incline" value={formData.incline} onChange={handleChange}>
                    <option value={0}>0</option>
                    {[...Array(MAX_INCLINE).keys()].map((k) => (
                        <option key={k} value={(k+1)*5}>{(k+1)*5}</option>
                    ))}
                </select>

                <label>Your Rating</label>
                {getFieldError('rating') && <p>{getFieldError('rating')}</p>}
                <select name="rating" value={formData.rating} onChange={handleChange}>
                    {[...Array(MAX_RATING).keys()].map((k) => (
                        <option key={k} value={k+1}>{k+1}</option>
                    ))}
                </select>

                <label>Notes</label>
                {getFieldError('notes') && <p>{getFieldError('notes')}</p>}
                <input type="text" name="notes" value={formData.notes} onChange={handleChange} />

                {getFieldError('boulder_type') && <p>{getFieldError('boulder_type')}</p>}
                <div className="climbType">
                    <label>
                        <input type="radio" name="boulder_type" value="Indoor" checked={formData.boulder_type === 'Indoor'} onChange={handleChange} />
                        Indoor
                    </label>
                    <label>
                        <input type="radio" name="boulder_type" value="Outdoor" checked={formData.boulder_type === 'Outdoor'} onChange={handleChange} />
                        Outdoor
                    </label>
                    <label>
                        <input type="radio" name="boulder_type" value="Kilter Board" checked={formData.boulder_type === 'Kilter Board'} onChange={handleChange} />
                        Kilter Board
                    </label>
                </div>

                <label>Attempts</label>
                <input type='number' name="attempts" value={formData.attempts} onChange={handleChange} />
                <label>Percent Finished (your estimate)</label>
                <input type='number' name="percent_finished" value={formData.percent_finished} onChange={handleChange} />
                <br />

                <button type="submit">Enter new climb</button>
            </form>
        </div>
    )
}

function GradeSelect(props: { label: string; name: string; value: number | undefined; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
    return(
        <div>
            <label>{props.label}</label>
            <select name={props.name} onChange={props.onChange} value={props.value}>
                <option value={undefined}>-- Select a grade --</option>
                {[...Array(MAX_VGRADE).keys()].map((k) => (
                    <option key={k} value={k+1}>V{k+1}</option>
                ))}
            </select>
        </div>
    )
}

export default BoulderForm