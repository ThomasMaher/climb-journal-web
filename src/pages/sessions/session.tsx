import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSession, deleteSession } from "../../api/sessions";
import BoulderForm from "../boulders/boulderForm.tsx"

import styles from "./sessions.module.css";

function Session() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [session, setSession] = useState<any | undefined>(undefined);
    const [errors, setErrors] = useState<any | undefined>(undefined);

    useEffect(() => {
        getSession(id).then((session) => {
            setSession(session);
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
        <div className={styles.sessionView}>
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
            <div>
                <BoulderForm />

                <div className="climb-sessions-list">

                </div>
            </div>
        </div>
    );
}

export default Session;