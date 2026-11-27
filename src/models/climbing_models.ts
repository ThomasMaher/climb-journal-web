import type { SendsByGrade } from './user_models';

export type Session = {
    id: number | undefined;
    date: string;
    gym_name: string;
    notes: string;
    duration?: number;
}

export type SessionClimb = {
    id: string;
    session_id: string;
    boulder_id: number;
    attempts: number;
    percent_finished: number;
    warmup: boolean;
    notes: string;
    date?: string;
}

export type TagModel = {
    id: string;
    tag: string;
    category: string;
}

export type Boulder = {
    boulder_id: string | undefined;
    vgrade_range_min: number;
    vgrade_range_max: number;
    self_grade: number;
    incline: string | null;
    boulder_type: string;
    nickname: string;
    created_by_id: string;
    creator_name: string;
    notes: string;
    tags: TagModel[];
    created_at?: string;
    updated_at?: string;
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
    self_grade: number | null;
    incline: string | null;
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
    self_grade: number | null;
    incline: string | null;
    boulder_type: string;
    nickname: string;
    created_by_id: string;
    boulder_tags_attributes: { tag_id: string }[];
    session_climbs_attributes: 
        Omit<SessionClimb, "id" | "boulder_id" | "created_at" | "updated_at">[];
}


export type BoulderType = "Indoor" | "Outdoor" | "Kilter Board";

export type BoulderSearchType = {
    nickname: string;
    vgrade_range_min: number;
    vgrade_range_max: number;
    boulder_type: BoulderType[];
}

export type SessionClimbOnlyData = {
    attempts: string;
    percent_finished: string;
    warmup: boolean;
}