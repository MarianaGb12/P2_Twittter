import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreatePost.css';

function CreatePost() {
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = { content };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error al crear publicación:', error);
    }
  };

  return (
    <div className="tweet-container">
      <h2 className="tweet-title">Crear publicación</h2>
      <form className="tweet-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="¿Qué está pasando?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          className="tweet-input"
          required
        />
        <div className="tweet-footer">
          <span className="char-count">{content.length}/280</span>
          <button type="submit" className="tweet-button">
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
