import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../services/api";
import "../../styles/Register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (
      !form.name ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.passwordConfirmation
    ) {
      setError("Todos los campos son requeridos");
      return false;
    }

    if (form.password !== form.passwordConfirmation) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await registerUser({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        passwordConfirmation: form.passwordConfirmation,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Error al registrarse");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="logo-section">
          <img src="/x_logo.png" alt="X Logo" className="x-logo" />
        </div>

        <div className="register-form">
          <h1>Crear tu cuenta</h1>

          <form onSubmit={handleSubmit}>
            {error && (
              <p data-testid="error-message" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <div className="form-group">
              <input
                type="text"
                placeholder="Nombre"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Usuario"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Correo electrónico"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Contraseña"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Confirmar contraseña"
                name="passwordConfirmation"
                value={form.passwordConfirmation}
                onChange={handleChange}
                required
              />
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
