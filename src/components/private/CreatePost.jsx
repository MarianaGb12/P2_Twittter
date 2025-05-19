import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTweet } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useFeature } from "@growthbook/growthbook-react";
import "../../styles/CreatePost.css";

function CreatePost() {
  const [content, setContent] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();
  const showButton = useFeature("showButton").on;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim() === "") return;

    try {
      await createTweet(content, token);
      navigate("/profile");
    } catch (err) {
      console.error("Error al crear tweet:", err);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h2>Crear publicación</h2>
        <button onClick={() => navigate("/profile")} className="close-button">
          ×
        </button>
      </div>
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          placeholder="¿Qué está pasando?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          className="post-textarea"
        />
        <div className="post-footer">
          <span className="char-count">{content.length}/280</span>
          {showButton ? (
            <button
              type="submit"
              className="submit-button"
              disabled={content.trim() === ""}
            >
              Publicar
            </button>
          ) : (
            <a 
              href="/profile" 
              className="submit-link"
              onClick={(e) => {
                e.preventDefault();
                if (content.trim() !== "") {
                  handleSubmit(e);
                }
              }}
            >
              Publicar
            </a>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
