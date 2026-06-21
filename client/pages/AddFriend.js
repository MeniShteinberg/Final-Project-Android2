
'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function AddFriend({ userId }) {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/users", {
          command: "select",
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    fetchUsers();
  }, []);

  const handleAddFriend = async () => {
    if (!username) return;

    try {
      const res = await axios.post("http://localhost:5000/api/users/add-friend", {
        myId: userId,
        friendUsername: username,
      });

      setMessage(res.data.message);
    } catch (err) {
      console.error("Failed to add friend", err);
      setMessage(err.response?.data?.message || "Error adding friend");
    }
  };

  return (
    <div>
      <h4>Add Friend</h4>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "0.5rem",
          padding: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleAddFriend}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#39ff14",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Add
      </button>

      {message && (
        <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
          {message}
        </p>
      )}

      <hr />

      <ul>
        {users
          .filter((u) => u._id !== userId)
          .map((user) => (
            <li key={user._id}>
              <Link href={`/profile/${user._id}`}>
                <span style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
                  {user.name} (@{user.username})
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
