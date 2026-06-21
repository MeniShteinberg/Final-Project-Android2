'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import GroupCard from './GroupCard';

export default function GroupList({ userId }) {
    const [groups, setGroups] = useState([]);

    const fetchGroups = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/groups/user/' + userId);
            setGroups(res.data);
        } catch (err) {
            console.error('Error fetching groups', err);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <div>
            <h2>Your Groups</h2>
            {groups.map((group) => (
                <GroupCard key={group._id} group={group} userId={userId} onFollow={fetchGroups} />
            ))}
        </div>
    );
}
