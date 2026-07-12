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

// export async function getSessionClimbs() {
//     const response = await fetch(`${API_URL}/session_climbs`);

//     const data = await response.json();

//     return {
//         ok: response.ok,
//         status: response.status,
//         data,
//     }
// }

export function createRequestData(formData, sessionId) {
    const { attempts, percent_finished, notes } = formData;
    delete formData.attempts
    delete formData.percent_finished
    const session_climb = {
        attempts,
        percent_finished,
        notes,
        session_id: sessionId
    }

    return {...formData, session_climbs_attributes: [session_climb]}
}