'use client';
import { useRouter } from 'next/router';
import TypewriterText from '../design/TypewriterText';
import '../src/app/styles/index.css'; 

export default function Home() {
  const router = useRouter();

  return (
    <div className="home-container">
      <TypewriterText
        speed={80}
        enableShadows={true}
        enableOnHover={true}
        className="home-title"
      >
        PageTurners
      </TypewriterText>

      <p className="home-subtitle">Discover Your Next Chapter</p>

      <div className="home-button-container">
        <button className="home-button" onClick={() => router.push("/login")}>
          Login
        </button>
        <button className="home-button" onClick={() => router.push("/register")}>
          Register
        </button>
      </div>
    </div>
  );
}
