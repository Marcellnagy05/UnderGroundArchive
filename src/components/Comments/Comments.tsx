import React, { useEffect, useState } from "react";

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
  const [newComment, setNewComment] = useState<string>("");
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>("");
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  const getAuthToken = () => localStorage.getItem("jwt");

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

        // Fetch usernames for each commenter
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

  const handleEditComment = async (commentId: number) => {
    if (!editedMessage.trim()) {
      alert("Edited comment cannot be empty!");
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

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  return (
    <div>
      <h2>Comments</h2>
      <div>
        {comments.length > 0 ? (
          comments.map((comment) => {
            return (
              <div key={comment.commentId} style={{ marginLeft: comment.parentCommentId ? 20 : 0 }}>
                {editingComment === comment.commentId ? (
                  <>
                    <textarea
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                    />
                    <button onClick={() => handleEditComment(comment.commentId)}>
                      Save
                    </button>
                    <button onClick={() => setEditingComment(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>{usernames[comment.commenterId] || "Loading..."}</strong>:{" "}
                      {comment.commentMessage}
                    </p>
                    {comment.commenterId === currentUser.id && (
                      <>
                        <button
                          onClick={() => {
                            setEditingComment(comment.commentId);
                            setEditedMessage(comment.commentMessage);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.commentId)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {comment.parentCommentId === null && (
                      <button onClick={() => setParentCommentId(comment.commentId)}>
                        Reply
                      </button>
                    )}
                    {parentCommentId === comment.commentId && (
                      <div>
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Write your reply..."
                        />
                        <button onClick={() => handleCreateReply(comment.commentId)}>
                          Submit Reply
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleCreateComment}>Submit Comment</button>
      </div>
    </div>
  );
};

export default Comments;
