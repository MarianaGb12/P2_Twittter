import { Link } from 'react-router-dom';
import '../../styles/Login.css';

function Login() {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <img src="/x_logo.png" alt="X Logo" className="x-logo" />
        </div>
        
        <div className="login-form">
          <h1>Inicia sesión en X</h1>
          
          <form>
            <div className="form-group">
              <input type="text" placeholder="Teléfono, correo electrónico o usuario" />
            </div>
            
            <div className="form-group">
              <input type="password" placeholder="Contraseña" />
            </div>
            
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