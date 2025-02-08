// src/components/ui/card.jsx
import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`bg-red rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export { Card, CardContent };
