import { fetchApi } from './utils'
import type { ApiResponse, GenericActionResponse } from './utils'
import type { SessionApiResponse } from '../models/climbing_models';

export async function getSessions() {
    return fetchApi(`/sessions`)
}

export async function getSession(id: string): Promise<ApiResponse<SessionApiResponse>> {
    if (!id) {
        return {
            ok: false,
            status: 0,
            error: 'Session id is required',
            errors: undefined,
        } 
    }

    return fetchApi(`/sessions/${id}`)
}

export async function deleteSession(id: string) {
    if (!id) {
        return {
            ok: false,
            status: 0,
            error: 'Session id is required',
            errors: undefined
        }
    }

    return fetchApi(`/sessions/${id}`, {
        method: 'DELETE',
    })
}

export async function createSession(session: {
    date: string,
    gym_name: string,
    notes: string,
}) {
    return fetchApi(`/sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(session),
    })
}
