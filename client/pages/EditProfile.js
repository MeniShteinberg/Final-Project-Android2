// Load the profile editing dependencies.
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../src/app/styles/loginPage.css';

// Component for the profile edit page
// Render the profile editor for the logged-in user.
export default function EditProfilePage() {
  // Router instance for navigation
  const router = useRouter();
  // State for the current logged-in user
  const [user, setUser] = useState(null);
  
  // Form input states
  // Keep the editable form values in local state.
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Load the current user data when the page opens.
  useEffect(() => {
    // Retrieve user data from local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    // Redirect to login if user is not authenticated
    if (!storedUser) {
      router.push('/login');
    } else {
      // Populate form fields with existing user data
      setUser(storedUser);
      setName(storedUser.name || '');
      setUsername(storedUser.username || '');
      setEmail(storedUser.email || '');
    }
  }, [router]);

  // Handle form submission
  // Send the updated profile information to the server.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Send update command using the required backend payload structure
      const response = await axios.post('http://localhost:5000/api/users', {
        command: 'update',
        data: {
          userId: user._id,
          name: name,
          username: username,
          email: email
        }
      });

      // Update the local storage with the new name and username to reflect immediately
      const updatedUser = { ...user, name: name, username: username };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Show success message and redirect back to profile
      setMessage('Profile updated successfully!');
      setTimeout(() => {
        router.push(`/profile/${user._id}`);
      }, 1500);

    } catch (err) {
      console.error(err);
      // Display error message from server or a default failure message
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  // Show loading state while retrieving user
  // Display a loader until the profile data is ready.
  if (!user) return <p>Loading...</p>;

  // Render the profile form UI.
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            Edit Profile
          </h2>
        </div>

        <label style={{ fontSize: '0.9rem', color: '#666', marginLeft: '5px' }}>Name</label>
        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="login-input"
        />

        <label style={{ fontSize: '0.9rem', color: '#666', marginLeft: '5px' }}>Username</label>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />

        <label style={{ fontSize: '0.9rem', color: '#666', marginLeft: '5px' }}>Email (Locked)</label>
        <input
          type="email"
          value={email}
          disabled
          className="login-input"
          style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed', color: '#6c757d' }}
        />

        {message && (
          <p className="login-error" style={{ color: message.includes('success') ? 'green' : 'red' }}>
            {message}
          </p>
        )}

        <button type="submit" className="login-button">
          Update
        </button>

        <button type="button" className="login-Return" style={{ marginTop: '10px' }} onClick={() => router.back()}>
          Return
        </button>
      </form>
    </div>
  );
}