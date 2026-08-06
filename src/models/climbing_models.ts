import type { SendsByGrade } from './user_models';

export type Session = {
    id: number | undefined;
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

export type SessionClimbBoulder = SessionClimb& Boulder;

export type SessionApiResponse = Session & {
    boulders: SessionClimbBoulder[];
}

export type SessionStatsResponse = {
    total_boulders: number;
    highest_grade_sent: number;
    sends_by_grade: SendsByGrade;
}