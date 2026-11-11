import type { Boulder } from "../models/climbing_models";


export const vGradeRange = (boulder: Boulder) => {
    if (boulder.vgrade_range_min === boulder.vgrade_range_max) {
        return `V${boulder.vgrade_range_min}`;
    }

    return `V${boulder.vgrade_range_min}–V${boulder.vgrade_range_max}`;
}

export const limitedDisplayString = (name: string, limit: number) => {
    return name.length > limit ? `${name.slice(0, limit-3)}...` : name;
}