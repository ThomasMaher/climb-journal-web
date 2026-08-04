import {  fetchApi } from './utils'
import type { SessionClimbFormData } from '../models/climbing_models';

type SessionClimbPayload = Omit<SessionClimbFormData, "attempts" | "percent_finished" | "notes">

export async function submitSessionClimb(boulderData: SessionClimbPayload) {
    return fetchApi(`/boulders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(boulderData),
    })
}

export function createRequestData(formData: SessionClimbFormData, sessionId: string | undefined, userId: number) {
    const { attempts, percent_finished, notes, ...boulderData } = formData
    const session_climb = {
        attempts,
        percent_finished,
        notes,
        session_id: sessionId,
        user_id: userId,
    }

    return {...boulderData, session_climbs_attributes: [session_climb]}
}
