import type { SessionClimbBoulder } from '../../models/climbing_models';

function SessionClimbList(props: SessionClimbListProps) {
  const climbs = props.sessionClimbs ?? [];

  const vGradeRange = (climb: SessionClimbBoulder) => {
    if (!climb.vgrade_range_max) { return climb.vgrade_range_min }
    if (!climb.vgrade_range_min) { return climb.vgrade_range_max }

    if (climb.vgrade_range_min === climb.vgrade_range_max) {
      return climb.vgrade_range_min
    } else {
      return `${climb.vgrade_range_min} - V${climb.vgrade_range_max}`
    }
  }

  const sent = (climb: SessionClimbBoulder) => climb.percent_finished === 100

  const renderProgressTag = (climb: SessionClimbBoulder) => {
    let tag: string = '';
    if (climb.warmup) {
      tag = 'Warmup';
    } else if (sent(climb)) {
      tag = 'Sent'
    } else {
      tag = `${climb.percent_finished}% complete`
    }

    return <span className="climb-item__warmup">{tag}</span>
  }

  return (
    <section className="section-block">
      <div className="section-block__header">
        <h2>{props.title}</h2>
        <span className="section-block__count">
          {climbs.length} {climbs.length === 1 ? 'climb' : 'climbs'}
        </span>
      </div>

      {climbs.length === 0 ? (
        <div className="empty-state">
          <p>No climbs logged for this session yet.</p>
        </div>
      ) : (
        <ul className="climb-list">
          {climbs.map((climb) => (
            <li key={climb.id} className="climb-item">
              <div className="climb-item__name">{climb.nickname || 'Untitled climb'}</div>
              <div className="climb-item__meta">
                {renderProgressTag(climb)}
                <span className="badge">V{vGradeRange(climb)}</span>
                <p className="climb-item__stat">
                  <strong>{climb.attempts ?? 0}</strong> attempts
                </p>
                 <button 
                  style={{background:'none', border:'none'}}
                  type="button" 
                  aria-label="delete-session-climb" 
                  className="climb-item__delete" 
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
  sessionClimbs: SessionClimbBoulder[];
  title: string;
  handleRemoveClimb: (sessionClimbId: string) => void;
}

export default SessionClimbList;
