import React, { useEffect, useState } from "react";
import "./Comments.css";
import StarRating from "../StarRating/StarRating";
import { updatePoints } from "../../services/RankingServices";

interface CommentDTO {
  commentId: number;
  commenterId: string;
  bookId: number;
  commentMessage: string;
  parentCommentId?: number | null;
  threadId: number;
  likes: number;
  dislikes: number;
}

interface User {
  id: string;
  userName: string;
  role: string;
}

interface CommentsProps {
  bookId: number;
  currentUser: User;
}

const Comments = ({ bookId, currentUser }: CommentsProps) => {
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [nestedComments, setNestedComments] = useState<
    Record<number, CommentDTO[]>
  >({});
  const [newComment, setNewComment] = useState<string>("");
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>("");
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [readerRatings, setReaderRatings] = useState<Record<number, number>>(
    {}
  );
  const [criticRatings, setCriticRatings] = useState<Record<number, number>>(
    {}
  );
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [dislikes, setDislikes] = useState<Record<number, number>>({});

  const getAuthToken = () => localStorage.getItem("jwt");

  const fetchComments = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7197/api/User/comments/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data: CommentDTO[] = await response.json();
        setComments(data);

        // Csoportosítás threadId alapján, csak reply-k esetén
        const nested: Record<number, CommentDTO[]> = {};
        data.forEach((comment) => {
          if (comment.parentCommentId) {
            const threadId = comment.threadId;
            if (!nested[threadId]) {
              nested[threadId] = [];
            }
            nested[threadId].push(comment);
          }
        });
        setNestedComments(nested);

        // Felhasználónevek betöltése (hozzáadjuk a parentCommentId-hoz is)
        data.forEach((comment) => {
          if (!usernames[comment.commenterId]) {
            fetchUsername(comment.commenterId);
          }
          const parentCommenterId = findParentCommenterId(comment.threadId);
          if (parentCommenterId && !usernames[parentCommenterId]) {
            fetchUsername(parentCommenterId);
          }
        });
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchRatings = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const [readerResponse, criticResponse] = await Promise.all([
          fetch(
            `https://localhost:7197/api/User/readerRatingsForBook/${bookId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `https://localhost:7197/api/User/criticRatingsForBook/${bookId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        if (readerResponse.ok) {
          const readerData = await readerResponse.json();
          const readerRatingsMap: Record<string, number> = {};
          readerData.forEach(
            (rating: {
              raterId: string;
              bookId: number;
              ratingValue: number;
            }) => {
              const key = `${rating.bookId}_${rating.raterId}`;
              readerRatingsMap[key] = rating.ratingValue;
            }
          );
          setReaderRatings(readerRatingsMap);
        } else {
          console.warn("Failed to fetch reader ratings");
        }

        if (criticResponse.ok) {
          const criticData = await criticResponse.json();
          const criticRatingsMap: Record<string, number> = {};
          criticData.forEach(
            (rating: {
              raterId: string;
              bookId: number;
              ratingValue: number;
            }) => {
              const key = `${rating.bookId}_${rating.raterId}`;
              criticRatingsMap[key] = rating.ratingValue;
            }
          );
          setCriticRatings(criticRatingsMap);
        } else {
          console.warn("Failed to fetch critic ratings");
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };
    fetchRatings();
  }, [bookId, currentUser.role]);

  const fetchUsername = async (userId: string) => {
    try {
      const response = await fetch(
        `https://localhost:7197/api/User/user/${userId}`
      );
      if (response.ok) {
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          setUsernames((prevUsernames) => ({
            ...prevUsernames,
            [userId]: data.userName,
          }));
        } else {
          console.warn(`Empty response for userId: ${userId}`);
        }
      } else {
        console.error(
          `Failed to fetch username for userId: ${userId}. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error(`Error fetching username for userId: ${userId}`, error);
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
      const originalComment = comments.find(
        (comment) => comment.commentId === commentId
      );
      if (!originalComment) {
        console.error("Original comment not found");
        return;
      }

      const response = await fetch(
        `https://localhost:7197/api/User/modifyComment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            commentMessage: editedMessage,
            commenterId: currentUser.id,
            parentCommentId: originalComment.parentCommentId,
            threadId: originalComment.threadId,
          }),
        }
      );

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

  const handleLikes = async (commentId: number, commenterId: string) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("Please log in to like comments.");
        return;
      }

      const response = await fetch(
        `https://localhost:7197/api/User/likeComment/${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updatePoints(commenterId, 2, "User");
      if (!response.ok) {
        const errorMessage = await response.text();
        alert(errorMessage);
        return;
      }

      const data = await response.json();

      setLikes((prevLikes) => ({
        ...prevLikes,
        [commentId]: data.likes,
      }));
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislikes = async (commentId: number, commenterId: string) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("Please log in to dislike comments.");
        return;
      }

      const response = await fetch(
        `https://localhost:7197/api/User/dislikeComment/${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updatePoints(commenterId, -1, "User");
      if (!response.ok) {
        const errorMessage = await response.text();
        alert(errorMessage);
        return;
      }

      const data = await response.json();

      setDislikes((prevDislikes) => ({
        ...prevDislikes,
        [commentId]: data.dislikes,
      }));
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;

    const token = getAuthToken();
    if (!token) {
      alert("You must be logged in to delete comments.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7197/api/User/deleteComment/${commentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await updatePoints(currentUser.id, -5, "User");
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
      parentCommentId: null,
      threadId: 0,
    };

    try {
      const response = await fetch(
        `https://localhost:7197/api/User/createComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...commentDto,
            commenterId: currentUser.id,
          }),
        }
      );
      await updatePoints(currentUser.id, 5, "User");
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

    const parentComment = comments.find(
      (comment) => comment.commentId === parentCommentId
    );
    if (!parentComment) {
      alert("Parent comment not found.");
      return;
    }

    const replyDto: Omit<CommentDTO, "commenterId" | "commentId"> = {
      bookId,
      commentMessage: replyMessage,
      parentCommentId,
      threadId: parentComment.threadId || parentComment.commentId,
    };

    try {
      const response = await fetch(
        `https://localhost:7197/api/User/createComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...replyDto,
            commenterId: currentUser.id,
          }),
        }
      );

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

  const findParentCommenterId = (threadId: number): string | null => {
    const parentComment = comments.find(
      (comment) => comment.commentId === threadId
    );
    return parentComment ? parentComment.commenterId : null;
  };

  const renderComments = () => {
    return comments
      .filter((comment) => comment.threadId === comment.commentId)
      .map((comment) => {
        const replies = nestedComments[comment.commentId] || [];
        const isExpanded = expandedComments.has(comment.commentId);
        const ratingKey: any = `${comment.bookId}_${comment.commenterId}`;

        return (
          <div key={comment.commentId} className="comment">
            <div className="content">
              {editingComment === comment.commentId ? (
                <div>
                  <textarea
                    className="edit-comment-textarea"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                  />
                  <button
                    className="save-comment-button"
                    onClick={() => handleEditComment(comment.commentId)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-edit-button"
                    onClick={() => setEditingComment(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <p>
                    <strong>
                      {usernames[comment.commenterId] || "Loading..."}
                    </strong>
                    : <br />
                    <span className="commentMessage">
                      {comment.commentMessage}
                    </span>
                  </p>
                  <div className="ratings">
                    {readerRatings[ratingKey] && (
                      <div className="reader-rating">
                        <StarRating rating={readerRatings[ratingKey]} />
                      </div>
                    )}
                    {criticRatings[ratingKey] && (
                      <div className="critic-rating">
                        <span>Critic Rating:</span>
                        <StarRating rating={criticRatings[ratingKey]} />
                      </div>
                    )}
                  </div>
                  <div className="like-dislike">
                    <button
                      onClick={() =>
                        handleLikes(comment.commentId, comment.commenterId)
                      }
                    >
                      ↑ {likes[comment.commentId] ?? comment.likes}
                    </button>
                    <button
                      onClick={() =>
                        handleDislikes(comment.commentId, comment.commenterId)
                      }
                    >
                      ↓ {dislikes[comment.commentId] ?? comment.dislikes}
                    </button>
                  </div>
                  <div className="actions">
                    <button
                      className="reply-button"
                      onClick={() => setParentCommentId(comment.commentId)}
                    >
                      Reply
                    </button>
                    {currentUser.id === comment.commenterId && (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => setEditingComment(comment.commentId)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteComment(comment.commentId)}
                        >
                          Delete
                        </button>
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
                      <button
                        className="submit-reply-button"
                        onClick={() => handleCreateReply(comment.commentId)}
                      >
                        Submit Reply
                      </button>
                      <button
                        className="cancel-reply-button"
                        onClick={() => setParentCommentId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="replies">
                    {(isExpanded ? replies : replies.slice(0, 1)).map(
                      (reply) => {
                        const replyRatingKey: any = `${reply.bookId}_${reply.commenterId}`; // Egyedi kulcs a reply-hez
                        const parentCommenterId = findParentCommenterId(
                          reply.threadId
                        );
                        const parentUsername = parentCommenterId
                          ? usernames[parentCommenterId] || "Loading..."
                          : "Unknown";

                        return (
                          <div
                            key={reply.commentId}
                            className="reply"
                            style={{ marginLeft: 20 }}
                          >
                            <div>
                              <div>
                                <p>
                                  <strong>
                                    {usernames[reply.commenterId] ||
                                      "Loading..."}
                                  </strong>
                                  : @<strong>{parentUsername}</strong>
                                  <br />
                                  {!editingComment ||
                                  editingComment !== reply.commentId ? (
                                    <span className="commentMessage">
                                      {reply.commentMessage}
                                    </span>
                                  ) : null}
                                </p>
                                <div className="ratings">
                                  {readerRatings[replyRatingKey] && (
                                    <div className="reader-rating">
                                      <StarRating
                                        rating={readerRatings[replyRatingKey]}
                                      />
                                    </div>
                                  )}
                                  {criticRatings[replyRatingKey] && (
                                    <div className="critic-rating">
                                      <StarRating
                                        rating={criticRatings[replyRatingKey]}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {editingComment === reply.commentId && (
                                <div>
                                  <textarea
                                    className="edit-comment-textarea"
                                    value={editedMessage}
                                    onChange={(e) =>
                                      setEditedMessage(e.target.value)
                                    }
                                  />
                                  <button
                                    className="save-comment-button"
                                    onClick={() =>
                                      handleEditComment(reply.commentId)
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="cancel-edit-button"
                                    onClick={() => setEditingComment(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="like-dislike">
                              <button
                                onClick={() =>
                                  handleLikes(
                                    reply.commentId,
                                    reply.commenterId
                                  )
                                }
                              >
                                ↑ {likes[reply.commentId] ?? reply.likes}
                              </button>
                              <button
                                onClick={() =>
                                  handleDislikes(
                                    reply.commentId,
                                    reply.commenterId
                                  )
                                }
                              >
                                ↓ {dislikes[reply.commentId] ?? reply.dislikes}
                              </button>
                            </div>

                            <div className="actions">
                              <>
                                {!editingComment ||
                                editingComment !== reply.commentId ? (
                                  <>
                                    <button
                                      className="reply-button"
                                      onClick={() =>
                                        setParentCommentId(reply.commentId)
                                      }
                                    >
                                      Reply
                                    </button>
                                    {currentUser.id === reply.commenterId && (
                                      <div>
                                        <button
                                          className="edit-button"
                                          onClick={() => {
                                            setEditingComment(reply.commentId);
                                            setEditedMessage(
                                              reply.commentMessage
                                            );
                                          }}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          className="delete-button"
                                          onClick={() =>
                                            handleDeleteComment(reply.commentId)
                                          }
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </>
                                ) : null}
                              </>
                            </div>
                            {parentCommentId === reply.commentId && (
                              <div className="reply-container">
                                <textarea
                                  className="reply-textarea"
                                  value={replyMessage}
                                  onChange={(e) =>
                                    setReplyMessage(e.target.value)
                                  }
                                />
                                <button
                                  className="submit-reply-button"
                                  onClick={() =>
                                    handleCreateReply(reply.commentId)
                                  }
                                >
                                  Submit Reply
                                </button>
                                <button
                                  className="cancel-reply-button"
                                  onClick={() => setParentCommentId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}

                    {replies.length > 1 && !isExpanded && (
                      <button
                        className="expand-button"
                        onClick={() =>
                          setExpandedComments((prev) =>
                            new Set(prev).add(comment.commentId)
                          )
                        }
                      >
                        ...szó, szót követ
                      </button>
                    )}
                    {isExpanded && replies.length > 1 && (
                      <button
                        className="collapse-button"
                        onClick={() =>
                          setExpandedComments((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(comment.commentId);
                            return newSet;
                          })
                        }
                      >
                        Visszazárás
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      });
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
      <button className="submit-comment-button" onClick={handleCreateComment}>
        <strong>Submit</strong>
      </button>
    </div>
  );
};

export default Comments;
