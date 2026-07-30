import { useEffect, useState } from 'react';
import { getSessions } from '../../api/sessions';
import { Link } from 'react-router-dom';
import type { Session } from '../../models/climbing_models';

function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadSessions() {
      const response = await getSessions();
      if (response.ok && response.data) {
        setSessions(response.data);
      } else {
        setError(response.error ?? 'Unable to load sessions');
      }
      setLoading(false);
    }

    loadSessions();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading sessions…</p>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <p>No sessions yet. Start your first log entry.</p>
          <Link to="/newSession" className="btn">
            Create session
          </Link>
        </div>
      ) :
        error ? (
          <p>An error occurred: {error}</p>
        ) : (
          <ul className="session-list">
            {sessions.map((session) => (
              <li key={session.id} className="session-list__item">
                <Link to={`/sessions/${session.id}`} className="session-list__link">
                  <div>
                    <div className="session-list__gym">{session.gym_name}</div>
                    {session.notes ? (
                      <p className="session-list__meta">{session.notes}</p>
                    ) : null}
                  </div>
                  <time className="session-list__date" dateTime={session.date}>
                    {session.date}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
      )}
    </>
  );
}

export default Sessions;
