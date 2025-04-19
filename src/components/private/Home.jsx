import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserTweets } from '../../services/api';

function Home() {
  const { user, token, logout } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTweets = async () => {
    try {
      const response = await getUserTweets(token);
      const tweets = response.data || [];
      
      // Filter tweets to only include those from the logged-in user
      const userTweets = tweets.filter((tweet) => tweet.user._id === user._id);
  
      // Sort tweets by createdAt in descending order
      const ordered = userTweets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  
      setTweets(ordered);
    } catch (err) {
      setError(err.message || 'Error al cargar tweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Hola, {user?.name} 👋</h2>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate('/profile')}>Mi perfil</button>
        <button onClick={() => navigate('/create')}>Crear tweet</button>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <hr />

      {loading ? (
        <p>Cargando tweets...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : tweets.length === 0 ? (
        <p>No has publicado ningún tweet.</p>
      ) : (
        <ul>
          {tweets.map((tweet) => (
            <li key={tweet._id}>
              <p>{tweet.content}</p>
              <small>{new Date(tweet.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
