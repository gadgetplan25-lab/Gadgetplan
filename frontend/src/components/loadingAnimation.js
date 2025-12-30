"use client";
import React from "react";

const LoadingAnimation = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="relative flex flex-col items-center">
        <img
          src="/gadged.svg"
          alt="Gadget"
          className="w-[120px] xs:w-[150px] sm:w-[180px] md:w-[220px] lg:w-[280px] h-auto object-contain animate-leftIn"
        />
        <img
          src="/plan.svg"
          alt="Plan"
          className="w-[120px] xs:w-[150px] sm:w-[180px] md:w-[220px] lg:w-[280px] h-auto object-contain -mt-3 xs:-mt-4 sm:-mt-5 md:-mt-6 animate-rightIn"
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;