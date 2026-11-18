import { useParams } from 'react-router-dom';
// import { useAuth } from '../../auth/useAuth';
import { useState, useEffect } from 'react';
import { getSessionStats } from '../../../api/sessions';
import type { SessionStatsResponse } from '../../../models/climbing_models';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SendsByGrade } from '../../../models/user_models';

export default function SessionStatsCard() {
    const { id } = useParams<{ id: string }>();
    // const { user } = useAuth();

    const [sessionStats, setSessionStats] = useState<SessionStatsResponse | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchSessionStats() {
            if (!id) return;
            setLoading(true);

            try {
                const response = await getSessionStats(id);
                if (!response.ok) {
                    setError(response.error ?? 'Unable to load stats');
                } else if (response.data) {
                    setSessionStats(response.data);
                }
            } catch (err) {
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        }
        fetchSessionStats();
    }, [id])

    const highestClimbCount = () => {
        if (!sessionStats) return 0;

        return sessionStats.sends_by_grade.reduce((max: number, current: SendsByGrade) => Math.max(max, current.sends), 0);
    } 

    return (
        <div style={{textAlign: 'center'}}>
            <h2>Session Stats</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            {sessionStats && (
                <div>
                    <p>Total Climbs: {sessionStats.total_boulders}</p>
                    <p>Successful Climbs: {sessionStats.highest_grade_sent}</p>

                    <ResponsiveContainer width={250} height={150} >
                        <BarChart data={sessionStats.sends_by_grade}>
                            <XAxis 
                                dataKey="vgrade" 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(grade) => `V${grade}`}
                                tick={{ fontSize: 12 }} />
                            <YAxis 
                                width="auto" 
                                tickLine={false} 
                                axisLine={false} 
                                tick={{ fontSize: 12 }} 
                                allowDecimals={false} 
                                domain={[0, highestClimbCount()]} />
                            <Bar dataKey="sends" fill="#6f9f76" barSize={20} />
                            <Tooltip cursor={false} content={<CustomTooltip />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}


function CustomTooltip({ active, payload }: {active?: boolean, payload?: any}) {
    if (!active || !payload?.length) return null;

    return (
        <div
        style={{
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "6px 10px",
        }}
        >
        {payload[0].value}
        </div>
    );
}