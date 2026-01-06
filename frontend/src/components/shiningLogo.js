"use client";
import React from "react";

const ShiningLogo = ({ className = "", duration = 4 }) => {
    return (
        <div className={`relative ${className}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes logo-shine {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .logo-shine-effect {
            background: linear-gradient(110deg, #002B50 35%, #FFFFFF 50%, #002B50 75%, #002B50);
            background-size: 200% 100%;
            -webkit-mask: url(/logo.svg) no-repeat center;
            mask: url(/logo.svg) no-repeat center;
            -webkit-mask-size: contain;
            mask-size: contain;
            animation: logo-shine ${duration}s linear infinite;
          }
        `
            }} />
            <div className="logo-shine-effect w-full h-full" />
        </div>
    );
};

export default ShiningLogo;
