import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function ReturnBike() {
  const [stationId, setStationId] = useState("");
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const rentalId = new URLSearchParams(location.search).get("rentalId");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/stasiun/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setStations(response.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8000/api/peminjaman/${rentalId}/`,
        {
          stasiun_pengembalian: stationId,
          waktu_pengembalian: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      );
      alert("Bike returned successfully!");
      navigate(`/rentals/${rentalId}`);
    } catch (error) {
      console.error("Error returning bike:", error);
      alert("Failed to return bike. Please try again.");
    }
  };

  return (
    <div className='max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-16 mt-24'>
      <h2 className='text-2xl font-bold text-center mb-6'>Return Bike</h2>
      <form onSubmit={handleSubmit} className='bg-gray-100 p-6 rounded-lg'>
        <div className='mb-4'>
          <label
            htmlFor='station'
            className='block text-gray-700 font-medium mb-2'
          >
            Select Return Station
          </label>
          <select
            id='station'
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            required
            className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='' disabled>
              Select Return Station
            </option>
            {stations.map((station) => (
              <option key={station.id_stasiun} value={station.id_stasiun}>
                {station.nama_stasiun}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='w-full py-3 text-lg font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none'
        >
          Return Bike
        </button>
      </form>
    </div>
  );
}

export default ReturnBike;
