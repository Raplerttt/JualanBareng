import React from 'react';

const TrafficSources = () => {
  const sources = [
    { name: 'Pencarian Langsung', value: 45, color: 'bg-blue-500' },
    { name: 'Media Sosial', value: 25, color: 'bg-green-500' },
    { name: 'Referensi', value: 15, color: 'bg-yellow-500' },
    { name: 'Email', value: 10, color: 'bg-purple-500' },
    { name: 'Langsung', value: 5, color: 'bg-gray-500' },
  ];

  return (
    <div>
      <div className="mb-4">
        {sources.map((source, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{source.name}</span>
              <span className="text-sm text-gray-500">{source.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${source.color} h-2 rounded-full`} 
                style={{ width: `${source.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium mb-2">Perangkat Pengguna</h3>
        <div className="flex">
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold">72%</div>
            <div className="text-sm text-gray-500">Mobile</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold">25%</div>
            <div className="text-sm text-gray-500">Desktop</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold">3%</div>
            <div className="text-sm text-gray-500">Tablet</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficSources;