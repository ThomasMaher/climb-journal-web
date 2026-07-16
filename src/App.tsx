import { Routes, Route } from 'react-router-dom';
import Sessions from './pages/sessions/sessions.tsx';
import NewSession from './pages/sessions/newSession.tsx';
import NavBar from './pages/navbar.tsx';
import Session from './pages/sessions/session.tsx';

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Sessions />} />
          <Route path="/newSession" element={<NewSession />} />
          <Route path="/sessions/:id" element={<Session />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
