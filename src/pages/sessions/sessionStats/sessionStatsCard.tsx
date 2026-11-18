import type { SessionStatsResponse } from '../../../models/climbing_models.ts';
import { Link } from 'react-router-dom';

export default function SessionStatsCard(props: {
    sessionStats: SessionStatsResponse | undefined, 
    statsError: string | undefined,
    sessionId: string,
}) {

    const renderSessionStats = () => {
        if (!props.sessionStats) { return <p>Nothing to display</p> }

        const {total_boulders, highest_grade_sent} = props.sessionStats;
        return (
            <>
                <div className="session-stats__body" style={{marginBottom: '14px'}}>
                    <table className="home-stats__table stats__table">
                        <tbody>
                            <tr>
                                <th scope="row">Total Boulders</th>
                                <td>{total_boulders}</td>
                            </tr>
                            {/* <tr>
                                <th scope="row">Total Sent</th>
                                <td>Placeholder</td>
                            </tr> */}
                            <tr>
                                <th scope="row">Highest Grade</th>
                                <td>{highest_grade_sent}</td>
                            </tr>
                            {/* <tr>
                                <th scope="row">Highest Grade Sent</th>
                                <td>Placeholder</td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }

    return (
        <>
            <div>
                <h2 style={{marginBottom: '5px'}}>Session Stats</h2>
                <Link to={`/sessions/${props.sessionId}/stats`}>See more</Link>
            </div>

            {props.statsError ? <p>{props.statsError}</p> : renderSessionStats()}
        </>
    )
}