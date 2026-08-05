import { useState } from 'react';
import { useAuth } from './AuthContext';
import { login, register } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import type { UserData } from '../../models/user_models';
import type { ApiError } from '../../api/utils';

function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [errors, setErrors] = useState<ApiError | undefined>(undefined);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserData>({
        username: '',
        password: '',
    });
    const [registering, setRegistering] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors(undefined);
        setSubmitting(true);

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
            } else {
                setErrors(response.errors ? response.errors : { message: 'Unable to log in.' });
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrors({ message: err?.message || 'Unable to log in.'})
            }
        } finally {
            setSubmitting(false)
        }
    }

    const switchFormType = () => {
        setErrors(undefined);

        return (
            <button onClick={() => setRegistering(!registering)}>
                {registering ? "Login" : "Register"}
            </button>
        );
    }

    return(
        <>
            <h1>
                {registering ? 'Climb Journal' : 'Create a Climb Journal account'}
            </h1>

            <h2>
                {registering ? 'Log In' : 'Choose username and password'}
            </h2>
            <form className="form-panel form-stack" onSubmit={handleSubmit}>
                {errors && (
                    <p className="error-banner" role="alert">
                        {/* // Fix this */}
                        
                    </p>
                )}

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

                <div className="form-actions">
                    <button type="submit" className="btn" disabled={submitting}>
                        {submitting ? 'Logging in ...' : 'Submit'}
                    </button>
                </div>
                <button
                    onClick={() => {
                        setErrors(undefined);
                        setRegistering(!registering);
                    }}
                    >
                    {registering ? "Register" : "Login"}
                    </button>
            </form>
        </>
    )
}

export default Login;