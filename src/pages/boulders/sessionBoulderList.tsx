type SessionBoulder = {
  id: string | number;
  nickname?: string;
  vgrade_range_min?: number;
  attempts?: number;
};

type SessionBoulderListProps = {
  sessionBoulders?: SessionBoulder[];
};

function SessionBoulderList({ sessionBoulders }: SessionBoulderListProps) {
  const climbs = sessionBoulders ?? [];

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
              <span className="badge">V{climb.vgrade_range_min ?? '—'}</span>
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

export default SessionBoulderList;
