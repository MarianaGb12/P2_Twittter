import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreatePost.css';

function CreatePost() {
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() === '') return;

    const newPost = {
      id: Date.now(),
      content: content,
      timestamp: new Date().toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      likes: 0,
      replies: []
    };

  
    const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const updatedPosts = [newPost, ...existingPosts];
    
    
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    
  
    navigate('/profile');
  };

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h2>Crear publicación</h2>
        <button onClick={() => navigate('/profile')} className="close-button">
          ×
        </button>
      </div>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="¿Qué está pasando?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          className="post-textarea"
          required
        />
        <div className="post-footer">
          <span className="char-count">{content.length}/280</span>
          <button 
            type="submit" 
            className="submit-button"
            disabled={content.trim() === ''}
          >
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
