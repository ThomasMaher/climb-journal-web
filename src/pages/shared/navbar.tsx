import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../api/user';
import { useAuth } from '../auth/useAuth';
import { SESSIONS } from '../home';

function NavBar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await logout();

    if (response.ok) {
      setUser(null);
    }

    navigate('/');
  }

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__brand">
          Climb<span>Journal</span>
        </Link>
        <nav className="site-nav__links" aria-label="Primary">
          {user && (
            <>
              <Link to="/" className="site-nav__link" state={{ content: SESSIONS }}>
                Sessions
              </Link>
              <button onClick={(e) => handleLogout(e)} className="site-nav__link site-nav__link--primary">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
