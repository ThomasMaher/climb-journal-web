import { useState } from 'react';
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from 'recharts';

function HomeStats() {
    const [ loading, setLoading ] = useState<string | undefined>(undefined);

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
                                    <td>{stats.avg_grade_climbed}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Favorite gym</th>
                                    <td>{stats.most_frequent_gym}</td>
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

    const fakeOverallStats = {
        total_sessions: 0,
        highest_grade: 0,
        avg_grade_climbed: 0,
        most_frequent_gym: 'Vital',
        sends_by_grade: [
            { vgrade: "V0", sends: 12 },
            { vgrade: "V1", sends: 18 },
            { vgrade: "V2", sends: 25 },
            { vgrade: "V3", sends: 14 },
            { vgrade: "V4", sends: 7 },
            { vgrade: "V5", sends: 3 },
        ],
    }

    return(
        <>
            {loading ? (
                <p>Loading sessions…</p>
            ) : (
                <div className="home-stats">
                    {renderStats('Overall', fakeOverallStats)}
                    {renderStats('Past 30 days', fakeOverallStats)}
                </div>
            )}
        </>
    )
}

export default HomeStats;