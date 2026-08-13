import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionClimbBoulder } from '../../api/session_climbs';
import type { SessionClimb, Boulder } from '../../models/climbing_models';

function SessionClimbBoulder() {
    const { sessionClimbId } = useParams<{ sessionClimbId: string }>();
    const [sessionClimb, setSessionClimb] = useState<SessionClimb | undefined>(undefined);
    const [boulder, setBoulder] = useState<Boulder | undefined>(undefined);

    const [loadingSession, setLoadingSession] = useState<boolean>(false);
    const [loadingBoulder, setLoadingBoulder] = useState<boolean>(false);
    const [sessionClimbError, setSessionClimbError] = useState<string | undefined>(undefined);
    const [boulderError, setBoulderError] = useState<string | undefined>(undefined);
    const [pageError, setPageError] = useState<string | undefined>(undefined);

    useEffect(() => {
        console.log(sessionClimbId);
        if (!sessionClimbId) return; 

        setSessionClimb(undefined);
        setBoulder(undefined);
        setSessionClimbError(undefined);
        setBoulderError(undefined);
        setPageError(undefined);

        setLoadingSession(true);
        setLoadingBoulder(true);

        getSessionClimbBoulder(sessionClimbId).then(response => {
            if (!response.ok) {
                setPageError(response.error ?? 'Unable to load climb info');
            } else if (response.data) {
                const { 
                    id, 
                    session_id,
                    attempts, 
                    percent_finished, 
                    warmup, 
                    notes, 
                    ...boulderData 
                } = response.data;
                setSessionClimb({ 
                    id, session_id, boulder_id: boulderData.boulder_id, attempts, percent_finished, warmup, notes 
                });
                setBoulder(boulderData);
            }
        })

        setLoadingSession(false);
        setLoadingBoulder(false);
    }, [sessionClimbId])

    return(
        <div style={{textAlign: 'center'}}>
            <h2>{boulder && !loadingBoulder ? boulder.nickname : ''}</h2>

        {sessionClimb ? <p>Session Climb</p> : ''}
        {loadingSession}
        {sessionClimbError}
        {boulderError}
        {pageError}
            <div className="session-boulder__pictureblock">
                <p style={{marginTop: '20px'}}>(Photo uploads coming soon...)</p>
            </div>
            
        </div>
    )
}

export default SessionClimbBoulder;