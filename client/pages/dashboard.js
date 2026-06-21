'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AddPost from './AddPost.js';
import PostCard from './PostCard.js';
import axios from 'axios';
import '../src/app/styles/dashboard.css';
import Dock from "../design/Dock";
import CreateGroup from './CreateGroup';
import GroupList from './GroupList';
import GroupSidebar from './GroupSidebar';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeSorts, setActiveSorts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByNameAsc, setSortByNameAsc] = useState(true);
  const [sortByLengthAsc, setSortByLengthAsc] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      fetchFullUser(parsed._id);
    }
  }, []);

  const fetchFullUser = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/users/${userId}`);
      const updatedUser = data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      fetchFeed(updatedUser._id);
      fetchUsers(updatedUser);
    } catch (err) {
      console.error('❌ Failed to fetch full user:', err);
    }
  };

  const fetchFeed = async (userId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/feed/${userId}`);
      setPosts(data);
    } catch (err) {
      console.error('Failed to load feed:', err);
    }
  };

  const fetchUsers = async (currentUser) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/users`);
      const followingIds = currentUser.following?.map((u) =>
        typeof u === 'object' ? u._id.toString() : u.toString()
      ) || [];

      const filtered = data.users.filter(
        (u) => u._id !== currentUser._id && !followingIds.includes(u._id.toString())
      );

      setAllUsers(filtered);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleFollow = async (friendUsername) => {
    try {
      await axios.post('http://localhost:5000/api/users/add-friend', {
        myId: user._id,
        friendUsername,
      });
      fetchFullUser(user._id);
    } catch (err) {
      if (err.response?.status === 400) {
        alert('You already follow this user');
      } else {
        console.error('Failed to follow:', err);
      }
    }
  };

  const updatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const toggleSort = (criterion) => {
    setActiveSorts((prev) =>
      prev.includes(criterion)
        ? prev.filter((c) => c !== criterion)
        : [...prev, criterion]
    );
  };

  const filteredUsers = allUsers
    .filter(
      (u) =>
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        u._id !== user._id
    )
    .sort((a, b) => {
      for (const criterion of activeSorts) {
        if (criterion === 'followers') {
          const diff = (b.followers?.length || 0) - (a.followers?.length || 0);
          if (diff !== 0) return diff;
        }
        if (criterion === 'name') {
          const nameA = a.username?.toLowerCase() || '';
          const nameB = b.username?.toLowerCase() || '';
          const diff = sortByNameAsc
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
          if (diff !== 0) return diff;
        }
        if (criterion === 'length') {
          const lenA = a.username?.length || 0;
          const lenB = b.username?.length || 0;
          const diff = sortByLengthAsc ? lenA - lenB : lenB - lenA;
          if (diff !== 0) return diff;
        }
      }
      return 0;
    });

  if (!user) return <p>Loading...</p>;

  const items = [
    {
      icon: <img src="/images/home.png" alt="Home" style={{ width: 30, height: 30 }} />,
      label: "Dashboard",
      onClick: () => router.push("/dashboard"),
    },
    {
      icon: <img src="/images/profile-user.png" alt="Home" style={{ width: 30, height: 30 }} />,
      label: "Profile",
      onClick: () => router.push(`/profile/${user._id}`),
    },
    {
      icon: <img src="/images/logout.png" alt="Home" style={{ width: 30, height: 30 }} />,
      label: "Logout",
      onClick: () => {
        localStorage.removeItem("user");
        router.push("/login");
      },
    },
  ];

  return (
    <>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>

      <div className="dashboard-container">
        <aside className="sidebar">
          <h3 className="section-title">🔍 Find People</h3>
          <input
            type="text"
            placeholder="Search by username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
          />

          <div className="sort-buttons">
            <button
              className={`sort-btn ${activeSorts.includes('followers') ? 'active' : ''}`}
              onClick={() => toggleSort('followers')}
            >
              Sort by Followers
            </button>
            <button
              className={`sort-btn ${activeSorts.includes('name') ? 'active' : ''}`}
              onClick={() => {
                toggleSort('name');
                setSortByNameAsc((prev) => !prev);
              }}
            >
              Sort by Name ({sortByNameAsc ? 'A → Z' : 'Z → A'})
            </button>
            <button
              className={`sort-btn ${activeSorts.includes('length') ? 'active' : ''}`}
              onClick={() => {
                toggleSort('length');
                setSortByLengthAsc((prev) => !prev);
              }}
            >
              Sort by Length ({sortByLengthAsc ? 'Long → Short' : 'Short → Long'})
            </button>
          </div>

          <ul className="user-list">
            {filteredUsers.map((u) => (
              <li key={u._id} className="user-item">
                <div className="user-info">
                  <img
                    src={u?.photo?.url || "/default.png"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default.png";
                    }}
                    alt="profile"
                    className="avatar"
                  />
                  <div>
                    <a href={`/profile/${u._id}`} className="link">
                      @{u.username}
                    </a>
                    <p className="user-followers">👥 {u.followers?.length || 0} followers</p>
                  </div>
                </div>
                <button className="follow-btn" onClick={() => handleFollow(u.username)}>
                  Follow
                </button>
              </li>
            ))}
          </ul>
          <div className="group-creator">
            <h3 className="section-title">➕ Create Group</h3>
            <CreateGroup userId={user._id} onGroupCreated={() => { }} />
          </div>
          <GroupSidebar userId={user._id} />

        </aside>

        <main className="main">
          <h1 className="welcome">Welcome, {user.name}</h1>

          <AddPost userId={user._id} onPostAdded={() => fetchFeed(user._id)} />

          <h2 className="section-title">📰 Your Feed</h2>
          {posts.length === 0 ? (
            <p className="no-posts">No posts to show yet</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user._id}
                onUpdate={updatePost}
                onRefresh={() => fetchFeed(user._id)}
              />
            ))
          )}
        </main>
      </div>
    </>
  );

}
