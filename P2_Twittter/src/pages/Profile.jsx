import { useState, useEffect } from 'react';
import '../styles/Profile.css';

function Profile() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        content: "Estoy probando mi app tipo Twitter!",
        timestamp: "18 de abril de 2025",
        likes: 0,
      },
      {
        id: 2,
        content: "React es genial",
        timestamp: "17 de abril de 2025",
        likes: 0,
      }
    ];
    setPosts(mockData);
  }, []);

  const handleCreatePost = () => {
    if (newPost.trim() === '') return;

    const newEntry = {
      id: Date.now(),
      content: newPost,
      timestamp: new Date().toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      likes: 0,
    };

    setPosts([newEntry, ...posts]);
    setNewPost('');
  };

  const handleLike = (id) => {
    const updated = posts.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updated);
  };

  const handleDelete = (id) => {
    const updated = posts.filter(post => post.id !== id);
    setPosts(updated);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
      </div>

      <div className="new-post">
        <textarea
          placeholder="¿Qué está pasando?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handleCreatePost}>Twittear</button>
      </div>

      <div className="profile-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <p>{post.content}</p>
              <small>{post.timestamp}</small>
              <div className="post-actions">
                <button onClick={() => handleLike(post.id)}>❤️ {post.likes}</button>
                <button onClick={() => handleDelete(post.id)}>🗑️ Eliminar</button>
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
