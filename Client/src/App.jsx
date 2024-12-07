import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Home'
import BikeList from './pages/Bike/BikeList'
import StationList from './pages/Station/StationList'
import BikeDetail from './pages/Bike/BikeDetail'
import RentalDetail from './pages/Rental/RentalDetail'
import ReturnBike from './pages/Rental/ReturnBike'
import Payment from './pages/Payment/Payment'
import RentalHistory from './pages/Rental/RentalHistory'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/bikes" element={<BikeList />} />
          <Route path="/stations" element={<StationList />} />
          <Route path="/bikes/:id" element={<BikeDetail />} />
          {/* <Route path="/rent" element={<Rental />} /> */}
          <Route path="/rentals/:id" element={<RentalDetail />} />
          <Route path="/return" element={<ReturnBike />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/history" element={<RentalHistory />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App

