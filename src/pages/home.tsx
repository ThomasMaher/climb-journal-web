import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sessions from './sessions/sessions.tsx';
import HomeStats from './homeStats.tsx';

const STATS = 'STATS';
const SESSIONS = 'SESSIONS';

function Home() {
    const [content, setContent] = useState<string>(STATS);
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const handleToggle = () => {
        const newState = content === STATS ? SESSIONS : STATS;
        setContent(newState);
    }

    return(
        <>
            <header className="page-header">
                <div>
                    <p className="page-header__eyebrow">Logbook</p>
                    <div className="page-header__toggler">
                        <div>
                            <h2 onClick={handleToggle}>Stats</h2>
                            {content === STATS && <hr />}
                        </div>
                        <div>
                            <h2 onClick={handleToggle}>Sessions</h2>
                            {content === SESSIONS && <hr />}
                        </div>
                    </div>
                </div>
            </header>

            {error && <p className="error-banner" role="alert">{error}</p>}

            {content === SESSIONS && <Sessions />}
            {content === STATS && <HomeStats />}
        </>
    )
}

export default Home;