import { fetchApi } from './utils'
import type { SessionClimbFormData, SessionClimbBoulder, SessionClimbPayload } from '../models/climbing_models';

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

export function createRequestData(formData: SessionClimbFormData, sessionId: string, userId: number) {
    const { attempts, percent_finished, warmup, notes, ...boulderData } = formData
    const session_climb = {
        attempts,
        percent_finished,
        notes,
        warmup,
        session_id: sessionId,
        user_id: userId,
    }

    return {...boulderData, session_climbs_attributes: [session_climb]}
}
