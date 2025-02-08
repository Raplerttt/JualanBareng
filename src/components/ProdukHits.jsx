import React, { useState, useEffect } from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid'; // Menggunakan MapPinIcon untuk v2

const ExploreLocation = () => {
  const [lokasi, setLokasi] = useState("Pandeglang");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const lokasiInputRef = React.createRef();

  // Fungsi untuk mendapatkan lokasi pengguna saat ini
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
          setIsLoading(false);
        },
        (error) => {
          setErrorMessage("Tidak dapat mengambil lokasi Anda.");
          setIsLoading(false);
        }
      );
    } else {
      setErrorMessage("Geolocation tidak didukung oleh browser ini.");
    }
  };

  // Fungsi untuk mengarahkan ke Google Maps dengan koordinat pengguna
  const handleJelajahiClick = () => {
    const mapsUrl = latitude && longitude 
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : `https://www.google.com/maps?q=${encodeURIComponent(lokasi)}`;
    window.open(mapsUrl, "_blank");
  };

  // Fungsi untuk menggunakan lokasi saya
  const handleLokasiSayaClick = () => {
    if (latitude && longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(mapsUrl, "_blank");
    } else {
      alert("Mengambil lokasi Anda...");
      getCurrentLocation(); // Meminta kembali lokasi pengguna jika belum diambil
    }
  };

  useEffect(() => {
    getCurrentLocation(); // Panggil fungsi untuk mendapatkan lokasi saat komponen pertama kali dimuat
  }, []);

  return (
    <div className="relative mb-10 mt-4">
      {/* Bagian Konten */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-12 pb-28 text-center lg:py-20 lg:pb-36">
        <h1 className="my-2 max-w-[200px] text-white font-bold text-3xl md:my-4 md:text-4xl lg:max-w-none lg:text-5xl">
          Sedang Mencari Tempat Makan? Jelajahi di Jualan Bareng!
        </h1>
        <p className="max-w-[268px] text-white text-sm md:max-w-sm md:text-base lg:max-w-lg lg:text-lg">
         Temukan beragam pilihan makanan UMKM yang menggugah selera. Dukung usaha lokal dan rasakan kelezatan autentik di setiap gigitan. Ayo, temukan tempat makan favoritmu di Jualan Bareng!
        </p>
      </div>

      {/* Lokasi dan Tombol Jelajahi */}
      <div className="bg-white shadow-lg rounded-2xl absolute left-[50%] z-10 w-[calc(100vw-48px)] max-w-[400px] -translate-x-[50%] -translate-y-[60%] transform p-4 text-left md:w-[461px] md:max-w-none md:p-6 lg:w-[520px] lg:p-8">
        <span className="mb-2 block text-gray-400 text-xs md:text-sm lg:text-base">Lokasi Saya</span>
        <div className="flex flex-col items-center justify-center space-y-3 text-left md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative w-full max-w-[411px]">
            <div className="w-full border-2 border-gray-300 rounded-full px-3 py-2 flex items-center space-x-2 focus-within:ring-2 focus-within:ring-blue-500">
              {/* Ikon Lokasi di dalam input */}
              <MapPinIcon className="h-5 text-gray-500 absolute left-3" />
              <input
                ref={lokasiInputRef} 
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Cari tempat"
                className="w-full pl-10 bg-transparent outline-none placeholder-gray-500 text-gray-700" // menambahkan padding kiri untuk memberi ruang pada ikon
                id="lokasi-input"
                type="text"
              />
            </div>
          </div>
          <button
            onClick={handleJelajahiClick}
            className="inline-flex bg-gradient-to-r from-[#091057] to-[#024CAA] text-white py-2 px-6 rounded-full transition-all"
          >
            <span>Jelajahi</span>
          </button>
        </div>
      </div>
      {/* Gambar Latar */}
      <div className="absolute left-2 right-2 top-2 bottom-2 overflow-hidden rounded-3xl">
        <svg
          xmlns="http://www.w3.org/1000/svg"
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="50" cy="50" r="50" fill="#EC8305" />
          <path
            fill="#091057"
            d="M35 55c-2.5-5-7-10-7-15s5-10 7-15c1-2 4-2 5-1 3 2 4 5 4 10s-1 8-4 10c-1 1-4 1-5-1zM65 55c-2.5-5-7-10-7-15s5-10 7-15c1-2 4-2 5-1 3 2 4 5 4 10s-1 8-4 10c-1 1-4 1-5-1z"
          />
          <circle cx="50" cy="50" r="10" fill="#EC8305" />
        </svg>
      </div>
    </div>
  );
};

export default ExploreLocation;
