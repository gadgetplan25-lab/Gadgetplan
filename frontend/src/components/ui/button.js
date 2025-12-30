import React from 'react';

export function Button({ className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
