"use client";
// Load the admin dashboard dependencies.
import { useState, useEffect } from "react";
import axios from "axios";
import PostCard from './PostCard';
import PostStatsChart from './PostStatsChart';

// Render the admin management dashboard for users and posts.
export default function AdminFunc() {
  // Keep the form and data state for user and post management.
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Load the current user and refresh admin data on mount.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    setLoadingUser(false);
    fetchUsers();
    fetchPosts();
  }, []);

  // Clear saved auth data and redirect to the landing page.
  const handleLogout = () => {
    localStorage.removeItem("user"); 
    window.location.href = "/"; 
  };

  // Load the user list from the backend.
  const fetchUsers = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/users", {
        command: "select",
        data: {},
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error(error);
      setMessage("Error fetching users: " + (error.response?.data?.message || error.message));
    }
  };

  // Load the post list for admin moderation.
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts/all");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  // Delete a post through the admin API.
  const deletePost = async (postId) => {
    try {
      if (!currentUser?._id) {
        alert("user not connected");
        return;
      }

      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        data: { userId: currentUser._id },
      });

      await fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error deleting post");
    }
  };

  // Send CRUD commands to the user API.
  const handleCommand = async (command, extraData = {}) => {
    try {
      if (command === "update" && newEmail && !isValidEmail(newEmail)) {
        setMessage("Invalid new email format.");
        return;
      }

      const payload =
        command === "delete"
          ? extraData
          : { name, username, email, userId, newEmail, ...extraData };

      const response = await axios.post("http://localhost:5000/api/users", {
        command,
        data: payload,
      });

      setMessage(response.data.message || "Operation completed successfully.");
      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage("Error: " + (error.response?.data?.message || error.message));
    }
  };

  // Prepare a selected user for editing.
  const handleEdit = (user) => {
    setUserId(user._id);
    setName(user.name);
    setUsername(user.username)
    setEmail(user.email);
    setNewEmail("");
    setMessage(`Editing user: ${user.name}`);
  };

  const confirmDelete = (id) => setConfirmDeleteId(id);
  const performDelete = () => {
    if (confirmDeleteId) {
      handleCommand("delete", { userId: confirmDeleteId });
      setConfirmDeleteId(null);
    }
  };
  const cancelDelete = () => setConfirmDeleteId(null);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Render the admin management UI.
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/backclean.jpg')` }}
    >
      <div className="bg-white bg-opacity-90 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10 border-b pb-4">
            <h1 className="text-4xl font-extrabold text-gray-800">
              User Management System
            </h1>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
              onClick={() => window.location.href = "/stats"}
            >
              Statistics Page
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6 bg-gray-100 p-6 rounded shadow">
            <input className="border p-2 rounded w-full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="border p-2 rounded w-full" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="border p-2 rounded w-full bg-gray-200 cursor-not-allowed" placeholder="Email" value={email} disabled />
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button className="bg-yellow-500 text-white px-5 py-2 rounded hover:bg-yellow-600" onClick={() => handleCommand("update")}>✏️ Update</button>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-blue-100 text-blue-800 border-l-4 border-blue-500 rounded">
              {message}
            </div>
          )}

          {users.length > 0 && (
            <div className="overflow-x-auto mb-10">
              <table className="min-w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-200 text-gray-700 text-left">
                  <tr>
                    <th className="py-3 px-4">👤 Name</th>
                    <th className="py-3 px-4">👤 Username</th>
                    <th className="py-3 px-4">📧 Email</th>
                    <th className="py-3 px-4">⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.username}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        {confirmDeleteId === user._id ? (
                          <div className="flex gap-2 items-center">
                            <span className="text-sm text-gray-600">ARE YOU SURE ???</span>
                            <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" onClick={performDelete}>Yes</button>
                            <button className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500" onClick={cancelDelete}>No</button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500" onClick={() => handleEdit(user)}>Edit</button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => confirmDelete(user._id)}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loadingUser &&
            currentUser?.username === "admin123" &&
            currentUser?.email === "admin123@gmail.com" && (
              <div className="w-full p-4 bg-white shadow rounded-lg overflow-y-auto max-h-[600px]">
                <h2 className="text-xl font-bold mb-4 text-right">ALL POSTS</h2>
                <div className="flex flex-col gap-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentUserId={currentUser._id}
                      onUpdate={(updatedPost) => {
                        setPosts((prev) =>
                          prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
                        );
                      }}
                      isAdmin={true}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}