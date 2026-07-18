'use client';

import { useEffect, useState } from 'react';
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

export default function StatsPage() {
    const [postStats, setPostStats] = useState([]);
    const [userStats, setUserStats] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/posts/stats')
            .then((res) => res.json())
            .then((json) => setPostStats(json))
            .catch((err) => console.error('❌ Error fetching post stats:', err));

        fetch('http://localhost:5000/api/users/stats')
            .then((res) => res.json())
            .then((json) => setUserStats(json))
            .catch((err) => console.error('❌ Error fetching user stats:', err));
    }, []);

    return (
        <div className="p-6 bg-white rounded-xl shadow-xl mt-6 max-w-5xl mx-auto space-y-12">
            <h1 className="text-3xl font-bold text-center mb-8">Statictes report</h1>

            <div>
                <h2 className="text-xl font-semibold text-center mb-4">New posts by day</h2>
                <ResponsiveContainer width="80%" height={300}>
                    <LineChart data={postStats}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" strokeWidth={4} dataKey="count" stroke="#1DA1F2" name="Posts" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-center mb-4">New Users by the day</h2>
                <ResponsiveContainer width="80%" height={300}>
                    <BarChart data={userStats} barSize={85} >
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#17b7e8ff" name="new users" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
