import { fetchApi } from "./utils";
import type { SessionApiResponse } from "../models/climbing_models";

export async function deleteSessionClimb(sessionClimbId: string) {
    return fetchApi<SessionApiResponse>(`/session_climbs/${sessionClimbId}`, {
        method: 'DELETE'
    })
}