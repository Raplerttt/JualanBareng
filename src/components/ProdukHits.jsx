import React, { useState, useEffect } from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ExploreLocation = () => {
  const [location, setLocation] = useState("Pandeglang");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      setErrorMessage("");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
          setIsLoading(false);
        },
        (error) => {
          setErrorMessage("Gagal mendapatkan lokasi Anda. Pastikan izin lokasi diberikan.");
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setErrorMessage("Browser Anda tidak mendukung geolokasi.");
    }
  };

  const handleExploreClick = () => {
    if (searchQuery.trim()) {
      setLocation(searchQuery);
      setErrorMessage("");
    } else if (latitude && longitude) {
      setLocation(`Lokasi saat ini: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      setErrorMessage("");
    } else {
      setErrorMessage("Silakan cari lokasi atau aktifkan akses lokasi");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="relative mb-16 mt-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 opacity-95"></div>
      
      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-24 pb-32 text-center lg:py-28 lg:pb-40">
        <div className="max-w-3xl mx-auto">
          <h1 className="my-4 text-white font-bold text-4xl leading-tight md:text-5xl lg:text-6xl">
            Temukan Kuliner Terbaik <br className="hidden md:block" />di Sekitar Anda
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-white text-opacity-90 text-lg md:text-xl lg:text-lg">
            Jelajahi beragam pilihan makanan UMKM yang menggugah selera. Dukung usaha lokal dan rasakan kelezatan autentik di setiap gigitan.
          </p>
        </div>
      </div>

      {/* Floating Search Card */}
      <div className="relative z-20 mx-auto -mt-16 w-[calc(100%-2rem)] max-w-2xl">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="p-6 md:p-8">
            <label htmlFor="location-search" className="block mb-3 text-sm font-medium text-gray-500">
              LOKASI ANDA
            </label>
            
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="location-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari tempat atau alamat"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleExploreClick()}
                />
              </div>
              
              <button
                onClick={handleExploreClick}
                disabled={isLoading}
                className="flex-shrink-0 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                    Jelajahi
                  </>
                )}
              </button>
            </div>
            
            {errorMessage && (
              <p className="mt-3 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                {errorMessage}
              </p>
            )}
            
            {location && !errorMessage && (
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <MapPinIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-white bg-opacity-20 mix-blend-overlay"></div>
      <div className="absolute bottom-1/3 left-20 w-48 h-48 rounded-full bg-white bg-opacity-10 mix-blend-overlay"></div>
    </div>
  );
};

export default ExploreLocation;