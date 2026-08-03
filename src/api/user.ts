import { API_URL, fetchApi } from './utils';
import type { LoginData } from './models/user_models';

export async function getUserHomeStats(userId: string) {
    return fetchApi(`${API_URL}/home_stats.json`);
}

export async function getUserStatus() {
    return fetchApi(`${API_URL}/user_status.json`);
}

export async function login(formData: LoginData) {
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