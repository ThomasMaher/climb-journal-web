import type { SessionClimb } from '../../models/climbing_models';

type sessionClimbListProps = {
  sessionClimbs?: SessionClimb[];
};

function sessionClimbList({ sessionClimbs }: sessionClimbListProps) {
  const climbs = sessionClimbs ?? [];

  const vGradeRange = (climb: SessionClimb) => {
    if (!climb.vgrade_range_max) { return climb.vgrade_range_min }
    if (!climb.vgrade_range_min) { return climb.vgrade_range_max }

    if (climb.vgrade_range_min === climb.vgrade_range_max) {
      return climb.vgrade_range_min
    } else {
      return `${climb.vgrade_range_min} - V${climb.vgrade_range_max}`
    }
  }

  return (
    <section className="section-block">
      <div className="section-block__header">
        <h2>Climbs</h2>
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
              <span className="badge">V{vGradeRange(climb)}</span>
              <p className="climb-item__stat">
                <strong>{climb.attempts ?? 0}</strong> attempts
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default sessionClimbList;
