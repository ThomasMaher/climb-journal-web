import { useState } from "react";
import { submitSessionBoulder } from "../../api/boulders"

const MAX_VGRADE = 17
const MAX_INCLINE = 90/5
const MAX_RATING = 10

type NewBoulderData = {
    nickname: string;
    vgrade_range_min: number;
    vgrade_range_max: number;
    self_grade: number;
    notes: string;
    rating: number;
    incline: number;
    boulder_type: string;
}

function BoulderForm() {
    const [formData, setFormData] = useState<NewBoulderData>({
        nickname: '',
        vgrade_range_min: 1,
        vgrade_range_max: 1,
        self_grade: undefined,
        notes: '',
        incline: 0,
        rating: 10,
        boulder_type: 'indoor',
    });
    const [errors, setErrors] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await submitSessionBoulder(formData);

            if (response.data?.success) {
                console.log('Success!')
            } else {
                setErrors(response.data?.errors);
            }
        } catch (err: any) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        const { name } = e.target;

        const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <div className='newClimbForm'>
            <h3>Add a climb to the session</h3>
            <p>Add information about the boulder or search and select an existing to track your climb on.</p>
            {errors && <p>{errors}</p>}

            <form onSubmit={handleSubmit}>
                <label>Nickname (This can help you keep track of your progress on individual boulder problems)</label>
                <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} />

                <GradeSelect label="V Grade (lower bound)" name="vgrade_range_min" value={formData.vgrade_range_min} onChange={handleChange} />
                <GradeSelect label="V Grade (upper bound)" name="vgrade_range_max" value={formData.vgrade_range_max} onChange={handleChange} />
                <GradeSelect label="Your grade (what you think feels right)" name="self_grade" value={formData.self_grade} onChange={handleChange} />

                <label>Incline</label>
                <select name="incline" value={formData.incline} onChange={handleChange}>
                    <option value={0}>0</option>
                    {[...Array(MAX_INCLINE).keys()].map((k) => (
                        <option key={k} value={(k+1)*5}>{(k+1)*5}</option>
                    ))}
                </select>

                <label>Your Rating</label>
                <select name="rating" value={formData.rating} onChange={handleChange}>
                    {[...Array(MAX_RATING).keys()].map((k) => (
                        <option key={k} value={k+1}>{k+1}</option>
                    ))}
                </select>

                <label>Notes</label>
                <input type="text" name="notes" value={formData.notes} onChange={handleChange} />

                <div className="climbType">
                    <label>
                        <input type="radio" name="boulder_type" value="Indoor" checked={formData.boulder_type === 'Indoor'} onChange={handleChange}/>
                        Indoor
                    </label>
                    <label>
                        <input type="radio" name="boulder_type" value="Outdoor" checked={formData.boulder_type === 'Outdoor'} onChange={handleChange}/>
                        Outdoor
                    </label>
                    <label>
                        <input type="radio" name="boulder_type" value="Kilter Board" checked={formData.boulder_type === 'Kilter Board'} onChange={handleChange}/>
                        Kilter Board
                    </label>
                </div>

                <button type="submit">Enter new climb</button>
            </form>
        </div>
    )
}

function GradeSelect(props) {
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