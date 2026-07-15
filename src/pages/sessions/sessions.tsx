import { useEffect, useState } from 'react'
import { getSessions } from "../../api/sessions"
import { Link } from "react-router-dom"

function Sessions() {
  const [sessions, setSessions] = useState<any[]>([])
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function loadSessions() {
      const response = await getSessions()
      if (response.ok && response.data) {
        setSessions(response.data)
      } else {
        setError(response.error ?? 'Unable to load sessions')
      }
    }

    loadSessions()
  }, [])

  return (
    <>
      <h1>Bouldering Sessions</h1>
      {error && <p>{error}</p>}
      {sessions.map((session) => (
        <div key={session.id}>
          <h2>{session.gym_name}</h2>
          <p><Link to={`/sessions/${session.id}`}>{session.date}</Link></p>
        </div>
      ))}
    </>
  )
}

export default Sessions
