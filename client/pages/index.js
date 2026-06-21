'use client';
import { useRouter } from 'next/router';
import GlitchText from '../design/GlitchText';
import '../src/app/styles/index.css'; 

export default function Home() {
  const router = useRouter();

  return (
    <div className="home-container">
      <GlitchText
        speed={1}
        enableShadows={true}
        enableOnHover={true}
        className="home-title"
      >
        Echosphere
      </GlitchText>

      <p className="home-subtitle">Share your story with the world</p>

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
