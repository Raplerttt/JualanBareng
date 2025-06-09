import React from 'react';

const MetricCard = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <div className="flex items-end mt-2">
            <span className="text-2xl font-bold">{value}</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {change}
            </span>
          </div>
        </div>
        <div className="text-2xl bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;