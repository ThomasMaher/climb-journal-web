import type { Boulder } from "../models/climbing_models";
import type { ApiFormErrors } from '../api/utils';

export const vGradeRange = (boulder: Boulder) => {
    if (boulder.vgrade_range_min === boulder.vgrade_range_max) {
        return `V${boulder.vgrade_range_min}`;
    }

    return `V${boulder.vgrade_range_min}–V${boulder.vgrade_range_max}`;
}

export const limitedDisplayString = (name: string, limit: number) => {
    return name.length > limit ? `${name.slice(0, limit-3)}...` : name;
}



export const getFieldError = (field: string, errors: ApiFormErrors | undefined) => {
    if (!errors || 'form' in errors) return undefined;
    
    const fieldErrors = errors[field];
    return Array.isArray(fieldErrors) ? fieldErrors[0] : undefined;
};