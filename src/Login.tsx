import { useState } from 'react';
import { useAuth } from './AuthContext';
import { login } from './api/user';
import { useNavigate } from 'react-router-dom';
import type { LoginData } from './models/user_models';
import type { ApiError } from './api/utils';

function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [errors, setErrors] = useState<ApiError[] | undefined>(undefined);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<LoginData>({
        username: '',
        password: '',
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors(undefined);
        setSubmitting(true);

        try {
            const response = await login(formData);
            if (response.ok) {
                setUser(response.data);
                navigate(`/`);
            } else {
                setErrors(response.errors ? response.errors : [{ message: 'Unable to log in.' }]);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrors({ message: err?.message || 'Unable to log in.'})
            }
        } finally {
            setSubmitting(false)
        }
    }

    return(
        <>
            <h1>Climb Journal</h1>

            <h2>Log In</h2>
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
                        {submitting ? 'Logging in ...' : 'Log in'}
                    </button>
                </div>
            </form>
        </>
    )
}

export default Login;