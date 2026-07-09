const API_URL = 'http://localhost:3000'

export async function getSessions() {
    const response = await fetch(`${API_URL}/sessions`);
    return response.json();
}

export async function getSession(id: string) {
    const response = await fetch(`${API_URL}/sessions/${id}`);
    return response.json();
}

export async function deleteSession(id: string) {
    const response = await fetch(`${API_URL}/sessions/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

export async function createSession(session: {
    date: string,
    gym_name: string,
    notes: string,
}) {
    const response = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(session)
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
}