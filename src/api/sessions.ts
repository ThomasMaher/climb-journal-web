import { fetchApi } from './utils'
import type { ApiResponse } from './utils'

export async function getSessions() {
    return fetchApi(`/sessions`)
}

export async function getSession(id: string): Promise<ApiResponse<unknown>> {
    if (!id) {
        return {
            ok: false,
            status: 0,
            errors: { message: 'Session id is required' },
        } 
    }

    return fetchApi(`/sessions/${id}`)
}

export async function deleteSession(id: string) {
    if (!id) {
        return {
            ok: false,
            status: 0,
            error: { message: 'Session id is required' },
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
