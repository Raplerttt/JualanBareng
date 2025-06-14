import React from 'react';

const SettingSection = ({ title, description, children }) => {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default SettingSection;