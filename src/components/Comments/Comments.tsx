import React, { useEffect, useState } from "react";
import "./Comments.css";

interface CommentDTO {
  commentId: number;
  commenterId: string;
  bookId: number;
  commentMessage: string;
  parentCommentId?: number | null;
  threadId: number;
}

interface User {
  id: string;
  userName: string;
}

interface CommentsProps {
  bookId: number;
  currentUser: User;
}

const Comments = ({ bookId, currentUser }: CommentsProps) => {
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [nestedComments, setNestedComments] = useState<Record<number, CommentDTO[]>>({});
  const [newComment, setNewComment] = useState<string>("");
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>("");
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const getAuthToken = () => localStorage.getItem("jwt");

  const fetchComments = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch(`https://localhost:7197/api/User/comments/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data: CommentDTO[] = await response.json();
        setComments(data);

        const nested: Record<number, CommentDTO[]> = {};
        data.forEach((comment) => {
          const parentId = comment.parentCommentId || 0;
          if (!nested[parentId]) {
            nested[parentId] = [];
          }
          nested[parentId].push(comment);
        });
        setNestedComments(nested);

        data.forEach((comment) => {
          if (!usernames[comment.commenterId]) {
            fetchUsername(comment.commenterId);
          }
        });
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchUsername = async (userId: string) => {
    try {
      const response = await fetch(`https://localhost:7197/api/User/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUsernames((prevUsernames) => ({
          ...prevUsernames,
          [userId]: data.userName,
        }));
      } else {
        console.error("Failed to fetch username");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editedMessage.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("You must be logged in to edit comments.");
      return;
    }

    try {
      const response = await fetch(`https://localhost:7197/api/User/modifyComment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ commentMessage: editedMessage, commenterId: currentUser.id }),
      });

      if (response.ok) {
        await fetchComments();
        setEditingComment(null);
        setEditedMessage("");
      } else {
        console.error("Failed to edit comment");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    const token = getAuthToken();
    if (!token) {
      alert("You must be logged in to delete comments.");
      return;
    }

    try {
      const response = await fetch(`https://localhost:7197/api/User/deleteComment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchComments();
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("You must be logged in to comment.");
      return;
    }

    const commentDto: Omit<CommentDTO, "commenterId" | "commentId"> = {
      bookId,
      commentMessage: newComment,
      parentCommentId,
      threadId: 0,
    };

    try {
      const response = await fetch(`https://localhost:7197/api/User/createComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...commentDto,
          commenterId: currentUser.id,
        }),
      });

      if (response.ok) {
        await fetchComments();
        setNewComment("");
        setParentCommentId(null);
      } else {
        console.error("Failed to create comment");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleCreateReply = async (parentCommentId: number) => {
    if (!replyMessage.trim()) {
      alert("Reply cannot be empty!");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("You must be logged in to reply.");
      return;
    }

    const replyDto: Omit<CommentDTO, "commenterId" | "commentId"> = {
      bookId,
      commentMessage: replyMessage,
      parentCommentId,
      threadId: parentCommentId,
    };

    try {
      const response = await fetch(`https://localhost:7197/api/User/createComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...replyDto,
          commenterId: currentUser.id,
        }),
      });

      if (response.ok) {
        await fetchComments();
        setReplyMessage("");
        setParentCommentId(null);
      } else {
        console.error("Failed to create reply");
      }
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  const renderComments = (parentId: number = 0, depth: number = 0) => {
    const replies = nestedComments[parentId] || [];
    const isExpanded = expandedComments.has(parentId);

    return (
      replies.slice(0, isExpanded ? replies.length : 2).map((comment) => (
        <div key={comment.commentId} className="comment" style={{ marginLeft: depth * 20 }}>
          {/* <div className="vote-section">
            <button className="vote-button">▲</button>
            <div className="vote-count">0</div>
            <button className="vote-button">▼</button>
          </div> */}
          <div className="content">
            {editingComment === comment.commentId ? (
              <div>
                <textarea
                  className="edit-comment-textarea"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                />
                <button className="save-comment-button" onClick={() => handleEditComment(comment.commentId)}>Save</button>
                <button className="cancel-edit-button" onClick={() => setEditingComment(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>{usernames[comment.commenterId] || "Loading..."}</strong>: <br /> <span className="commentMessage">{comment.commentMessage}</span>
                </p>
                <div className="actions">
                  <button className="reply-button" onClick={() => setParentCommentId(comment.commentId)}>Reply</button>
                  {currentUser.id === comment.commenterId && (
                    <>
                      <button
                        className="edit-button"
                        onClick={() => {
                          setEditingComment(comment.commentId);
                          setEditedMessage(comment.commentMessage);
                        }}
                      >
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteComment(comment.commentId)}>Delete</button>
                    </>
                  )}
                </div>
                {parentCommentId === comment.commentId && (
                  <div className="reply-container">
                    <textarea
                      className="reply-textarea"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                    <button className="submit-reply-button" onClick={() => handleCreateReply(comment.commentId)}>
                      Submit Reply
                    </button>
                    <button className="cancel-reply-button" onClick={() => setParentCommentId(null)}>Cancel</button>
                  </div>
                )}
                {renderComments(comment.commentId, depth + 1)}
              </div>
            )}
          </div>
        </div>
      ))
    ).concat(
      replies.length > 2 && !isExpanded ? (
        <button
          key={`expand-${parentId}`}
          className="expand-button"
          onClick={() => setExpandedComments((prev) => new Set(prev).add(parentId))}
        >
          ...Szó, szót követ
        </button>
      ) : []
    );
  };

  return (
    <div className="comments-container">
      <h2 className="comments-title">Comments</h2>
      {renderComments()}
      <textarea
        className="new-comment-textarea"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button className="submit-comment-button" onClick={handleCreateComment}>Submit</button>
    </div>
  );
};

export default Comments;
