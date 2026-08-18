export default function PersonalBoulderStats(props: {boulderId: string | undefined}) {
    return (
        <div className="personal-boulder__stats">
            <table className="home-stats__table">
                <tbody>
                    <tr>
                        <th scope="row">Total Boulder</th>
                    </tr>
                    <tr>
                        <th scope="row">Total Sent</th>
                        <td>Placeholder</td>
                    </tr>
                    <tr>
                        <th scope="row">Highest Grade</th>
                    </tr>
                    <tr>
                        <th scope="row">Highest Grade Sent</th>
                        <td>Placeholder</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}