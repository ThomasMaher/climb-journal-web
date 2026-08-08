import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSession, deleteSession, getSessionStats } from '../../api/sessions';
import BoulderForm from '../boulders/boulderForm.tsx';
import SessionBoulderList from '../boulders/sessionBoulderList';
import SessionStats from './sessionStats';
import { SESSIONS } from '../home';
import type { Session, SessionClimbBoulder, SessionStatsResponse } from '../../models/climbing_models.ts';
import type { ApiFormErrors } from '../../api/utils';

export default function Session() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [sessionClimbs, setSessionClimbs] = useState<SessionClimbBoulder[]>([]);
  const [sessionWarmups, setSessionWarmups] = useState<SessionClimbBoulder[]>([]);
  const [pageError, setPageError] = useState<string | undefined>(undefined);
  const [formErrors, setFormErrors] = useState<ApiFormErrors | undefined>(undefined);
  const [deleting, setDeleting] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStatsResponse | undefined>(undefined);
  const [statsError, setStatsError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadSession() {
      if (!id) {
        setPageError('Session id is required');
        return;
      }

      const response = await getSession(id);
      if (!response.ok) {
        setPageError(response.error ?? 'Unable to load session' );
        if (response.errors) {
          setFormErrors(response.errors);
        }
        return;
      }

      const sessionData = response.data;
      if (sessionData) {
        setSession((({ id, gym_name, date, notes }) => ({id, gym_name, date, notes}))(sessionData))
        setSessionClimbs(sessionData.not_warmup ?? []);
        setSessionWarmups(sessionData.warmup ?? []);
      }
    }

    async function loadSessionStats() {
      if (!id) {
        setPageError('Session id is required');
        return;
      }

      const response = await getSessionStats(id);
      if (!response.ok) {
        setStatsError(response.error ?? 'Unable to load session stats' );
        return;
      }

      const statsData = response.data;
      if (statsData) {
        setSessionStats(statsData);
      }
    }

    loadSession();
    loadSessionStats();
  }, [id]);

  const handleBoulderCreated = async (newBoulder: SessionClimbBoulder) => {
      setSessionClimbs([...(sessionClimbs ?? []), newBoulder]);

      const response = await getSessionStats(id);
      if (!response.ok) {
        setStatsError(response.error ?? "Unable to load data.")
      } else {
        setSessionStats(response.data);
      }
  }

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
        <Link to="/" state={{ content: SESSIONS }} className="btn btn--ghost">
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
          <div className="session-aside__info">
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
          </div>
          <div className="session-aside__info">
            <SessionStats sessionStats={sessionStats} statsError={statsError} />
          </div>
        </aside>

        <BoulderForm
          sessionId={id}
          userId={1}
          errors={formErrors}
          sessionClimbs={sessionClimbs}
          handleBoulderCreated={handleBoulderCreated}
        />
      </div>


      <SessionBoulderList sessionClimbs={sessionClimbs} title="Climbs" />
      <SessionBoulderList sessionClimbs={sessionWarmups} title="Warmups" />
    </>
  );
}
