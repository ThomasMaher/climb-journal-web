import { fetchApi } from './utils';
import type { LoginData } from '../models/user_models';

export async function getUserHomeStats() {
    return fetchApi(`/home_stats.json`);
}

export async function getUserStatus() {
    return fetchApi(`/user_status.json`);
}

export async function login(formData: LoginData) {
    const { username, password } = formData;

    return fetchApi(`/login.json`, {
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