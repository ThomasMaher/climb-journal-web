import { API_URL, fetchApi } from './utils'
import type { ApiResponse } from './utils'

export async function getSessions() {
    return fetchApi(`${API_URL}/sessions`)
}

export async function getSession(id: string) {
    if (!id) {
        return {
            ok: false,
            status: 0,
            data: null,
            error: 'Session id is required',
        } as ApiResponse<any>
    }

    return fetchApi(`${API_URL}/sessions/${id}`)
}

export async function deleteSession(id: string) {
    if (!id) {
        return {
            ok: false,
            status: 0,
            data: null,
            error: 'Session id is required',
        } as ApiResponse<any>
    }

    return fetchApi(`${API_URL}/sessions/${id}`, {
        method: 'DELETE',
    })
}

export async function createSession(session: {
    date: string,
    gym_name: string,
    notes: string,
}) {
    return fetchApi(`${API_URL}/sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(session),
    })
}
