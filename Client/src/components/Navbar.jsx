import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route location

  const isActive = (path) => location.pathname === path; // Check if the link is active

  return (
    <nav className='max-w-full mx-auto flex justify-between items-center py-3 px-24 bg-white border-b-4 border-black fixed top-0 left-0 w-full z-10'>
      <h1 className='text-2xl font-bold text-black'>🚲 GowesIN</h1>

      <div className='ml-auto space-x-4 px-6'>
        <Link
          to='/'
          className={`font-bold ${
            isActive("/")
              ? "text-black border-b-2 border-black hover:text-black"
              : "text-black hover:text-black hover:underline"
          }`}
        >
          Beranda
        </Link>
        <Link
          to='/bikes'
          className={`font-bold ${
            isActive("/bikes")
              ? "text-black border-b-2 border-black hover:text-black"
              : "text-black hover:text-black hover:underline"
          }`}
        >
          Sepeda
        </Link>
        <Link
          to='/stations'
          className={`font-bold ${
            isActive("/stations")
              ? "text-black border-b-2 border-black hover:text-black"
              : "text-black hover:text-black hover:underline"
          }`}
        >
          Stasiun
        </Link>

        {isAuthenticated && (
          <Link
            to='/history'
            className={`font-bold ${
              isActive("/history")
                ? "text-black border-b-2 border-black hover:text-black"
                : "text-black hover:text-black hover:underline"
            }`}
          >
            Riwayat Peminjaman
          </Link>
        )}
      </div>

      <div className='space-x-4'>
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            // className='bg-white border-2 border-black py-2 px-4 font-bold hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
            className='bg-black text-white px-4 py-2 font-bold hover:bg-gray-800'
          >
            Keluar
          </button>
        ) : (
          <>
            {/* <button
              onClick={() => navigate("/login")}
              // className='font-bold text-white bg-blue-500 px-4 py-2 border-2 border-blue-500 hover:bg-blue-600'
              className='bg-blue-500 text-white px-4 py-2 font-bold hover:bg-blue-400'
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              // className='font-bold text-black bg-transparent border-2 border-black px-4 py-2 hover:bg-gray-100'
              className='bg-transparent text-black px-4 py-2 font-bold hover:bg-gray-200'
            >
              Register
            </button> */}

            <button
              onClick={() => navigate("/login")}
              // className='bg-white border-2 border-black py-2 px-4 font-bold hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
              className='bg-blue-500 text-white px-4 py-2 font-bold hover:bg-blue-400'
            >
              Mulai Sekarang
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
