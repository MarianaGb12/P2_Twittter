import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/public/LandingPage';
import Login from './components/public/Login';
import Register from './components/public/Register';
import Home from './components/private/Home';
import PrivateRoute from './routes/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
          } />

      </Routes>
    </Router>
  );
}

export default App;
