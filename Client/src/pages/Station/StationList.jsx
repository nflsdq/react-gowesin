import React, { useState, useEffect } from "react";
import axios from "axios";

function StasiunList() {
  const [stasiun, setStasiun] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStasiun = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/stasiun/");
        setStasiun(response.data);
      } catch (error) {
        console.error("Error fetching stasiun:", error);
        setError("Failed to fetch stations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStasiun();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-500'>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-red-500'>{error}</p>
      </div>
    );
  }

  if (stasiun.length === 0) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-500'>
          Tidak ada data stasiun yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-16 px-24'>
      <h1 className='text-2xl font-semibold my-4 text-center'>
        Daftar Stasiun
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12'>
        {stasiun.map((stasiun) => (
          <div
            key={stasiun.id_stasiun}
            className='card bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300'
          >
            <img
              src={`https://source.unsplash.com/400x250/?train_station,${stasiun.nama_stasiun}`}
              alt={stasiun.nama_stasiun}
              className='w-full h-32 object-cover'
            />
            <div className='p-4 space-y-3'>
              <h3 className='text-xl font-bold text-gray-900'>
                {stasiun.nama_stasiun}
              </h3>
              <p className='text-sm text-gray-700'>Lokasi: {stasiun.lokasi}</p>
              <p className='text-sm text-gray-700'>
                Kapasitas: {stasiun.jumlah_sepeda} / {stasiun.kapasitas}
              </p>
            </div>
            <div className='p-6 pt-0'>
              <a
                href='https://maps.app.goo.gl/3NZg2N9JRYfMWrEK9'
                className='w-full block text-center py-2 px-4 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition'
              >
                Lihat di Peta
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StasiunList;
