import React, { useState, useEffect, useRef } from 'react';
import './TypewriterText.css';

// Render text with a typing animation effect.
const TypewriterText = ({ children, speed = 100, className = '' }) => {
  // Fallback to default text if children is not a string
  const fullText = typeof children === 'string' ? children : 'PageTurners';
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Begin the typing animation from the current text state.
  const startTyping = () => {
    setIsTyping(true);
    setDisplayedText(''); 
    let currentIndex = 0;

    // Clear previous timeout to prevent animation glitches
    clearTimeout(typingTimeoutRef.current);

    const typeChar = () => {
      if (currentIndex < fullText.length) {
        // Append the next character
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        // Schedule the next character
        typingTimeoutRef.current = setTimeout(typeChar, speed);
      } else {
        setIsTyping(false); 
      }
    };

    typeChar();
  };

  // Run typing animation on initial mount.
  useEffect(() => {
    startTyping();
    // Cleanup timeout on unmount
    return () => clearTimeout(typingTimeoutRef.current);
  }, [fullText, speed]);

  // Restart animation on hover, only if not currently typing.
  const handleMouseEnter = () => {
    if (!isTyping) {
      startTyping();
    }
  };

  // Render the animated text container and cursor.
  return (
    <div 
      className={`typewriter-container ${className}`} 
      onMouseEnter={handleMouseEnter}
    >
      <span className="typewriter-text">{displayedText}</span>
      {/* Cursor element changes class based on typing state */}
      <span className={`typewriter-cursor ${isTyping ? 'typing' : 'idle'}`}>|</span>
    </div>
  );
};

export default TypewriterText;