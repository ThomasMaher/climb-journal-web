import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vGradeRange } from '../../utils/utils';

import type { SessionClimbBoulder, SessionClimb } from '../../models/climbing_models';

function SessionClimbList(props: SessionClimbListProps) {
  const climbs = props.sessionClimbs ?? [];
  const [expandedClimbIds, setExpandedClimbIds] = useState<Set<string>>(new Set());

  const toggleTags = (climbId: string) => {
    setExpandedClimbIds((expandedIds) => {
      const nextExpandedIds = new Set(expandedIds);
      if (nextExpandedIds.has(climbId)) {
        nextExpandedIds.delete(climbId);
      } else {
        nextExpandedIds.add(climbId);
      }
      return nextExpandedIds;
    });
  };

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
      return climb.nickname;
    } else if ('date' in climb) {
      if (climb.date) return climb.date;
      return `Session: ${climb.id}`;
    }
    return 'Unknown';
  }

  const linkTarget = (climb: SessionClimbBoulder | SessionClimb) => {
    if (props.type === 'boulder') return `/sessionClimbBoulders/${climb.boulder_id}`;
    else return `/sessions/${climb.session_id}`;
  }

  return (
    <section className="section-block">
      <div className="section-block__header">
        <h2>{props.title}</h2>
        <span className="section-block__count">
          {renderTotal()}
        </span>
      </div>

      {props.loading && (<p>Loading...</p>)}

      {climbs.length === 0 ? (
        <div className="empty-state">
          <p>{emptyMessage()}</p>
        </div>
      ) : (
        <ul className="climb-list">
          {climbs.map((climb) => {
            const tags = 'tags' in climb ? climb.tags : [];
            const tagsExpanded = expandedClimbIds.has(climb.id);

            return (
              <li className="climb-item" key={climb.id}>
                <div className="climb-item__main">
                  <Link to={linkTarget(climb)}>
                    <div className="climb-item__name" style={{textDecoration: 'underline'}}>
                      {renderName(climb)}
                    </div>
                  </Link>
                  <div className="climb-item__meta">
                    {tags.length > 0 && (
                      <button
                        type="button"
                        className="climb-item__tags-toggle"
                        aria-expanded={tagsExpanded}
                        onClick={() => toggleTags(climb.id)}>
                        {tagsExpanded ? 'Hide tags' : 'Show tags'}
                      </button>
                    )}
                    {renderProgressTag(climb)}
                    {'vgrade_range_max' in climb ? (
                      <span className="badge">{vGradeRange(climb)}</span>
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
                </div>
                {tagsExpanded && tags.length > 0 && (
                  <div className="climb-item__tags" aria-label="Climb tags">
                    {tags.map((tag) => <span className="badge" key={tag.id}>{tag.tag}</span>)}
                  </div>
                )}
              </li>
            );
          })}
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
  loading: boolean;
  handleRemoveClimb: (sessionClimbId: string) => void;
}

export default SessionClimbList;
