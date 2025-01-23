import React, { useState, useEffect } from "react";
import "./Comments.css";
import { useToast } from "../contexts/ToastContext";

interface Comment {
  id: number;
  bookId: number;
  userId: string;
  userName: string;
  CommentMessage: string;
  createdAt: string;
}

interface CommentsProps {
  bookId: number;
  currentUser: { id: string; userName: string } | null;
}

const Comments: React.FC<CommentsProps> = ({ bookId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { showToast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://localhost:7197/api/User/comments/${bookId}`
      );

      if (!response.ok) {
        throw new Error("Hiba a hozzászólások lekérése során.");
      }

      const data: Comment[] = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Hiba a hozzászólások lekérése során:", err);
      setError("Nem sikerült betölteni a hozzászólásokat.");
    }
  };

  const handleAddComment = async () => {
    if (!currentUser) {
      showToast("Be kell jelentkeznie a hozzászóláshoz!", "error");
      return;
    }

    if (newComment.trim() === "") {
      showToast("A hozzászólás nem lehet üres!", "error");
      return;
    }

    try {
      const requestData = {
        bookId,
        userId: currentUser.id,
        userName: currentUser.userName,
        CommentMessage: newComment,
      };

      const response = await fetch("https://localhost:7197/api/User/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Nem sikerült hozzáadni a hozzászólást.");
      }

      const addedComment: Comment = await response.json();
      setComments((prevComments) => [addedComment, ...prevComments]);
      setNewComment("");
      showToast("Hozzászólás sikeresen hozzáadva!", "success");
    } catch (err) {
      console.error("Hiba a hozzászólás hozzáadása során:", err);
      showToast("Nem sikerült hozzáadni a hozzászólást.", "error");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!currentUser) {
      showToast("Be kell jelentkeznie a törléshez!", "error");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7197/api/Comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nem sikerült törölni a hozzászólást.");
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      showToast("Hozzászólás sikeresen törölve!", "success");
    } catch (err) {
      console.error("Hiba a hozzászólás törlése során:", err);
      showToast("Nem sikerült törölni a hozzászólást.", "error");
    }
  };

  return (
    <div className="commentsSection">
      <h3>Hozzászólások</h3>

      {currentUser && (
        <div className="addComment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Írj egy hozzászólást..."
          />
          <button onClick={handleAddComment}>Hozzászólás</button>
        </div>
      )}

      {error && <p className="errorMessage">{error}</p>}

      <ul className="commentsList">
        {comments.map((comment) => (
          <li key={comment.id} className="comment">
            <div className="commentHeader">
              <span className="commentAuthor">{comment.userName}</span>
              <span className="commentDate">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="commentContent">{comment.CommentMessage}</p>
            {currentUser && currentUser.id === comment.userId && (
              <button
                className="deleteCommentButton"
                onClick={() => handleDeleteComment(comment.id)}
              >
                Törlés
              </button>
            )}
          </li>
        ))}
      </ul>

      {comments.length === 0 && <p>Még nincsenek hozzászólások.</p>}
    </div>
  );
};

export default Comments;
