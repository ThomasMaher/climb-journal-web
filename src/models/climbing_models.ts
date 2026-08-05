export type Session = {
    id: number;
    date: string;
    gym_name: string;
    notes: string;
}

export type SessionClimb = {
    id: number;
    session_id: number;
    boulder_id: number;
    user_id: number;
    attempts: number;
    percent_finished: number;
    warmup: boolean;
    notes: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export type Boulder = {
    id: number;
    vgrade_range_min: number;
    vgrade_range_max: number;
    self_grade: number;
    incline: number;
    rating: number;
    notes: string;
    boulder_type: string;
    nickname: string;
    created_at: string;
    updated_at: string;
}

export type SessionClimbFormData = {
    vgrade_range_min: number;
    vgrade_range_max: number;
    self_grade: number | undefined;
    incline: number | undefined;
    rating: number | undefined;
    notes: string;
    boulder_type: string;
    nickname: string;
    attempts: number;
    percent_finished: number;
    warmup: boolean;
}

export type SessionClimbBoulder = {
    id: number;
    vgrade_range_min: number;
    vgrade_range_max: number;
    self_grade: number;
    incline: number;
    rating: number;
    boulder_type: string;
    nickname: string;
    session_id: number;
    boulder_id: number;
    user_id: number;
    attempts: number;
    percent_finished: number;
    warmup: boolean;
    notes: string;
    created_at: string;
    updated_at: string;
}

export type SessionApiResponse = {
    session: Session;
    boulders: SessionClimbBoulder[];
}