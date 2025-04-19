import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(savedPosts);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

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
      replies: []
    };

    const updatedPosts = [newEntry, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setNewPost('');
  };

  const handleLike = (id) => {
    const updated = posts.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updated);
    localStorage.setItem('posts', JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    const updated = posts.filter(post => post.id !== id);
    setPosts(updated);
    localStorage.setItem('posts', JSON.stringify(updated));
  };

  const handleReply = (postId) => {
    if (replyContent.trim() === '') return;

    const updated = posts.map(post => {
      if (post.id === postId) {
        const newReply = {
          id: Date.now(),
          content: replyContent,
          timestamp: new Date().toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        };
        return {
          ...post,
          replies: [...(post.replies || []), newReply]
        };
      }
      return post;
    });

    setPosts(updated);
    localStorage.setItem('posts', JSON.stringify(updated));
    setReplyContent('');
    setReplyingTo(null);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <div className="header-buttons">
          <button onClick={() => navigate('/create-post')} className="create-post-button">
            Crear Post
          </button>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="new-post">
        <textarea
          placeholder="¿Qué está pasando?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handleCreatePost} className="post-button">Twittear</button>
      </div>

      <div className="profile-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-content">
                <p>{post.content}</p>
                <small>{post.timestamp}</small>
              </div>
              <div className="post-actions">
                <button onClick={() => handleLike(post.id)} className="like-button">
                  <span className="icon">❤️</span>
                  <span className="count">{post.likes}</span>
                </button>
                <button onClick={() => setReplyingTo(post.id)} className="reply-button">
                  <span className="icon">💬</span>
                </button>
                <button onClick={() => handleDelete(post.id)} className="delete-button">
                  <span className="icon">🗑️</span>
                </button>
              </div>
              
              {replyingTo === post.id && (
                <div className="reply-section">
                  <textarea
                    placeholder="Escribe tu respuesta..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <button onClick={() => handleReply(post.id)} className="reply-submit">
                    Responder
                  </button>
                </div>
              )}

              {post.replies && post.replies.length > 0 && (
                <div className="replies">
                  {post.replies.map(reply => (
                    <div key={reply.id} className="reply">
                      <p>{reply.content}</p>
                      <small>{reply.timestamp}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-posts">No hay publicaciones por ahora.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
