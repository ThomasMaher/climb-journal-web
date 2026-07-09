import { useEffect, useState } from 'react'
import { getSessions } from "../../api/sessions";
import { Link } from "react-router-dom";

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
          <p><Link to={`/sessions/${session.id}`}>{session.date}</Link></p>
        </div>
      ))}
    </>
  )
}

export default Sessions
