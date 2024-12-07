import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

function Rental() {
  const [bike, setBike] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const bikeId = new URLSearchParams(location.search).get('bikeId')

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/sepeda/${bikeId}/`, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        })
        setBike(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching bike details:', error)
        setError('Failed to fetch bike details. Please try again.')
        setLoading(false)
      }
    }
    fetchBike()
  }, [bikeId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8000/api/peminjaman/', 
        { sepeda: bikeId },
        { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
      )
      alert('Rental created successfully!')
      navigate(`/rentals/${response.data.id_peminjaman}`)
    } catch (error) {
      console.error('Error creating rental:', error)
      if (error.response) {
        alert(`Failed to create rental: ${error.response.data.detail || 'Unknown error'}`)
      } else if (error.request) {
        alert('Failed to create rental: No response from server. Please try again.')
      } else {
        alert('Failed to create rental: An unexpected error occurred. Please try again.')
      }
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="rental pt-16">
      <h2>Rent a Bike</h2>
      {bike && (
        <div>
          <p>Bike Type: {bike.jenis_sepeda}</p>
          <p>Bike Condition: {bike.kondisi_sepeda}</p>
          <p>Current Station: {bike.stasiun.nama_stasiun}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <p>You are about to rent bike with ID: {bikeId}</p>
        <button type="submit">Confirm Rental</button>
      </form>
    </div>
  )
}

export default Rental