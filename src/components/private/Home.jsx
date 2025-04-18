import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Estás logeado como: {user?.name}</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Home;
