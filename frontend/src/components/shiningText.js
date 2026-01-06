"use client";
import React, { useState, useEffect } from "react";

const ShiningText = ({ text, className = "", duration = 4 }) => {
  const [animationId, setAnimationId] = useState("shimmer-default");

  useEffect(() => {
    // Generate unique ID only on client-side to avoid hydration mismatch
    setAnimationId(`shimmer-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ${animationId} {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `
      }} />
      <span
        className={className}
        style={{
          background: 'linear-gradient(110deg, #002B50 35%, #FDFEFF 50%, #002B50 75%, #002B50)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          animation: `${animationId} ${duration}s linear infinite`,
        }}
      >
        {text}
      </span>
    </>
  );
};

export default ShiningText;
