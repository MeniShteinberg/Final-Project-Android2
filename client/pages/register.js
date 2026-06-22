'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import GradientText from '../design/GradientText';
import '../src/app/styles/RegisterPage.css';

export default function RegisterPage() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    photo: null,
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setUserInfo({ ...userInfo, photo: files[0] });
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData();
      for (let key in userInfo) {
        formData.append(key, userInfo[key]);
      }

      const { data } = await axios.post(
        'http://localhost:5000/api/users/register',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      alert('Registration successful');
      router.push('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    window.location.href = "/"; 
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <GradientText
            colors={['#00ff40ff', '#6a00ffff']}
            className="text-4xl font-bold"
          >
            Register
          </GradientText>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={userInfo.name}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={userInfo.username}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={userInfo.email}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={userInfo.password}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="register-input"
        />

        {error && <p className="register-error">{error}</p>}

        <button type="submit" className="register-button">
          Register
        </button>

        <button type="button" className="register-Return" onClick={handleLogout}>
          Return
        </button>
        
      </form>
    </div>
  );
}
