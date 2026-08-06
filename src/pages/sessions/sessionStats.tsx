import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from 'recharts';

export default function SessionStats() {
    const gradeData = [
        { vgrade: 3, sends: 5 },
        { vgrade: 4, sends: 3 },
        { vgrade: 5, sends: 1 },
        { vgrade: 6, sends: 1 },
    ];

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
    return (
        <>
            <h2 style={{marginBottom: '5px'}}>Session Stats</h2>

            <div className="session-stats__body" style={{marginBottom: '14px'}}>
                <table className="home-stats__table stats__table">
                    <tbody>
                        <tr>
                            <th scope="row">Total Boulders</th>
                            <td>{10}</td>
                        </tr>
                        <tr>
                            <th scope="row">Highest grade</th>
                            <td>V6</td>
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
                    <BarChart data={gradeData}>
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