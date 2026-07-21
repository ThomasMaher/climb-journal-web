import { API_URL, fetchApi } from './utils'

export async function submitSessionBoulder(boulderData: any) {
    return fetchApi(`${API_URL}/boulders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(boulderData),
    })
}

export function createRequestData(formData: any, sessionId: string, userId: number) {
    const { attempts, percent_finished, notes } = formData
    delete formData.attempts
    delete formData.percent_finished
    const session_climb = {
        attempts,
        percent_finished,
        notes,
        session_id: sessionId,
        user_id: userId,
    }

    return {...formData, session_climbs_attributes: [session_climb]}
}
