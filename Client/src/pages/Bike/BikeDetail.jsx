import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function BikeDetail() {
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/sepeda/${id}/`
        );
        setBike(response.data);
      } catch (error) {
        console.error("Error fetching bike details:", error);
        setError("Failed to fetch bike details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  const handleConfirmRental = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/peminjaman/",
        { sepeda: bike.id_sepeda },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      );
      alert("Rental created successfully!");
      navigate(`/rentals/${response.data.id_peminjaman}`);
    } catch (error) {
      console.error("Error creating rental:", error.response || error.message);
      if (error.response) {
        alert(
          `Failed to create rental: ${
            error.response.data.detail || "Unknown error"
          }`
        );
      } else if (error.request) {
        alert(
          "Failed to create rental: No response from server. Please try again."
        );
      } else {
        alert(
          "Failed to create rental: An unexpected error occurred. Please try again."
        );
      }
    }
    setShowModal(false);
  };

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

  return (
    <div className='container mx-auto py-16 px-24 sm:px-12 lg:px-24'>
      <h1 className='text-2xl font-semibold my-4 text-center'>Detail Sepeda</h1>
      <div className='bg-white rounded-lg shadow-xl overflow-hidden'>
        <div className='flex flex-col lg:flex-row items-center justify-between p-8'>
          {/* Bike Image */}
          <div className='flex-shrink-0 w-full lg:w-1/3 mb-6 lg:mb-0 lg:mx-5'>
            <img
              src={`https://source.unsplash.com/400x250/?bike,${bike.jenis_sepeda}`}
              alt={bike.jenis_sepeda}
              className='w-full h-64 object-cover rounded-lg shadow-lg'
            />
          </div>

          {/* Bike Info */}
          <div className='w-full lg:w-2/3'>
            <h3 className='text-2xl font-semibold text-gray-900 mb-4'>
              {bike.jenis_sepeda_display}
            </h3>
            <p className='text-md text-gray-700 mb-3'>
              Kondisi:{" "}
              <span className='font-medium'>{bike.kondisi_sepeda_display}</span>
            </p>
            <p className='text-md text-gray-700 mb-3'>
              Status:{" "}
              <span className='font-medium'>{bike.status_sepeda_display}</span>
            </p>
            <p className='text-md text-gray-700 mb-3'>
              Hourly Rate:{" "}
              <span className='font-medium'>Rp {bike.biaya_sepeda}</span>
            </p>
            <p className='text-md text-gray-700 mb-6'>
              Lokasi Stasiun:{" "}
              <span className='font-medium'>
                {bike.stasiun_detail?.nama_stasiun}
              </span>
            </p>

            <div className='mt-8 text-center'>
              <button
                onClick={() => setShowModal(true)}
                className='w-full block py-3 px-6 text-sm font-medium bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 hover:text-white transition'
              >
                Rent This Bike
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Confirm Rental
            </h2>
            <p className='text-gray-700 mb-6'>
              Are you sure you want to rent this bike?
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowModal(false)}
                className='py-2 px-4 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRental}
                className='py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BikeDetail;
