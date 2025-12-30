import React from 'react';

export function Label({ className = '', children, ...props }) {
  return (
    <label className={`block mb-1 font-semibold text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  );
}
