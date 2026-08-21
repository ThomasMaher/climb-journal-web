import { fetchApi } from './utils'
import type { 
    SessionClimbFormData, 
    SessionClimbBoulder, 
    SessionClimbPayload,
    Boulder,
 } from '../models/climbing_models';
 import type { UserBoulderData } from '../models/user_models';

export async function getBoulder(boulderId: string) {
    return fetchApi<Boulder>(`/boulders/${boulderId}`);
}

export async function getUserBoulderData(boulderId: string) {
    return fetchApi<UserBoulderData>(`/boulders/${boulderId}/user_boulder_data`);
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
    const session_climb = {
        attempts,
        percent_finished,
        notes,
        warmup,
        session_id: sessionId,
        user_id: userId,
    }

    return {...boulderData, created_by_id: userId, session_climbs_attributes: [session_climb]}
}
