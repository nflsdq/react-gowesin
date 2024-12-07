import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function BikeList() {
  const [sepeda, setSepeda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStasiun, setSelectedStasiun] = useState("");
  const [selectedJenisSepeda, setSelectedJenisSepeda] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/sepeda/");
        setSepeda(response.data);
      } catch (error) {
        console.error("Error fetching bikes:", error);
        setError("Failed to fetch bikes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const jenisSepedaQuery = searchParams.get("jenis_sepeda") || "";
    const stasiunQuery = searchParams.get("stasiun") || "";

    if (jenisSepedaQuery) {
      setSelectedJenisSepeda(jenisSepedaQuery);
    }

    if (stasiunQuery) {
      setSelectedStasiun(stasiunQuery);
    }
  }, []);

  const filteredBikes = sepeda
    .filter((sepeda) => {
      if (
        selectedStasiun &&
        sepeda.stasiun_detail?.nama_stasiun !== selectedStasiun
      ) {
        return false;
      }
      if (
        selectedJenisSepeda &&
        sepeda.jenis_sepeda_display !== selectedJenisSepeda
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.status_sepeda === "T" ? -1 : 1));

  const updateURL = () => {
    const params = new URLSearchParams();
    if (selectedJenisSepeda) {
      params.set("jenis_sepeda", selectedJenisSepeda);
    }
    if (selectedStasiun) {
      params.set("stasiun", selectedStasiun);
    }
    navigate(`?${params.toString()}`);
  };

  useEffect(() => {
    updateURL();
  }, [selectedJenisSepeda, selectedStasiun]);

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

  if (sepeda.length === 0) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-500'>
          Tidak ada data sepeda yang tersedia.
        </p>
      </div>
    );
  }

  const stasiunOptions = [
    ...new Set(sepeda.map((sepeda) => sepeda.stasiun_detail?.nama_stasiun)),
  ];
  const jenisSepedaOptions = [
    ...new Set(sepeda.map((sepeda) => sepeda.jenis_sepeda_display)),
  ];

  return (
    <div className='container mx-auto px-24 py-16'>
      <h1 className='text-2xl font-semibold my-4 text-center'>Daftar Sepeda</h1>

      <div className='flex justify-between mb-6'>
        <div>
          <label htmlFor='stasiun' className='text-gray-700 mr-2'>
            Filter by Stasiun:
          </label>
          <select
            id='stasiun'
            value={selectedStasiun}
            onChange={(e) => setSelectedStasiun(e.target.value)}
            className='border px-4 py-2 rounded-lg'
          >
            <option value=''>Semua Stasiun</option>
            {stasiunOptions.map((stasiun, index) => (
              <option key={index} value={stasiun}>
                {stasiun}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor='jenisSepeda' className='text-gray-700 mr-2'>
            Filter by Jenis Sepeda:
          </label>
          <select
            id='jenisSepeda'
            value={selectedJenisSepeda}
            onChange={(e) => setSelectedJenisSepeda(e.target.value)}
            className='border px-4 py-2 rounded-lg'
          >
            <option value=''>Semua Jenis Sepeda</option>
            {jenisSepedaOptions.map((jenis, index) => (
              <option key={index} value={jenis}>
                {jenis}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12'>
        {filteredBikes.map((sepeda) => (
          <div
            key={sepeda.id_sepeda}
            className='card bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300'
          >
            <div className='absolute top-3 right-3 bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full'>
              {sepeda.jenis_sepeda_display}
            </div>
            <div className='flex justify-center mt-4'>
              <img
                src={sepeda.image_url || "https://via.placeholder.com/150"}
                alt={sepeda.jenis_sepeda}
                className='object-contain h-40'
              />
            </div>
            <div className='p-4'>
              <h3 className='text-lg font-bold text-gray-900'>
                {sepeda.jenis_sepeda_display}
              </h3>
              <p className='text-gray-700 font-semibold'>
                Biaya: {sepeda.biaya_sepeda}
              </p>
              <p className='text-gray-700'>
                Kondisi: {sepeda.kondisi_sepeda_display}
              </p>
              <div className='flex items-center text-gray-700 mt-2'>
                <i className='fas fa-map-marker-alt me-2'></i>
                <span>{sepeda.stasiun_detail?.nama_stasiun}</span>
              </div>
            </div>
            <div className='border-t p-4 flex justify-between items-center'>
              <span className='font-semibold text-gray-900'>
                Status: {sepeda.status_sepeda_display}
              </span>
              <Link
                to={`/bikes/${sepeda.id_sepeda}`}
                className='px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition'
              >
                Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BikeList;
