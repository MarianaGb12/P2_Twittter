import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getUserTweets } from "../../services/api";
import TweetItem from "./TweetItem";

function Home() {
  const { token, logout } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTweets = useCallback(async () => {
    try {
      const response = await getUserTweets(token);
      const allTweets = response.data || [];
      // sort tweets by createdAt date in descending order
      allTweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTweets(allTweets);
    } catch (err) {
      setError(err.message || "Error al cargar tweets");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Bienvenid@ a twitter</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => navigate("/profile")}>Mi perfil</button>
        <button onClick={() => navigate("/create-post")}>Crear tweet</button>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <hr />

      {loading ? (
        <p>Cargando tweets...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : tweets.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        <div>
          {tweets.map((tweet) => (
            <TweetItem key={tweet._id} tweet={tweet} refresh={fetchTweets} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
