import React from 'react';

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white rounded-xl shadow border ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return <div className={`p-4 border-b ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }) {
  return <h3 className={`text-lg font-bold ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ className = '', children, ...props }) {
  return <p className={`text-gray-600 text-sm ${className}`} {...props}>{children}</p>;
}

export function CardContent({ className = '', children, ...props }) {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
}
