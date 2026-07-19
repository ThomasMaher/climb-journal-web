import { Routes, Route } from 'react-router-dom';
import Session from './pages/sessions/session.tsx';
import NewSession from './pages/sessions/newSession.tsx';
import NavBar from './pages/navbar.tsx';
import Home from './pages/home.tsx';

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/newSession" element={<NewSession />} />
          <Route path="/sessions/:id" element={<Session />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
