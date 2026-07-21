import { API_URL, fetchApi } from './utils';

export async function getUserHomeStats(userId: string) {
    return fetchApi(`${API_URL}/users/${userId}/home_stats.json`);
}