import React, { useState } from 'react';
import SettingSection from './components/SettingSection';
import NotificationPrefs from './components/NotificationPrefs';
import SecuritySettings from './components/SecuritySettings';
import ToggleSwitch from './components/ToggleSwitch';


const Settings = () => {
  const [settings, setSettings] = useState({
    system: {
      maintenanceMode: false,
      autoBackup: true,
      backupFrequency: 'daily'
    },
    notifications: {
      email: true,
      push: true,
      criticalOnly: false,
      reportFrequency: 'real-time'
    },
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  });

  // Fungsi untuk mengupdate pengaturan
  const updateSettings = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // Fungsi untuk menyimpan pengaturan (simulasi)
  const saveSettings = () => {
    // Di sini biasanya akan ada API call untuk menyimpan pengaturan
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Sistem</h1>
        <button 
          onClick={saveSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Simpan Perubahan
        </button>
      </div>

      <div className="space-y-6">
        {/* Section: System Settings */}
        <SettingSection 
          title="Pengaturan Sistem" 
          description="Konfigurasi operasional sistem"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Mode Maintenance</h3>
                <p className="text-sm text-gray-500">
                  Nonaktifkan akses publik saat maintenance
                </p>
              </div>
              <ToggleSwitch 
                isOn={settings.system.maintenanceMode}
                handleToggle={() => updateSettings('system', 'maintenanceMode', !settings.system.maintenanceMode)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Backup Otomatis</h3>
                <p className="text-sm text-gray-500">
                  Backup database secara otomatis
                </p>
              </div>
              <ToggleSwitch 
                isOn={settings.system.autoBackup}
                handleToggle={() => updateSettings('system', 'autoBackup', !settings.system.autoBackup)}
              />
            </div>
            
            {settings.system.autoBackup && (
              <div>
                <h3 className="font-medium mb-2">Frekuensi Backup</h3>
                <div className="flex space-x-4">
                  {['daily', 'weekly', 'monthly'].map((freq) => (
                    <label key={freq} className="flex items-center">
                      <input
                        type="radio"
                        name="backupFrequency"
                        checked={settings.system.backupFrequency === freq}
                        onChange={() => updateSettings('system', 'backupFrequency', freq)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm capitalize">
                        {freq === 'daily' ? 'Harian' : 
                         freq === 'weekly' ? 'Mingguan' : 'Bulanan'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SettingSection>

        {/* Section: Notification Settings */}
        <SettingSection 
          title="Notifikasi" 
          description="Kelola preferensi notifikasi"
        >
          <NotificationPrefs 
            settings={settings.notifications} 
            updateSettings={(key, value) => updateSettings('notifications', key, value)} 
          />
        </SettingSection>

        {/* Section: Security Settings */}
        <SettingSection 
          title="Keamanan" 
          description="Pengaturan keamanan akun"
        >
          <SecuritySettings 
            settings={settings.security} 
            updateSettings={(key, value) => updateSettings('security', key, value)} 
          />
        </SettingSection>
      </div>
    </div>
  );
};

export default Settings;