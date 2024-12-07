import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [rentalDetails, setRentalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const rentalId = new URLSearchParams(location.search).get("rentalId");

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/peminjaman/${rentalId}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setRentalDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rental details:", error);
        setError("Failed to fetch rental details. Please try again.");
        setLoading(false);
      }
    };
    fetchRentalDetails();
  }, [rentalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        "http://localhost:8000/api/pembayaran/",
        {
          peminjaman: rentalId,
          metode_pembayaran: paymentMethod,
        },
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      );
      alert("Payment processed successfully!");
      navigate(`/rentals/${rentalId}`);
    } catch (error) {
      console.error("Error processing payment:", error);
      if (error.response) {
        setError(
          `Failed to process payment: ${
            error.response.data.detail || "Unknown error"
          }`
        );
      } else if (error.request) {
        setError(
          "Failed to process payment: No response from server. Please try again."
        );
      } else {
        setError(
          "Failed to process payment: An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className='text-center mt-8 text-lg'>Loading...</div>;
  if (error)
    return <div className='text-red-500 text-center mt-8'>{error}</div>;

  return (
    <div className='max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-16 mt-24'>
      <h2 className='text-2xl font-bold text-center mb-6'>Make Payment</h2>
      {rentalDetails && (
        <div className='bg-gray-100 p-6 rounded-lg mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Rental Summary</h3>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Bike:</span> {rentalDetails.sepeda}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Start Time:</span>{" "}
            {rentalDetails.waktu_pengambilan}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>End Time:</span>{" "}
            {rentalDetails.waktu_pengembalian || "Ongoing"}
          </p>
          <p className='text-gray-700'>
            <span className='font-medium'>Total Cost:</span> Rp{" "}
            {rentalDetails.total_biaya || "To be calculated"}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='paymentMethod'
            className='block text-gray-700 font-medium mb-2'
          >
            Payment Method
          </label>
          <select
            id='paymentMethod'
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          >
            <option value=''>Select Payment Method</option>
            <option value='Credit Card'>Credit Card</option>
            <option value='Debit Card'>Debit Card</option>
            <option value='Cash'>Cash</option>
          </select>
        </div>
        <button
          type='submit'
          disabled={loading}
          className={`w-full py-3 text-lg font-semibold rounded-lg shadow ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "Processing..." : "Process Payment"}
        </button>
      </form>
      {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
    </div>
  );
}

export default Payment;
