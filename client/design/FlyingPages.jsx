'use client';

import React, { useEffect, useRef } from 'react';
import './FlyingPages.css';

// Component for animated falling pages on screen edges
const FlyingPages = ({ count = 6 }) => {
  // Store references to DOM elements
  const pageRefs = useRef([]);

  useEffect(() => {
    // Initialize pages assigned to either left or right sides
    const pagesData = Array.from({ length: count }).map(() => {
      const isLeft = Math.random() > 0.5;
      const startX = isLeft 
        ? Math.random() * (window.innerWidth * 0.22)
        : window.innerWidth * 0.78 + Math.random() * (window.innerWidth * 0.22);

      return {
        x: startX,
        y: (Math.random() * window.innerHeight) - window.innerHeight,
        // Vertical falling speed
        baseVy: Math.random() * 1.5 + 1.5,
        vy: Math.random() * 1.5 + 1.5,
        vx: 0,
        side: isLeft ? 'left' : 'right',
        // Sway animation properties
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.008 + 0.005,
        swayAmount: Math.random() * 40 + 20,
      };
    });

    let mouseX = -1000;
    let mouseY = -1000;
    let animationFrameId;

    // Track mouse movement for wind interaction
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Main animation loop
    const animate = () => {
      pagesData.forEach((page, i) => {
        const dx = page.x - mouseX;
        const dy = page.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Push page if mouse is near
        if (dist < 150) {
          const force = (150 - dist) / 150;
          page.vx += (dx / dist) * force * 0.5;
          page.vy += (dy / dist) * force * 0.5;
        }

        // Dampen horizontal speed
        page.vx *= 0.92;
        // Return to base vertical speed
        page.vy += (page.baseVy - page.vy) * 0.05;

        // Apply movement and sway phase
        page.swayPhase += page.swaySpeed;
        page.x += page.vx;
        page.y += page.vy;

        // Constrain movement strictly to the assigned side
        if (page.side === 'left') {
          if (page.x > window.innerWidth * 0.22) page.x = -60;
          if (page.x < -60) page.x = window.innerWidth * 0.22;
        } else {
          if (page.x < window.innerWidth * 0.78) page.x = window.innerWidth + 60;
          if (page.x > window.innerWidth + 60) page.x = window.innerWidth * 0.78;
        }

        const displayX = page.x + Math.sin(page.swayPhase) * page.swayAmount;
        
        // Calculate gentle 3D tilt
        const rotZ = Math.sin(page.swayPhase) * 15;
        const rotX = Math.cos(page.swayPhase) * 5 + 15;

        // Reset page at the top when it falls out of view
        if (page.y > window.innerHeight + 80) {
          page.y = -80;
          page.x = page.side === 'left'
            ? Math.random() * (window.innerWidth * 0.22)
            : window.innerWidth * 0.78 + Math.random() * (window.innerWidth * 0.22);
          page.vx = 0;
        }

        // Render transforms to the DOM element
        const el = pageRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${displayX}px, ${page.y}px, 0) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count]);

  return (
    <div className="flying-pages-container">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (pageRefs.current[i] = el)}
          className="page-element"
        ></div>
      ))}
    </div>
  );
};

export default FlyingPages;