import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="logo-section">
          <img src="/x_logo.png" alt="X Logo" className="x-logo" />
        </div>
        
        <div className="content-section">
          <h1>Lo que está pasando ahora</h1>
          <h2>Únete Hoy</h2>

          <div className="auth-buttons">
            <Link to="/register" className="create-account">
              Crear cuenta
            </Link>

            <div className="terms">
              Al registrarte, aceptas los 
              <a href="#">Términos de servicio</a> y la 
              <a href="#">Política de privacidad</a>, incluida la política de 
              <a href="#">Uso de Cookies</a>.
            </div>

            <div className="login-section">
              <h3>¿Ya tienes una cuenta?</h3>
              <Link to="/login" className="login-button">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 