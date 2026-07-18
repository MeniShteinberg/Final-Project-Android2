'use client';

// Load the profile page dependencies.
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import PostCard from '../../../../pages/PostCard';
import '../../styles/stylesforpage.css';

// Render the user profile page with posts and profile details.
export default function ProfilePage() {
  // Track navigation and the current profile context.
  const router = useRouter();
  const params = useParams();
  const userId = params.userId;
  // Keep the profile data and current user id in state.
  const [profileData, setProfileData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Load the selected profile and the logged-in user on mount.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/users/${userId}/profile`);
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      const parsed = JSON.parse(loggedUser);
      setCurrentUserId(parsed._id);
    }

    if (userId) fetchProfile();
  }, [userId]);

  // Show a loading message until the profile data is available.
  if (!profileData) {
    return <div className="profile-loading">Loading Profile please wait.....</div>;
  }

  const { user, followersCount, followingCount, posts } = profileData;

  // Render the profile header, stats, and posts.
  return (
    <div className="profile-container">
      <div className="top-bar">
        <button className="nav-btn" onClick={() => router.push('/dashboard')}>Dashboard</button>
      </div>
      <div className="cover-image"></div>

      <div className="profile-content">
        <div className="profile-header">
          <img
            src={user?.photo?.url || '/default.png'}
            alt="avatar"
            className="profile-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default.png';
            }}
          />
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p className="username">@{user.username}</p>
            <div className="stats">
              <span>{followingCount} Following</span>
              <span>{followersCount} Followers</span>
            </div>
            {currentUserId && currentUserId !== user._id && (
              <a href={`/message/${user._id}`} className="chat-btn">
                send message
              </a>
            )}
            {String(currentUserId) === String(user._id) && (
              <button
                onClick={() => router.push('/EditProfile')}
                style={{
                  marginTop: '0.5rem',
                  padding: '6px 12px',
                  backgroundColor: 'none',
                  color: 'black',
                  border: 'black',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                ✏️ Edit
              </button>
            )}
          </div>
        </div>

        <hr />

        <div className="profile-posts">
          <h3>Posts</h3>
          {posts.length === 0 ? (
            <p>This user does not have any posts yet</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUserId}
                onRefresh={() => {
                  axios
                    .get(`http://localhost:5000/api/users/${userId}/profile`)
                    .then(({ data }) => setProfileData(data));
                }}
                onUpdate={(updatedPost) => {
                  setProfileData((prev) => ({
                    ...prev,
                    posts: prev.posts.map((p) =>
                      p._id === updatedPost._id ? updatedPost : p
                    ),
                  }));
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
