'use client';
// Load the home page dependencies.
import { useRouter } from 'next/router';
import TypewriterText from '../design/TypewriterText';
import '../src/app/styles/index.css'; 

// Render the landing page for the social app.
export default function Home() {
  // Track navigation for the landing page actions.
  const router = useRouter();

  // Render the landing page UI.
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
