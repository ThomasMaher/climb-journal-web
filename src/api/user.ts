import { API_URL, fetchApi } from './utils';

export async function getUserHomeStats(userId: string) {
    return fetchApi(`${API_URL}/home_stats.json`);
}

export async function getUserStatus() {
    return fetchApi(`${API_URL}/user_status.json`);
}