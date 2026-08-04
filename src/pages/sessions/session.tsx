import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSession, deleteSession } from '../../api/sessions';
import BoulderForm from '../boulders/boulderForm.tsx';
import SessionBoulderList from '../boulders/sessionBoulderList';
import type { Session, SessionClimb } from '../../models/climbing_models.ts';

type ApiFormErrors = Record<string, string[]> | { form: string };

export default function Session() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [sessionClimbs, setSessionClimbs] = useState<SessionClimb[]>([]);
  const [pageError, setPageError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<ApiFormErrors | undefined>(undefined);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadSession() {
      if (!id) {
        setPageError('Session id is required');
        return;
      }

      const response = await getSession(id);
      if (!response.ok) {
        setPageError(response.errors ?? 'Unable to load session');
        if (response.data?.errors) {
          setFormErrors(response.data.errors);
        }
        return;
      }

      const sessionData = response.data;
      if (sessionData?.errors) {
        setFormErrors(sessionData.errors);
        return;
      }

      setSession((({ id, date, gym_name, notes }) => ({ id, date, gym_name, notes }))(sessionData));
      setSessionClimbs(sessionData?.boulders ?? []);
    }

    loadSession();
  }, [id]);

  const handleDelete = async () => {
    setPageError('');

    if (!id) {
      setPageError('Session id is required');
      return;
    }

    if (!window.confirm('Delete this session and its climbs?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await deleteSession(id);

      if (response.ok) {
        navigate('/');
      } else {
        setPageError(response.error ?? 'Failed to delete session');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPageError(err?.message || 'Failed to delete session');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Session</h1>
        </div>
        <Link to="/" className="btn btn--ghost">
          All sessions
        </Link>
      </header>

      {pageError && (
        <p className="error-banner" role="alert">
          {pageError}
        </p>
      )}

      <div className="session-layout">
        <aside className="session-aside">
          <div className="session-aside__meta">
            <span className="session-aside__label">Gym</span>
            <p className="session-aside__gym">{session?.gym_name ?? '—'}</p>
            {session?.date && (
              <time className="session-aside__date" dateTime={session.date}>
                {session.date}
              </time>
            )}
          </div>
          {session?.notes ? <p className="session-aside__notes">{session.notes}</p> : null}
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete session'}
          </button>
        </aside>

        <BoulderForm
          sessionId={id}
          userId={1}
          errors={formErrors}
          sessionClimbs={sessionClimbs}
          setSessionClimbs={setSessionClimbs}
        />
      </div>

      <SessionBoulderList sessionClimbs={sessionClimbs} />
    </>
  );
}
