import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function RentalDetail() {
  const [rental, setRental] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/peminjaman/${id}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setRental(response.data);
      } catch (error) {
        console.error("Error fetching rental details:", error);
        alert("Failed to fetch rental details. Please try again later.");
      }
    };
    fetchRental();
  }, [id]);

  if (!rental)
    return <div className='text-center mt-8 text-lg'>Loading...</div>;

  return (
    <div className='max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-16 mt-24'>
      <h2 className='text-2xl font-bold text-center mb-6'>Rental Details</h2>
      <div className='bg-gray-100 p-6 rounded-lg mb-6'>
        <p className='text-gray-700 mb-2'>
          <span className='font-medium'>Bike:</span> {rental.sepeda}
        </p>
        <p className='text-gray-700 mb-2'>
          <span className='font-medium'>Start Time:</span>{" "}
          {rental.waktu_pengambilan}
        </p>
        <p className='text-gray-700 mb-2'>
          <span className='font-medium'>End Time:</span>{" "}
          {rental.waktu_pengembalian || "Ongoing"}
        </p>
        <p className='text-gray-700 mb-4'>
          <span className='font-medium'>Total Cost:</span> Rp{" "}
          {rental.total_biaya || "To be calculated"}
        </p>
        <p className='text-gray-700 mb-4'>
          <span className='font-medium'>Payment Status:</span>{" "}
          {rental.status_pembayaran}
        </p>
      </div>
      <div className='flex justify-between'>
        {!rental.waktu_pengembalian && (
          <Link
            to={`/return?rentalId=${rental.id_peminjaman}`}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            Return Bike
          </Link>
        )}
        {rental.waktu_pengembalian &&
          rental.status_pembayaran === "Belum Dibayar" && (
            <Link
              to={`/payment?rentalId=${rental.id_peminjaman}`}
              className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
            >
              Make Payment
            </Link>
          )}
      </div>
    </div>
  );
}

export default RentalDetail;
