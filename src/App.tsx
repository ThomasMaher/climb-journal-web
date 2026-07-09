import { Routes, Route } from 'react-router-dom';
import './App.css';
import Sessions from './pages/sessions.tsx';
import NewSession from './pages/newSession.tsx';
import NavBar from './pages/navbar.tsx';

function App() {
  return (
    <>
      <NavBar />
  
      <Routes>
        <Route path='/' element={<Sessions />} />
        <Route path='/newSession' element={<NewSession />} />
      </Routes>
    </>
  )
}

export default App
