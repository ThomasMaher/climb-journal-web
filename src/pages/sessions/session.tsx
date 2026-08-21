import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSession, deleteSession, getSessionStats } from '../../api/sessions';
import { deleteSessionClimb } from '../../api/session_climbs.ts';
import BoulderForm from '../boulders/boulderForm.tsx';
import SessionBoulderList from '../boulders/sessionBoulderList';
import SessionStats from './sessionStats';
import { SESSIONS } from '../home';
import { useAuth } from '../auth/useAuth';
import type { Session, SessionClimbBoulder, SessionStatsResponse } from '../../models/climbing_models.ts';
import type { ApiFormErrors } from '../../api/utils';

export default function Session() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [session, setSession] = useState<Session | undefined>(undefined);
  const [sessionClimbs, setSessionClimbs] = useState<SessionClimbBoulder[]>([]);
  const [sessionWarmups, setSessionWarmups] = useState<SessionClimbBoulder[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStatsResponse | undefined>(undefined);

  const [sessionLoading, setSessionLoading] = useState<boolean>(true);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState(false);

  const [sessionError, setSessionError] = useState<string | undefined>(undefined);
  const [statsError, setStatsError] = useState<string | undefined>(undefined);
  const [sessionClimbError, setSessionClimbError] = useState<string | undefined>(undefined);
  const [formErrors] = useState<ApiFormErrors | undefined>(undefined);

  // set session data
  useEffect(() => {
    let ignore = false;
  
    async function loadSession() {
      if (ignore) return;
  
      // clear prev session data
      setSession(undefined);
      setSessionClimbs([]);
      setSessionWarmups([]);
      setSessionError(undefined);

      setSessionLoading(true);
      
      if (!id) {
        setSessionError('No session available');
        return;
      }

      try {
        const response = await getSession(id);

        if (response.ok && response.data) {
          
          const {id, gym_name, date, notes} = response.data;
          setSession({id, gym_name, date, notes});
          setSessionClimbs(response.data.not_warmup ?? []);
          setSessionWarmups(response.data.warmup ?? []);
        } else if (!response.ok) {
          setSessionError(response.error ?? 'Unable to load session');
        }
      } finally {
        setSessionLoading(false)
      }
    }

    async function loadStats() {
      if (ignore) return;

      setSessionStats(undefined);
      setStatsError(undefined);

      setStatsLoading(true);

      try {
        const response = await getSessionStats(id);

        if (!response.ok) {
          setStatsError(response.error ?? 'Unable to load stats');
        } else if (response.data) {
          setSessionStats(response.data);
        }
      } finally{
        setStatsLoading(false);
      }
    }

    loadSession();
    loadStats();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleBoulderCreated = async (newBoulder: SessionClimbBoulder) => {
      if (newBoulder.warmup) {
        setSessionWarmups(prev => [...prev, newBoulder]);
      } else {
        setSessionClimbs(prev => [...prev, newBoulder]);
      }

      const response = await getSessionStats(id);
      if (!response.ok) {
        setStatsError(response.error ?? "Unable to load data.")
      } else {
        setSessionStats(response.data);
      }
  }

  const handleDelete = async () => {
    if (!id) { return; }

    setDeleting(true);
    try {
      const response = await deleteSession(id);

      if (response.ok) {
        navigate('/');
      } else {
        setSessionError(response.error ?? 'Failed to delete session');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSessionError(err?.message || 'Failed to delete session');
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleRemoveClimb = async (sessionClimbId: string) => {
    setDeleting(true)
    try {
      const response = await deleteSessionClimb(sessionClimbId.toString());

      if (!response.ok) {
        setSessionClimbError(response.error ?? 'Failed to remove climb from session.')
      } else {
        const sessionData = response.data;
        if (sessionData) {
          setSessionClimbs(sessionData.not_warmup ?? []);
          setSessionWarmups(sessionData.warmup ?? []);
        }

        const statsResponse = await getSessionStats(id);
        if(statsResponse.ok && statsResponse.data) {
          setSessionStats(statsResponse.data);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSessionClimbError(err?.message || 'Failed to removev climb from session');
      }
    } finally {
      setDeleting(false);
    }
  }

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

      {sessionError && (
        <p className="error-banner" role="alert">
          {sessionError}
        </p>
      )}

      <div className="session-layout">
        <aside className="session-aside">
          <div className="session-aside__info">
            <div className="session-aside__meta">
              {sessionLoading && <p>Session Loading...</p>}
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
            {statsLoading && <p>Session Stats Loading...</p>}
            {!statsLoading && <SessionStats sessionStats={sessionStats} statsError={statsError} />}
          </div>
        </aside>

        <BoulderForm
          sessionId={id}
          userId={user?.id}
          errors={formErrors}
          sessionClimbs={sessionClimbs}
          handleBoulderCreated={handleBoulderCreated}
        />
      </div>

      {sessionClimbError && <p>{sessionClimbError}</p>}
      <SessionBoulderList sessionClimbs={sessionClimbs} handleRemoveClimb={handleRemoveClimb} title="Climbs" />
      <SessionBoulderList sessionClimbs={sessionWarmups} handleRemoveClimb={handleRemoveClimb} title="Warmups" />
    </>
  );
}
