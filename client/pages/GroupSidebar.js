'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '../src/app/styles/GroupSidebar.css';

export default function GroupSidebar({ userId }) {
    const [groups, setGroups] = useState([]);
    const [myGroupIds, setMyGroupIds] = useState([]);

    useEffect(() => {
        fetchAllGroups();
        fetchMyGroups();
    }, []);

    const fetchMyGroups = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/groups/user/${userId}`);
            setMyGroupIds(data.map((g) => g._id));
        } catch (err) {
            console.error('Failed to fetch user groups:', err);
        }
    };

    const fetchAllGroups = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/groups');
            setGroups(data);
        } catch (err) {
            console.error('Failed to fetch all groups:', err);
        }
    };

    const handleFollowToggle = async (groupId) => {
        const isFollowing = myGroupIds.includes(groupId);
        try {
            if (isFollowing) {
                await axios.post(`http://localhost:5000/api/groups/${groupId}/unfollow`, { userId });
                setMyGroupIds((prev) => prev.filter((id) => id !== groupId));
                setGroups((prev) =>
                    prev.map((g) =>
                        g._id === groupId ? { ...g, members: g.members.filter((id) => id !== userId) } : g
                    )
                );
            } else {
                await axios.post(`http://localhost:5000/api/groups/${groupId}/follow`, { userId });
                setMyGroupIds((prev) => [...prev, groupId]);
                setGroups((prev) =>
                    prev.map((g) =>
                        g._id === groupId ? { ...g, members: [...g.members, userId] } : g
                    )
                );
            }
        } catch (err) {
            console.error('Failed to toggle follow:', err);
        }
    };

    return (
        <div className="group-sidebar">
            <h3 className="section-title">🌐 Discover Groups</h3>
            <ul className="group-list">
                {groups.map((group) => {
                    const isFollowing = myGroupIds.includes(group._id);
                    return (
                        <li key={group._id} className="group-card">
                            <div className="group-card-info">
                                <img
                                    src={group.photo?.url || "/images/group-default.png"}
                                    className="group-avatar"
                                    alt="group"
                                />
                                <div>
                                    <Link href={`/group/${group._id}`} className="group-name-link">
                                        @{group.name}
                                    </Link>
                                    <p className="group-members">👥 {group.members.length} members</p>
                                </div>
                            </div>

                            <button
                                className={`follow-btn ${isFollowing ? 'unfollow' : 'follow'}`}
                                onClick={() => handleFollowToggle(group._id)}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}