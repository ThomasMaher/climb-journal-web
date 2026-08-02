import { Routes, Route } from 'react-router-dom';
import Session from './pages/sessions/session.tsx';
import NewSession from './pages/sessions/newSession.tsx';
import NavBar from './pages/navbar.tsx';
import Home from './pages/home.tsx';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
            } />
          <Route path="/newSession" element={
            <ProtectedRoute>
              <NewSession />
            </ProtectedRoute>
            } />
          <Route path="/sessions/:id" element={
            <ProtectedRoute>
              <Session />
            </ProtectedRoute>
            } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
