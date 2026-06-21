'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import GradientText from '../design/GradientText';
import '../src/app/styles/loginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      const user = data.user;
      localStorage.setItem('user', JSON.stringify(user));

      if (user.username === 'admin123' && user.email === 'admin123@gmail.com') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <GradientText
            colors={['#14f54cff', '#c739d4ff']}
            className="text-4xl font-bold"
          >
            Login
          </GradientText>
        </div>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}
