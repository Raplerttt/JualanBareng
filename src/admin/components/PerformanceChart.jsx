import React from 'react';

const PerformanceChart = () => {
  // Data dummy untuk grafik
  const performanceData = {
    uptime: [99.5, 99.7, 99.9, 99.8, 99.7, 99.9, 99.8],
    responseTime: [350, 340, 330, 320, 310, 315, 320],
    errorRate: [0.6, 0.5, 0.4, 0.3, 0.4, 0.5, 0.4],
  };

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <div className="h-80">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-medium">Uptime (%)</h3>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-500">Target: 99.5%</span>
          </div>
        </div>
        <div>
          <h3 className="font-medium">Waktu Respons (ms)</h3>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-500">Target: &lt;500ms</span>
          </div>
        </div>
        <div>
          <h3 className="font-medium">Error Rate (%)</h3>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-500">Target: &lt;0.5%</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-64">
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="border-r border-gray-100 last:border-r-0"></div>
          ))}
        </div>
        
        {/* Chart Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-8">
          {[100, 80, 60, 40, 20, 0].map((percent) => (
            <div key={percent} className="flex items-center">
              <div className="w-10 text-right text-xs text-gray-400 pr-2">{percent}%</div>
              <div className="flex-1 border-t border-gray-100"></div>
            </div>
          ))}
        </div>
        
        {/* Data Points */}
        <div className="absolute bottom-8 left-0 right-0 h-48 flex items-end justify-between px-10">
          {performanceData.uptime.map((value, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div className="flex items-end justify-center w-full h-48">
                {/* Uptime Bar */}
                <div 
                  className="w-4 bg-green-500 rounded-t mx-1" 
                  style={{ height: `${value * 0.48}%` }}
                ></div>
                
                {/* Response Time Line */}
                <div 
                  className="w-4 bg-blue-500 rounded-t mx-1" 
                  style={{ height: `${(500 - performanceData.responseTime[i]) * 0.48 / 5}%` }}
                ></div>
                
                {/* Error Rate Line */}
                <div 
                  className="w-4 bg-red-500 rounded-t mx-1" 
                  style={{ height: `${performanceData.errorRate[i] * 48}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-2">{days[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;