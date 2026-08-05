import { fetchApi } from './utils';
import type { UserData, UserStats } from '../models/user_models';

type UserStatsResponse = {overall: UserStats, past_month: UserStats}

export async function getUserHomeStats() {
    return fetchApi<UserStatsResponse>(`/home_stats`);
}

export async function getUserStatus() {
    return fetchApi<UserData>(`/user_status`);
}

export async function login(formData: UserData) {
    const { username, password } = formData;

    return fetchApi(`/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: { username, password_digest: password, },
        }),
    })
}

export async function logout() {
    return fetchApi(`/logout`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export async function register(formData: UserData) {
    const { username, password } = formData;
    return fetchApi(`/users`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: { username, password_digest: password, }
        })
    })
}