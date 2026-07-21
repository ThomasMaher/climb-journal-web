import { useState, useEffect } from 'react';
import { getUserHomeStats } from '../api/user';
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from 'recharts';

type UserStats = {
    total_sessions: number;
    highest_grade: number;
    avg_grade_sent: number;
    most_frequented_gym: string;
    sends_by_grade: any[];
};

function HomeStats() {
    const [ loading, setLoading ] = useState<string | undefined>(undefined);
    const [ overallStats, setOverallStats ] = useState<UserStats>({
        total_sessions: 0,
        highest_grade: 0,
        avg_grade_sent: 0,
        most_frequented_gym: '',
        sends_by_grade: [],
    });
    const [ pastMonthStats, setPastMonthStats ] = useState<UserStats>({
        total_sessions: 0,
        highest_grade: 0,
        avg_grade_sent: 0,
        most_frequented_gym: '',
        sends_by_grade: [],
    });

    useEffect(() => {
        async function loadStats() {
            const response = await getUserHomeStats('1');

            if(response.ok) {
                setOverallStats(response.data.overall)
                setPastMonthStats(response.data.past_month)
            }
        }

        loadStats();
    }, [])

    function CustomTooltip({ active, payload }: any) {
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

    const renderStats = (title, stats) => {
        return (
            <div className="home-stats__card">
                <h2>{title}</h2>

                <div className="home-stats__body">
                    <div>
                        <table className="home-stats__table">
                            <tbody>
                                <tr>
                                    <th scope="row">Total sessions</th>
                                    <td>{stats.total_sessions}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Highest grade</th>
                                    <td>{stats.highest_grade}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Avg grade climbed</th>
                                    <td>{stats.avg_grade_sent}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Favorite gym</th>
                                    <td>{stats.most_frequented_gym}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <ResponsiveContainer width={250} height={150} >
                            <BarChart
                                data={stats.sends_by_grade}
                            >
                                <XAxis dataKey="vgrade" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                <YAxis width="auto" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                <Bar dataKey="sends" fill="#6f9f76" barSize={20} />
                                <Tooltip cursor={false} content={<CustomTooltip />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <>
            {loading ? (
                <p>Loading sessions…</p>
            ) : (
                <div className="home-stats">
                    {renderStats('Overall', overallStats)}
                    {renderStats('Past 30 days', pastMonthStats)}
                </div>
            )}
        </>
    )
}

export default HomeStats;