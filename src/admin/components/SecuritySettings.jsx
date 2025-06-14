import React from 'react';
import ToggleSwitch from './ToggleSwitch';

const SecuritySettings = ({ settings, updateSettings }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">
              Tambahkan lapisan keamanan ekstra untuk login
            </p>
          </div>
          <ToggleSwitch 
            isOn={settings.twoFactor}
            handleToggle={() => updateSettings('twoFactor', !settings.twoFactor)}
          />
        </div>
        
        {settings.twoFactor && (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h4 className="font-medium text-sm text-blue-800">Konfigurasi 2FA</h4>
            <p className="text-xs text-blue-700 mt-1">
              Silakan scan QR code di aplikasi autentikator Anda
            </p>
            <div className="mt-2 flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-400">
                QR
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-600">Atau masukkan kode manual:</p>
                <p className="font-mono text-sm">JBSWY3DPEHPK3PXP</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="font-medium">Session Timeout</h3>
        <p className="text-sm text-gray-500 mb-2">
          Waktu tidak aktif sebelum logout otomatis (menit)
        </p>
        <div className="flex items-center">
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={settings.sessionTimeout}
            onChange={(e) => updateSettings('sessionTimeout', parseInt(e.target.value))}
            className="w-full max-w-xs"
          />
          <span className="ml-4 w-12 text-center font-medium">
            {settings.sessionTimeout}m
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium">Password Expiry</h3>
        <p className="text-sm text-gray-500 mb-2">
          Periode penggantian password wajib (hari)
        </p>
        <div className="flex space-x-4">
          {[30, 60, 90, 0].map((days) => (
            <label key={days} className="flex items-center">
              <input
                type="radio"
                name="passwordExpiry"
                checked={settings.passwordExpiry === days}
                onChange={() => updateSettings('passwordExpiry', days)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">
                {days === 0 ? 'Tidak pernah' : `${days} hari`}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;