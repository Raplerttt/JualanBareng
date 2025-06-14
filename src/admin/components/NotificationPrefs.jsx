import React from 'react';
import ToggleSwitch from './ToggleSwitch';

const NotificationPrefs = ({ settings, updateSettings }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Saluran Notifikasi</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm">Email</h4>
            <p className="text-xs text-gray-500">
              Kirim notifikasi ke email admin
            </p>
          </div>
          <ToggleSwitch 
            isOn={settings.email}
            handleToggle={() => updateSettings('email', !settings.email)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm">Push Notification</h4>
            <p className="text-xs text-gray-500">
              Kirim notifikasi ke perangkat admin
            </p>
          </div>
          <ToggleSwitch 
            isOn={settings.push}
            handleToggle={() => updateSettings('push', !settings.push)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Tipe Notifikasi</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm">Hanya Penting</h4>
            <p className="text-xs text-gray-500">
              Hanya kirim notifikasi untuk kasus kritis
            </p>
          </div>
          <ToggleSwitch 
            isOn={settings.criticalOnly}
            handleToggle={() => updateSettings('criticalOnly', !settings.criticalOnly)}
          />
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Frekuensi Laporan</h3>
        <div className="flex flex-wrap gap-4">
          {['real-time', 'daily', 'weekly'].map((freq) => (
            <label key={freq} className="flex items-center">
              <input
                type="radio"
                name="reportFrequency"
                checked={settings.reportFrequency === freq}
                onChange={() => updateSettings('reportFrequency', freq)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm capitalize">
                {freq === 'real-time' ? 'Real-time' : 
                 freq === 'daily' ? 'Harian' : 'Mingguan'}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPrefs;