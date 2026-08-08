import { fetchApi } from './utils'
import type { ApiResponse, GenericActionResponse } from './utils'
import type { SessionApiResponse, Session, SessionStatsResponse } from '../models/climbing_models';

function idRequiredResponse<T>(): ApiResponse<T> {
    return {
        ok: false,
        status: 0,
        error: 'Session id is required',
        errors: undefined,
    }
}

export async function getSessions() {
    return fetchApi<Session[]>(`/sessions`)
}

export async function getSession(id: string): Promise<ApiResponse<SessionApiResponse>> {
    if (!id) { return idRequiredResponse<SessionApiResponse>() }

    return fetchApi<SessionApiResponse>(`/sessions/${id}`)
}

export async function deleteSession(id: string) {
    if (!id) { return idRequiredResponse<SessionApiResponse>() }

    return fetchApi<GenericActionResponse>(`/sessions/${id}`, {
        method: 'DELETE',
    })
}

export async function createSession(session: {
    date: string,
    gym_name: string,
    notes: string,
}) {
    return fetchApi<Session>(`/sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(session),
    })
}

export async function getSessionStats(session_id: string | undefined) {
    // if (!session_id) { return idRequiredResponse<SessionApiResponse>() }

    return fetchApi<SessionStatsResponse>(`/sessions/${session_id}/session_stats`);
}