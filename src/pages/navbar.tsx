import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/user';
import { useAuth } from './auth/AuthContext';
import { SESSIONS } from './home';

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

  const renderUserButton = () => {
    if (!user) {
      return (
        <Link to="/login" state={{ registering: true }} className="site-nav__link">
          Register
        </Link>
      )
    } else {
      return (
        <button onClick={(e) => handleLogout(e)} className="site-nav__link site-nav__link--primary">
          Logout
        </button>
      )
    }
  }

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__brand">
          Climb<span>Journal</span>
        </Link>
        <nav className="site-nav__links" aria-label="Primary">
          <Link to="/" className="site-nav__link" state={{ content: SESSIONS }}>
            Sessions
          </Link>
          {renderUserButton()}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
