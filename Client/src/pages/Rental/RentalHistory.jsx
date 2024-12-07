import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function RentalHistory() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/peminjaman/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setRentals(response.data);
      } catch (error) {
        console.error("Error fetching rental history:", error);
        setError("Failed to fetch history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
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

  if (rentals.length === 0) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-500'>
          Tidak ada data riwayat peminjaman yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-16 px-24'>
      <h1 className='text-2xl font-semibold my-4 text-center'>
        Riwayat Peminjaman
      </h1>
      <table className='min-w-full table-auto bg-white shadow-lg rounded-lg overflow-hidden'>
        <thead className='bg-blue-500 text-white'>
          <tr>
            <th className='px-4 py-2 text-left'>ID</th>
            <th className='px-4 py-2 text-left'>Waktu Pengambilan</th>
            <th className='px-4 py-2 text-left'>Waktu Pengembalian</th>
            <th className='px-4 py-2 text-left'>Biaya</th>
            <th className='px-4 py-2 text-left'>Status Pembayaran</th>
            <th className='px-4 py-2 text-left'>Detail</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.id_peminjaman} className='hover:bg-gray-100'>
              <td className='px-4 py-2'>#{rental.id_peminjaman}</td>
              <td className='px-4 py-2'>{rental.waktu_pengambilan}</td>
              <td className='px-4 py-2'>{rental.waktu_pengembalian}</td>
              <td className='px-4 py-2'>Rp. {rental.total_biaya}</td>
              <td className='px-4 py-2'>{rental.status_pembayaran}</td>
              <td className='px-4 py-2'>
                <Link
                  to={`/rentals/${rental.id_peminjaman}`}
                  className='text-blue-600 hover:text-blue-800'
                >
                  Lihat Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RentalHistory;
