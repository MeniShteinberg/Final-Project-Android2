'use client';
import axios from 'axios';
import Link from 'next/link';
import '../src/app/styles/GroupCard.css';

export default function GroupCard({ group, userId, onFollow, isMember }) {
    const handleFollow = async () => {
        try {
            await axios.post(`http://localhost:5000/api/groups/${group._id}/follow`, { userId });
            onFollow(); 
        } catch (err) {
            alert('Error following group');
            console.error(err);
        }
    };

    return (
        <div className="group-card">
            <div className="group-card-info">
                <img
                    src={group.photo?.url || "/images/group-default.png"}
                    alt="group"
                    className="group-avatar"
                />
                <div>
                    <Link href={`/group/${group._id}`} className="group-name-link">
                        @{group.name}
                    </Link>
                    <p className="group-members">👥 {group.members.length} members</p>
                </div>
            </div>
            {!isMember && (
                <button className="follow-btn" onClick={handleFollow}>
                    Follow
                </button>
            )}
        </div>
    );
}
