import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSession, deleteSession } from "../../api/sessions";
import BoulderForm from "../boulders/boulderForm.tsx"
import SessionBoulderList from "../boulders/sessionBoulderList";

import styles from "./sessions.module.css";

function Session() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [session, setSession] = useState<any | undefined>(undefined);
    const [sessionBoulders, setSessionBoulders] = useState<any | undefined>(undefined);
    const [errors, setErrors] = useState<any | undefined>(undefined);
    const [formErrors, setFormErrors] = useState<any | undefined>(undefined);

    useEffect(() => {
        getSession(id).then((session) => {
            if (!!session.errors) {
                setFormErrors(session.errors);
            } else {
                setSession((({ id, date, gym_name, notes }) => ({ id, date, gym_name, notes }))(session));
                setSessionBoulders(session.boulders);
            }
        })
    }, ([]))

    const handleDelete = async () => {
        try {
          const response = await deleteSession(id);

          if (response.success) {
            navigate('/');
          } else {
            setErrors(response.data || 'Failed to delete session');
          }   
        } catch (err: any) {
          setErrors(err?.message ? err.message : err);
        }
    }

    return (
        <>
            <div className={styles.sessionView}>
                {console.log(sessionBoulders)}
                <div className={styles.sessionInfo}>
                    <div>
                        {errors && <p>{errors}</p>}
                        <h1>{session?.gym_name}</h1>
                        <p>Session ID: {id}</p>
                        <p>{session?.date}</p>
                        <p>{session?.notes} </p>
                    </div>
                    <div>
                        <button onClick={handleDelete}>Delete Session</button>
                    </div>
                </div>
                <BoulderForm sessionId={id} errors={formErrors} sessionBoulders={sessionBoulders} setSessionBoulders={setSessionBoulders} />
            </div>

            <SessionBoulderList sessionBoulders={sessionBoulders} />
        </>
    );
}

export default Session;