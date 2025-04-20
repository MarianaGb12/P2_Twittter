import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserTweets } from '../../services/api';
import TweetItem from './TweetItem';
import '../../styles/Profile.css';

function Profile() {
  const { token, user, logout } = useAuth();
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();

  const fetchTweets = async () => {
    try {
      const response = await getUserTweets(token);
      // Filter tweets to only show those created by the logged-in user
      const onlyMine = response.data.filter((t) => t.user._id === user._id);
      setTweets(onlyMine);
    } catch (err) {
      console.error('Error al cargar tweets:', err);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Hola {user.name}, este es tu Perfil</h1>
        <div className="header-buttons">
          <button
            onClick={() => navigate('/create-post')}
            className="create-post-button"
          >
            Crear Post
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="logout-button"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="profile-posts">
        {tweets.length === 0 ? (
          <p className="no-posts">No tienes publicaciones por ahora.</p>
        ) : (
          tweets.map((tweet) => (
            <TweetItem
              key={tweet._id}
              tweet={tweet}
              refresh={fetchTweets}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;