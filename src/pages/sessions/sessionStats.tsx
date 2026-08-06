import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import type { SessionStatsResponse } from '../../models/climbing_models.ts';

export default function SessionStats(props: {
    sessionStats: SessionStatsResponse | undefined, 
    statsError: string | undefined
}) {
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

    const renderSessionStats = () => {
        const {total_boulders, highest_grade_sent, sends_by_grade} = props.sessionStats;
        return (
            <>
                <div className="session-stats__body" style={{marginBottom: '14px'}}>
                    <table className="home-stats__table stats__table">
                        <tbody>
                            <tr>
                                <th scope="row">Total Boulders</th>
                                <td>{total_boulders}</td>
                            </tr>
                            <tr>
                                <th scope="row">Highest grade</th>
                                <td>{highest_grade_sent}</td>
                            </tr>
                            <tr>
                                <th scope="row">Time Climbing</th>
                                <td>Placeholder</td>
                            </tr>
                            <tr>
                                <th scope="row">Health Report</th>
                                <td>Placeholder</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <ResponsiveContainer width={250} height={150} >
                        <BarChart data={sends_by_grade}>
                            <XAxis 
                                dataKey="vgrade" 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(grade) => `V${grade}`}
                                tick={{ fontSize: 12 }} />
                            <YAxis width="auto" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                            <Bar dataKey="sends" fill="#6f9f76" barSize={20} />
                            <Tooltip cursor={false} content={<CustomTooltip />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </>
        )
    }

    return (
        <>
            <h2 style={{marginBottom: '5px'}}>Session Stats</h2>

            {props.statsError ? <p>{props.statsError}</p> : props.sessionStats ? renderSessionStats : <p>Nothing to display</p>}
        </>
    )
}