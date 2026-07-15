import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getSession, deleteSession } from "../../api/sessions"
import BoulderForm from "../boulders/boulderForm.tsx"
import SessionBoulderList from "../boulders/sessionBoulderList"

import styles from "./sessions.module.css"

type ApiFormErrors = Record<string, string[]> | { form: string }

function Session() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [session, setSession] = useState<any | undefined>(undefined)
    const [sessionBoulders, setSessionBoulders] = useState<any[] | undefined>(undefined)
    const [pageError, setPageError] = useState<string | undefined>(undefined)
    const [formErrors, setFormErrors] = useState<ApiFormErrors | undefined>(undefined)

    useEffect(() => {
        async function loadSession() {
            if (!id) {
                setPageError('Session id is required')
                return
            }

            const response = await getSession(id)
            if (!response.ok) {
                setPageError(response.error ?? 'Unable to load session')
                if (response.data?.errors) {
                    setFormErrors(response.data.errors)
                }
                return
            }

            const sessionData = response.data
            if (sessionData?.errors) {
                setFormErrors(sessionData.errors)
                return
            }

            setSession((( { id, date, gym_name, notes } ) => ({ id, date, gym_name, notes }))(sessionData))
            setSessionBoulders(sessionData?.boulders ?? [])
        }

        loadSession()
    }, [id])

    const handleDelete = async () => {
        setPageError(undefined)

        if (!id) {
            setPageError('Session id is required')
            return
        }

        try {
            const response = await deleteSession(id)

            if (response.ok) {
                navigate('/')
            } else {
                setPageError(response.error ?? 'Failed to delete session')
            }
        } catch (err: any) {
            setPageError(err?.message || 'Failed to delete session')
        }
    }

    return (
        <>
            <div className={styles.sessionView}>
                <div className={styles.sessionInfo}>
                    <div>
                        {pageError && <p>{pageError}</p>}
                        <h1>{session?.gym_name}</h1>
                        <p>Session ID: {id}</p>
                        <p>{session?.date}</p>
                        <p>{session?.notes} </p>
                    </div>
                    <div>
                        <button onClick={handleDelete}>Delete Session</button>
                    </div>
                </div>
                <BoulderForm sessionId={id ?? ''} errors={formErrors} sessionBoulders={sessionBoulders} setSessionBoulders={setSessionBoulders} />
            </div>

            <SessionBoulderList sessionBoulders={sessionBoulders} />
        </>
    )
}

export default Session;
