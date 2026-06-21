"use client";
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function PostCard({ post, currentUserId, onUpdate, onRefresh, isAdmin = false }) {
  if (!post || !post.postedBy) return null;

  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const isMyPost = post.postedBy && currentUserId === post.postedBy._id;

  const handleLike = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/like`,
        { userId: currentUserId }
      );
      onRefresh(data);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/api/posts/${post._id}/comment`,
        { userId: currentUserId, text: comment }
      );
      setComment('');
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const handleEdit = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/posts/${post._id}`,
        {
          content: editedContent,
          userId: currentUserId,
        }
      );
      onUpdate(data);
      setIsEditing(false);
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`, {
        data: { userId: currentUserId },
      });
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/remove-friend', {
        myId: currentUserId,
        friendId: post.postedBy._id,
      });
      if (typeof onRefresh === 'function') {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to unfollow:', err);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <img
          src={post.postedBy?.photo?.url || '/default.png'}
          alt="profile"
          style={styles.avatar}
        />

        <div style={{ flexGrow: 1 }}>
          <Link href={`/profile/${post.postedBy._id}`} style={{ textDecoration: 'none', color: '#000' }}>
            <strong style={{ cursor: 'pointer' }}>
              {post.postedBy?.name || 'Unknown'}
            </strong>
            <span style={{ fontSize: '0.9rem', color: '#555', marginLeft: '4px' }}>
              @{post.postedBy?.username}
            </span>
          </Link>
        </div>

        {!isMyPost && (
          <button onClick={handleUnfollow} style={styles.unfollowBtn}>
            Unfollow 
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={styles.textarea}
          />
          <button onClick={handleEdit} style={styles.smallBtn}>
            Save
          </button>
        </>
      ) : (
        <>
          <p style={styles.content}>{post.content}</p>

          {post.photo?.url && (
            <img src={post.photo.url} alt="Post" style={styles.postImage} />
          )}
        </>
      )}

      <div style={styles.separator} />

      <div style={styles.actions}>
        <button onClick={handleLike} style={styles.iconBtn}>
          <img src="/images/like.png" alt="Like" style={styles.iconImage} />
          {post.likes.length}
        </button>

        {(isMyPost || isAdmin) && (
          <>
            {isMyPost && (
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                style={styles.iconBtn}
              >
                <img src="/images/edit.png" alt="Edit" style={styles.iconImage} />
              </button>
            )}
            <button onClick={handleDelete} style={styles.iconBtn}>
              <img src="/images/delete.png" alt="Delete" style={styles.iconImage} />
            </button>
          </>
        )}
      </div>

      <div style={styles.separator} />

      <div style={styles.commentSection}>
        {post.comments.map((c, idx) => (
          <div key={idx} style={styles.comment}>
            <strong>{c.postedBy?.username || c.postedBy?.name || 'user'}:</strong> {c.text}
          </div>
        ))}
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          style={styles.input}
        />
        <button onClick={handleComment} style={styles.iconBtn}>
          <img src="/images/send.png" alt="Send" style={styles.iconImage} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffffcc',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  content: {
    marginBottom: '1rem',
    fontSize: '1rem',
  },
  postImage: {
    maxWidth: '100%',
    borderRadius: '8px',
    marginTop: '10px',
    marginBottom: '1rem',
  },
  iconBtn: {
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  iconImage: {
    width: '20px',
    height: '20px',
  },
  textarea: {
    width: '100%',
    height: '80px',
    marginBottom: '0.5rem',
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  smallBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.9rem',
    background: '#ffffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  unfollowBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.9rem',
    background: '#e7a012ff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#000',
    fontWeight: 'bold',
  },
  commentSection: {
    marginTop: '0.5rem',
  },
  comment: {
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  input: {
    width: '25%',
    padding: '0.4rem 0.8rem',
    marginTop: '0.25rem',
    marginBottom: '0.5rem',
    borderRadius: '6px',
    border: '3px solid #ccc',
  },
  separator: {
    height: '1px',
    backgroundColor: '#333',
    opacity: 0.3,
    margin: '10px 0',
  },
};
