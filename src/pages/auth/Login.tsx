import { useState } from 'react';
import { useAuth } from './useAuth';
import { login, register } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import type { UserPayload } from '../../models/user_models';
import type { ApiFormErrors } from '../../api/utils';

function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [errors, setErrors] = useState<ApiFormErrors | []>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserPayload>({
        username: '',
        password: '',
        rePassword: '',
    });

    const [registering, setRegistering] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors([]);
        setSubmitting(true);

        try {
            let response;
            if (registering) {
                if (formData.password !== formData.rePassword) {
                    setErrors({ password: ['Passwords do not match'] });
                    setSubmitting(false);
                    return;
                }
                response = await register(formData);
            } else {
                response = await login(formData);
            }
            if (response?.ok) {
                setUser(response.data);
                navigate(`/`);
            } else if (response?.errors){
                setErrors(response.errors);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrors({ general: [err?.message] })
            }
        } finally {
            setSubmitting(false)
        }
    }

    const allErrors = () => {
        return Object.values(errors).flat();
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
                {allErrors().length > 0 && allErrors().map((err, idx) => (
                    <p key={idx} className="error-banner" role="alert">{err}</p>
                ))}
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

                            setErrors([]);
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