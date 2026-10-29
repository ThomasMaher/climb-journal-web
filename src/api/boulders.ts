import { fetchApi } from './utils'
import type { 
    SessionClimbFormData, 
    SessionClimbBoulder, 
    SessionClimbPayload,
    SessionClimb,
    Boulder,
    BoulderSearchType,
 } from '../models/climbing_models';
 import type { UserBoulderData } from '../models/user_models';

export async function getBoulder(boulderId: string) {
    return fetchApi<Boulder>(`/boulders/${boulderId}`);
}

export async function getUserBoulderData(boulderId: string) {
    return fetchApi<UserBoulderData>(`/boulders/${boulderId}/user_boulder_data`);
}

export async function getSessionClimbs(boulderId: string | undefined) {
    return fetchApi<SessionClimb[]>(`/boulders/${boulderId}/sessions`);
}

export async function submitBoulderSearch(boulderQuery: string) {
    return fetchApi<Boulder[]>(`/boulders/${boulderQuery}`)
}

export async function updateBoulder(boulderData: Boulder, boulderId: string | undefined) {
    return fetchApi<Boulder>(`/boulders/${boulderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(boulderData),
    })
}

export async function submitSessionClimb(boulderData: SessionClimbPayload) {
    return fetchApi<SessionClimbBoulder>(`/boulders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(boulderData),
    })
}

export function createRequestData(formData: SessionClimbFormData, sessionId: string, userId: string) {
    const { attempts, percent_finished, warmup, notes, ...boulderData } = formData
    const parsed_attempts = attempts || 0
    const parsed_percent_finished = percent_finished || 0
    const session_climb = {
        attempts: parsed_attempts,
        percent_finished: parsed_percent_finished,
        notes,
        warmup,
        session_id: sessionId,
        user_id: userId,
    }

    return {...boulderData, created_by_id: userId, session_climbs_attributes: [session_climb]}
}

export function builderSearchQuery(searchData: BoulderSearchType) {
    const query = new URLSearchParams();

    for (const [param, value] of Object.entries(searchData)) {
        if (Array.isArray(value)) {
            value.forEach((item) => query.append(`${param}[]`, item));
        } else if (value !== '') {
            query.set(param, String(value));
        }
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
}