import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__brand">
          Climb<span>Journal</span>
        </Link>
        <nav className="site-nav__links" aria-label="Primary">
          <Link to="/" className="site-nav__link">
            Sessions
          </Link>
          <Link to="/newSession" className="site-nav__link site-nav__link--primary">
            New session
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
