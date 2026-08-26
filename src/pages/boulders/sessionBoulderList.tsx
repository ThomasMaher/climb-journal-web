import { Link } from 'react-router-dom';
import type { SessionClimbBoulder, SessionClimb } from '../../models/climbing_models';

function SessionClimbList(props: SessionClimbListProps) {
  const climbs = props.sessionClimbs ?? [];

  const vGradeRange = (climb: SessionClimbBoulder) => {
    if (climb.vgrade_range_min === climb.vgrade_range_max) {
      return climb.vgrade_range_min;
    } else {
      return `${climb.vgrade_range_min} - V${climb.vgrade_range_max}`;
    }
  }

  const sent = (climb: SessionClimbBoulder | SessionClimb) => climb.percent_finished === 100

  const renderProgressTag = (climb: SessionClimbBoulder | SessionClimb) => {
    let tag: string = '';
    if (climb.warmup) {
      tag = 'Warmup';
    } else if (sent(climb)) {
      tag = 'Sent'
    } else if (climb.percent_finished) {
      tag = `${climb.percent_finished}% complete`
    }

    return <span className="climb-item__warmup">{tag}</span>
  }

  const emptyMessage = () => {
    if (props.type === 'boulder') {
      return "No climbs logged for this session yet."
    } else {
      return "No sessions logged for this boulder yet."
    }
  }

  const renderTotal = () => {
    if (props.type === 'boulder') {
      return `${climbs.length} ${climbs.length === 1 ? 'climb' : 'climbs'}`
    } else {
      return `${climbs.length} ${climbs.length === 1 ? 'session' : 'sessions'}`
    }
  }

  const renderName = (climb: SessionClimbBoulder | SessionClimb) => {
    if ('nickname' in climb) {
      return climb.nickname
    } else if ('notes' in climb) {
      return climb.notes;
    }
    return 'Unknown';
  }

  return (
    <section className="section-block">
      <div className="section-block__header">
        <h2>{props.title}</h2>
        <span className="section-block__count">
          {renderTotal()}
        </span>
      </div>

      {climbs.length === 0 ? (
        <div className="empty-state">
          <p>{emptyMessage()}</p>
        </div>
      ) : (
        <ul className="climb-list">
          {climbs.map((climb) => (
            <li className="climb-item">
                <Link key={climb.id} to={`/sessionClimbBoulders/${climb.boulder_id}`}>
                  <div className="climb-item__name" style={{textDecoration: 'underline'}}>
                    {renderName(climb)}
                  </div>
                </Link>
                <div className="climb-item__meta">
                  {renderProgressTag(climb)}
                  {'vgrade_range_max' in climb ? (
                    <span className="badge">V{vGradeRange(climb)}</span>
                  ) : ''}
                  <p className="climb-item__stat">
                    <strong>{climb.attempts ?? 0}</strong> attempts
                  </p>
                  <button 
                    style={{background:'none', border:'none', cursor: 'pointer'}}
                    type="button" 
                    aria-label="delete-session-climb" 
                    className="climb-item__delete"
                    disabled={props.deleting}
                    onClick={() => props.handleRemoveClimb(climb.id)}>
                    🗑️
                  </button>
                </div>
              </li>
          ))}
        </ul>
      )}
    </section>
  );
}

type SessionClimbListProps = {
  sessionClimbs: SessionClimbBoulder[] | SessionClimb[];
  title: string;
  deleting: boolean;
  type: 'boulder' | 'session';
  handleRemoveClimb: (sessionClimbId: string) => void;
}

export default SessionClimbList;
