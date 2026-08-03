import { API_URL, fetchApi } from './utils';
import type { UserData } from './models/user_models';

export async function getUserHomeStats() {
    return fetchApi(`${API_URL}/home_stats.json`);
}

export async function getUserStatus() {
    return fetchApi(`${API_URL}/user_status.json`);
}

export async function login(formData: UserData) {
    const { username, password } = formData;

    return fetchApi(`${API_URL}/login.json`, {
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
    return fetchApi(`${API_URL}/logout`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export async function register(formData: UserData) {
    const { username, password } = formData;
    return fetchApi(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: { username, password_digest: password, }
        })
    })
}