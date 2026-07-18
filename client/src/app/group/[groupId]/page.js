'use client';
// Load the group page dependencies.
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddPost from '../../../../pages/AddPost';
import PostCard from '../../../../pages/PostCard';

import '../../styles/group.css';

// Render the group detail page and its posts.
export default function GroupPage() {
    // Keep the current group and user state in local state.
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        if (groupId) {
            fetchGroupData();
            fetchGroupPosts();
        }
    }, [groupId]);

    // Fetch the group details from the backend.
    const fetchGroupData = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
            setGroup(data);
        } catch (err) {
            console.error('Failed to fetch group:', err);
        }
    };

    // Fetch the posts belonging to the current group.
    const fetchGroupPosts = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/groups/${groupId}/posts`);
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch group posts:', err);
        }
    };

    // Update a post locally after an edit response arrives.
    const updatePost = (updated) => {
        setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    };


    // Join the current group and refresh its member list.
    const handleJoinGroup = async () => {
        try {
            await axios.post(`http://localhost:5000/api/groups/${group._id}/follow`, {
                userId: user._id,
            });

            setGroup((prev) => ({
                ...prev,
                members: [...prev.members, user._id],
            }));
        } catch (err) {
            console.error('Failed to join group:', err);
        }
    };

    if (!group) return <p>Loading group...</p>;

    const isMember = group.members.includes(user?._id);

    // Render the group page layout and post feed.
    return (
        <div className="group-container">
            <div className="group-header">
                <img src={group.photo?.url || '/default.png'} alt="group" className="group-photo" />
                <div className="group-info">
                    <h1>
                        {group.name}
                        <button className="return-btn" onClick={() => window.history.back()}>
                            X
                        </button>
                    </h1>
                    <p>{group.description}</p>
                    <p><strong>Category:</strong> {group.category}</p>
                    <p><strong>Members:</strong> {group.members.length}</p>

                    {!isMember && (
                        <button className="follow-btn" onClick={handleJoinGroup}>
                            Follow Group
                        </button>
                    )}
                </div>
            </div>

            {isMember && (
                <div className="post-form-wrapper">
                    <AddPost userId={user._id} groupId={group._id} onPostAdded={fetchGroupPosts} />
                </div>
            )}

            <h2 className="group-section-title">📢 Group Posts</h2>
            {posts.length === 0 ? (
                <p>No posts in this group yet.</p>
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                        currentUserId={user._id}
                        onUpdate={updatePost}
                        onRefresh={fetchGroupPosts}
                    />
                ))
            )}
        </div>
    );
}