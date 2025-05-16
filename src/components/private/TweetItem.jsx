import { useState } from "react";
import { likeTweet, commentTweet, deleteTweet } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/Profile.css";

function TweetItem({ tweet, onDelete, refresh }) {
  const { token, user } = useAuth();
  const [reply, setReply] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleLike = async () => {
    try {
      await likeTweet(tweet._id, token);
      refresh();
    } catch (err) {
      console.error("Error al dar like:", err);
    }
  };

  const handleComment = async () => {
    if (reply.trim() === "") return;
    try {
      await commentTweet(tweet._id, reply, token);
      setReply("");
      setShowReply(false);
      refresh();
    } catch (err) {
      console.error("Error al comentar:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTweet(tweet._id, token);
      onDelete?.(tweet._id);
      refresh();
    } catch (err) {
      console.error("Error al eliminar tweet:", err);
    }
  };

  return (
    <div className="post">
      <div className="post-content">
        <p>
          <strong>@{tweet.user.username}</strong>
        </p>
        <p>{tweet.content}</p>
        <small>{new Date(tweet.createdAt).toLocaleString()}</small>
      </div>

      <div className="post-actions">
        <button onClick={handleLike} className="like-button">
          <span className="icon">❤️</span>
          <span className="count">{tweet.likes}</span>
        </button>
        <button
          onClick={() => setShowReply((prev) => !prev)}
          className="reply-button"
        >
          <span className="icon">💬</span>
        </button>
        {tweet.user._id === user._id && (
          <button onClick={handleDelete} className="delete-button">
            <span className="icon">🗑️</span>
          </button>
        )}
      </div>

      {showReply && (
        <div className="reply-section">
          <textarea
            placeholder="Escribe tu respuesta..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <button onClick={handleComment} className="reply-submit">
            Responder
          </button>
        </div>
      )}

      {tweet.comments?.length > 0 && (
        <div className="replies">
          {tweet.comments.map((replyObj, i) => (
            <div key={replyObj._id || i} className="reply">
              <p>
                <strong>@{replyObj.user.username}</strong>: {replyObj.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TweetItem;
