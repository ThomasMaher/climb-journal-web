const API_URL = 'http://localhost:3000'

export async function submitSessionBoulder(boulderData) {
    const response = await fetch(`${API_URL}/boulders`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(boulderData)
    });

    const data = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
}