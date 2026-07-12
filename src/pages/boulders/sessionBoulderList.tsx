function SessionBoulderList(props) {
    return(
        <div className="climb-sessions-list">
            <h1>Climbs</h1>

            {props.sessionBoulders?.map((sessionBoulder) => {
                return(
                    <div key={sessionBoulder.id}>
                        <p>Nickname: {sessionBoulder.nickname}</p>
                        <p>VGrade: {sessionBoulder.vgrade_range_min}</p>
                        <p>Attempts: {sessionBoulder.attempts}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default SessionBoulderList