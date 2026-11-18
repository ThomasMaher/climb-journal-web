import { Link } from 'react-router-dom';

export default function SessionHealthCard(props: {
    sessionId: string,
}) {

    const renderHealthInfo = () => {
        return (
            <>
                <div className="session-stats__body" style={{marginBottom: '14px'}}>
                    <table className="home-stats__table stats__table">
                        <tbody>
                            <tr>
                                <th scope="row">Finger Pain</th>
                                <td>4/10</td>
                            </tr>
                            <tr>
                                <th scope="row">Lat Pain</th>
                                <td>1/10</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    return (
        <>
            <div>
                <h2 style={{marginBottom: '5px'}}>Session Health</h2>
                <Link to={`/sessions/${props.sessionId}/health`}>See more</Link>
            </div>

            {renderHealthInfo()}
        </>
    )
}