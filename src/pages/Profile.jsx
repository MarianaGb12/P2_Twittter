import { useState, useEffect } from 'react';
import '../styles/Profile.css';

function Profile() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Simulación temporal hasta tener el backend real
        const mockData = [
          {
            id: 1,
            title: "Mi primer tweet",
            content: "Estoy probando mi app tipo Twitter!",
            timestamp: "18 de abril de 2025"
          },
          {
            id: 2,
            title: "React es genial",
            content: "Me gusta trabajar con componentes.",
            timestamp: "17 de abril de 2025"
          }
        ];

        // Si ya tienes un backend corriendo, solo cambia esta parte:
        // const response = await fetch('http://localhost:3000/api/posts');
        // const data = await response.json();
        // setPosts(data);

        setPosts(mockData);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
      </div>

      <div className="profile-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>{post.timestamp}</small>
              <div className="post-actions">
                <button>❤️ Me gusta</button>
                <button>💬 Responder</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay publicaciones por ahora.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
