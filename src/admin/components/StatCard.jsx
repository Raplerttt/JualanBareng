import React from 'react';

const StatCard = ({ title, value, change }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="flex items-end justify-between mt-2">
        <span className="text-3xl font-bold">{value}</span>
        <span className={`px-2 py-1 rounded text-sm ${
          isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default StatCard;