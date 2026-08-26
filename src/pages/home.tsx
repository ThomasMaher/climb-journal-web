import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sessions from './sessions/sessions.tsx';
import HomeStats from './homeStats.tsx';

const STATS = 'STATS';
export const SESSIONS = 'SESSIONS';

function Home() {
    const location = useLocation();
    const locationState = location.state as { content?: string } | null | undefined;
    const [content, setContent] = useState<string>(locationState?.content ?? STATS);

    const handleToggle = (newState: 'STATS' | 'SESSIONS') => {
        setContent(newState);
    }

    return(
        <>
            <header className="page-header">
                <div className="page-header__content">
                    <p className="page-header__eyebrow">Logbook</p>
                    <div className="page-header__toggler">
                        <div>
                            <h2 onClick={() => handleToggle(STATS)}>Stats</h2>
                            {content === STATS && <hr />}
                        </div>
                        <div>
                            <h2 onClick={() => handleToggle(SESSIONS)}>Sessions</h2>
                            {content === SESSIONS && <hr />}
                        </div>
                    </div>
                </div>
                <Link to="/newSession" className="page-header__action">
                    Create a session
                </Link>
            </header>

            {content === SESSIONS && <Sessions />}
            {content === STATS && <HomeStats />}
        </>
    )
}

export default Home;