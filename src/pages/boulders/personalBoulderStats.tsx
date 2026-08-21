import { useState, useEffect } from 'react';
import { getUserBoulderData } from '../../api/boulders';
import type { UserBoulderData } from '../../models/user_models';

export default function PersonalBoulderStats(props: {boulderId: string | undefined}) {
    const { boulderId } = props;
    const [boulderData, setBoulderData] = useState<UserBoulderData | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [dataLoading, setDataLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!boulderId) return;

        async function loadUserBoulderData() {
            if (!boulderId) return;

            setBoulderData(undefined);
            setDataLoading(true);
            setError(undefined);

            try {
                const response = await getUserBoulderData(boulderId);

                if (response.ok && response.data) {
                    setBoulderData(response.data);
                } else if (!response.ok) {
                    setError(response.error ?? 'Unable to load data');
                }
            } finally {
                setDataLoading(false);
            }
        }
        
        
        loadUserBoulderData();
    }, [boulderId])

    return (
        <div className="personal-boulder__stats">
            {error && (<h4>{error}</h4>)}
            <table className="home-stats__table">
                <tbody>
                    <tr>
                        <th scope="row">Total sessions on boulder:</th>
                        <td>{dataLoading ? '...' : boulderData?.total_sessions}</td>
                    </tr>
                    <tr>
                        <th scope="row">Total attempts</th>
                        <td>{dataLoading ? '...' : boulderData?.total_attempts}</td>
                    </tr>
                    <tr>
                        <th scope="row">Current progess:</th>
                        <td>{dataLoading ? '...' : boulderData?.current_progress}%</td>
                    </tr>
                    {boulderData?.date_completed && (
                        <>
                            <th scope="row">Date Sent:</th>
                            <td>{dataLoading ? '...' : boulderData?.date_completed}</td>
                        </>
                    )}
                    {!boulderData?.date_completed && (
                        <>
                            <th scope="row">Last Climbed:</th>
                            <td>{dataLoading ? '...' : boulderData?.last_date_climbed}</td>
                        </>
                    )}
                </tbody>
            </table>
        </div>
    )
}