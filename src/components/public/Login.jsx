import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { loginUser } from '../../services/api';
import { jwtDecode } from 'jwt-decode';
import '../../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit= async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await loginUser({ username, password });
      const { token, name, username: backendUsername } = response.data;
      const decoded = jwtDecode(token);
      const userId = decoded.userId; // Decode the JWT token to get user info
      login({ token, 
        user: {_id: userId, name, username: backendUsername}
      }); // Save token and user in context

      navigate('/home'); // Redirect to home page after successful login
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <img src="/x_logo.png" alt="X Logo" className="x-logo" />
        </div>
        
        <div className="login-form">
          <h1>Inicia sesión en X</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" 
              placeholder="Teléfono, correo electrónico o usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              />
            </div>
            
            <div className="form-group">
              <input type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
          </form>
          
          <div className="links">
            <Link to="/">¿Olvidaste tu contraseña?</Link>
            <p>
              ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 