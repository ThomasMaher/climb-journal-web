import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { login, register } from '../../api/user';
import { useLocation, useNavigate } from 'react-router-dom';
import type { UserPayload } from '../../models/user_models';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();
    const [error, setError] = useState<string | undefined>(undefined);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserPayload>({
        username: '',
        password: '',
        rePassword: '',
    });

    const locationState = location.state as { registering?: boolean } | null | undefined;
    const [registering, setRegistering] = useState<boolean>(locationState?.registering ?? false);

    useEffect(() => {
        const nextRegistering = locationState?.registering ?? false;
        setRegistering(nextRegistering);
    }, [locationState]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(undefined);
        setSubmitting(true);

        if (formData.password !== formData.rePassword) {
            setError('Passwords do not match');
            setSubmitting(false);
            return;
        }

        try {
            let response;
            if (registering) {
                response = await register(formData);
            } else {
                response = await login(formData);
            }
            if (response?.ok) {
                setUser(response.data);
                navigate(`/`);
            } else if (response.error) {
                setError(response.error || 'Unable to log in.');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err?.message || 'Unable to log in.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    return(
        <>
            <h1>
                {registering ? 'Create a Climb Journal account' : 'Climb Journal'}
            </h1>

            <h2>
                {registering ? 'Choose username and password' : 'Log In'}
            </h2>
            <form className="form-panel form-stack" onSubmit={handleSubmit} style={{marginTop: '10px'}}>
                {error && (<p className="error-banner" role="alert">{error}</p>)}

                <div className="field">
                    <label htmlFor="username">Username: </label>
                    <input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value})} />
                </div>
                <div className="field">
                    <label htmlFor="password">Password: </label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value})} />
                </div>
                {registering && (
                    <div className="field">
                        <label htmlFor="password">Re-enter Password: </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.rePassword}
                            onChange={(e) => setFormData({ ...formData, rePassword: e.target.value})} />
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="btn" disabled={submitting}>
                        {submitting ? 'Logging in...' : 'Submit'}
                    </button>

                    <div className="site-nav__link" style={{cursor:'pointer'}}
                        onClick={(e) => {
                            e.preventDefault();

                            setError(undefined);
                            setRegistering(!registering);
                        }}
                        >
                        {registering ? "Login page" : "Register"}
                    </div>
                </div>
            </form>
        </>
    )
}

export default Login;