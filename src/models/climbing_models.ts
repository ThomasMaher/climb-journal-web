import type { SendsByGrade } from './user_models';

export type Session = {
    id: number | undefined;
    date: string;
    gym_name: string;
    notes: string;
}

export type SessionClimb = {
    id: string;
    session_id: string;
    boulder_id: number;
    attempts: number;
    percent_finished: number;
    warmup: boolean;
    notes: string;
}

export type Boulder = {
    boulder_id: string;
    vgrade_range_min: number;
    vgrade_range_max: number;
    self_grade: number;
    incline: number;
    rating: number;
    boulder_type: string;
    nickname: string;
    created_at: string;
    updated_at: string;
}

export type SessionClimbBoulder = SessionClimb & Boulder;

export type SessionApiResponse = Session & {
    warmup: SessionClimbBoulder[];
    not_warmup: SessionClimbBoulder[];
}

export type SessionStatsResponse = {
    total_boulders: number;
    highest_grade_sent: number;
    sends_by_grade: SendsByGrade[];
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

export type SessionClimbPayload = {
    vgrade_range_min: number;
    vgrade_range_max: number;
    self_grade: number | undefined;
    incline: number | undefined;
    rating: number | undefined;
    boulder_type: string;
    nickname: string;
    session_climbs_attributes: 
        Omit<SessionClimb, "id" | "boulder_id" | "created_at" | "updated_at">[];
}