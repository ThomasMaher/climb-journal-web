import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from 'recharts';

export default function SessionStats() {
    // export/import this
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
        <div className="home-stats__card">
            <h2>Session Stats</h2>

            <div className="home-stats__body">
                <div>
                    <table className="home-stats__table">
                        <tbody>
                            <tr>
                                <th scope="row">Total Boulders</th>
                                <td>{10}</td>
                            </tr>
                            <tr>
                                <th scope="row">Highest grade</th>
                                <td>V6</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <ResponsiveContainer width={250} height={150} >
                        <BarChart
                            data={[{6: 1, 5: 1, 4: 3, 3: 5}]}
                        >
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
            </div>
        </div>
    )
}