import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/public/LandingPage';
import Login from './components/public/Login';
import Register from './components/public/Register';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
