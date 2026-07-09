import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSession, deleteSession } from "../../api/sessions";

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
        <>
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
        </>
    );
}

export default Session;