import { useRef, useState } from "react";

import { addBoulderPhoto } from "../../../api/boulder_photos";
import type { ApiFormErrors } from '../../../api/utils';

function AddBoulderPhotoForm({ boulderId }: { boulderId: string }) {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<File | null>(null);
    const [caption, setCaption] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<ApiFormErrors | undefined>(undefined);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!image) return;
        setSubmitting(true);
        setErrors(undefined);
        try {
            const response = await addBoulderPhoto(boulderId, image, caption);
    
            if (response.ok) {
                setImage(null);
                setCaption("");
                if (imageInputRef.current) {
                    imageInputRef.current.value = "";
                }
            } else {
                const newErrors = response.errors ?? {};
                newErrors.general = response.error ? [response.error] : [];
                setErrors(newErrors);
            }
        } catch (error) {
            setErrors({ general: ["An unexpected error occurred."] });
        } finally {
            setSubmitting(false);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImage(e.target.files?.[0] ?? null);
    };

    const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCaption(e.target.value);
    };

    return (
        <form className="form-stack boulder-photo-form" onSubmit={handleSubmit}>
            {errors?.general && (
                <p>{errors.general.join(", ")}</p>
            )}
            <div className="field">
                <label htmlFor={`boulder-photo-image-${boulderId}`}>Photo</label>
                
                <input
                    ref={imageInputRef}
                    type="file"
                    id={`boulder-photo-image-${boulderId}`}
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    disabled={submitting}
                    onChange={handleImageChange}
                />
            </div>
            <div className="boulder-photo-form__lower-row">
                <div className="field">
                    <label htmlFor={`boulder-photo-caption-${boulderId}`}>Caption</label>
                    {errors?.caption && (
                        <p>{errors.caption.join(", ")}</p>
                    )}
                    <input
                        type="text"
                        value={caption}
                        onChange={handleCaptionChange}
                        id={`boulder-photo-caption-${boulderId}`}
                        name="caption"
                        maxLength={500}
                    />
                </div>
                <button type="submit" disabled={submitting} className="btn btn--sm">Add Photo</button>
            </div>
        </form>
    );
}

export default AddBoulderPhotoForm;