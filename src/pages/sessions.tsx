import { useEffect, useState } from 'react'
import { getSessions } from "../api/sessions";

function Sessions() {
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    getSessions().then(setSessions);
  }, [])

  return (
    <>
      <h1>Bouldering Sessions</h1>
  
      {sessions.map((session) => (
        <div key={session.id}>
          <h2>{session.gym_name}</h2>
          <p>{session.date}</p>
        </div>
      ))}
    </>
  )
}

export default Sessions
