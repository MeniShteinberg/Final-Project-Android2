'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import PostCard from './PostCard';

export default function UserProfile() {
  const params = useParams();
  const router = useRouter();
  const { userId } = params;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/users/${userId}/profile`)
        .then((res) => setData(res.data))
        .catch((err) => console.error(err));
    }
  }, [userId]);

  if (!data) return <p>Loading profile...</p>;

  const { user, followersCount, followingCount, posts } = data;

  const handleChatClick = () => {
    router.push(`/chat/${user._id}`);
  };



  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img
          src={user.photo?.url || '/default.png'}
          alt="Profile"
          style={{ width: 60, height: 60, borderRadius: '50%' }}
        />
        <div>
          <h2>
            {user.name}{' '}
            <span style={{ fontWeight: 'normal' }}>@{user.username}</span>
          </h2>
          <p>
            {followersCount} followers • Following {followingCount}
          </p>
          <button
            onClick={handleChatClick}
            style={{
              marginTop: '0.5rem',
              padding: '6px 12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            💬 Chat with {user.name}
          </button>
        </div>
      </div>



      <h3 style={{ marginTop: '2rem' }}>Posts</h3>
      {posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUserId={user._id}
            onRefresh={() => { }}
          />
        ))
      )}
    </div>
  );
}
