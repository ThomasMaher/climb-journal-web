import { fetchApi } from "./utils";
import type { SessionApiResponse, SessionClimbBoulder } from "../models/climbing_models";

export async function deleteSessionClimb(sessionClimbId: string) {
    return fetchApi<SessionApiResponse>(`/session_climbs/${sessionClimbId}`, {
        method: 'DELETE'
    });
}

export async function getSessionClimbBoulder(sessionClimbId: string) {
    return fetchApi<SessionClimbBoulder>(`/session_climbs/${sessionClimbId}`);
}