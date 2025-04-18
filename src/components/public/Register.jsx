import { Link } from 'react-router-dom';
import '../../styles/Register.css';

function Register() {
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="logo-section">
          <img src="/x_logo.png" alt="X Logo" className="x-logo" />
        </div>
        
        <div className="register-form">
          <h1>Crear tu cuenta</h1>
          
          <form>
            <div className="form-group">
              <input type="text" placeholder="Nombre" />
            </div>
            
            <div className="form-group">
              <input type="text" placeholder="Teléfono" />
            </div>
            
            <div className="form-group">
              <input type="email" placeholder="Correo electrónico" />
            </div>
            
            <div className="form-group">
              <input type="password" placeholder="Contraseña" />
            </div>
            
            <div className="form-group">
              <input type="password" placeholder="Confirmar contraseña" />
            </div>
            
            <button type="submit" className="register-button">
              Registrarse
            </button>
          </form>
          
          <div className="links">
            <p>
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register; 