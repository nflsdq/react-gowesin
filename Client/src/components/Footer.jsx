import React from "react";

function Footer() {
  return (
    <footer className='bg-blue-500 text-white py-8 px-24'>
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-8'>
          <div>
            <h3 className='text-lg font-semibold text-white'>Kontak Kami</h3>
            <ul className='text-gray-200 mt-4'>
              <li>Email: info@gowesin.com</li>
              <li>Telepon: +62 123 456 7890</li>
              <li>Jl. Setiabudi, Bandung</li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-white'>Ikuti Kami</h3>
            <div className='flex space-x-4 mt-4'>
              <a
                href='https://www.facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-200 hover:text-white'
              >
                <i className='fab fa-facebook-f text-xl'></i>
              </a>
              <a
                href='https://www.twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-200 hover:text-white'
              >
                <i className='fab fa-twitter text-xl'></i>
              </a>
              <a
                href='https://www.instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-200 hover:text-white'
              >
                <i className='fab fa-instagram text-xl'></i>
              </a>
              <a
                href='https://www.linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-200 hover:text-white'
              >
                <i className='fab fa-linkedin-in text-xl'></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-white'>Tentang Kami</h3>
            <p className='text-gray-200 mt-4'>
              GowesIN menawarkan berbagai sepeda untuk keperluan perjalanan
              Anda. Kami berkomitmen memberikan pengalaman terbaik dalam
              peminjaman sepeda.
            </p>
          </div>
        </div>

        {/* Bagian Bawah Footer: Copyright & Links */}
        <div className='border-t border-gray-600 pt-6 text-center'>
          <p className='text-sm text-gray-200'>
            &copy; 2024 GowesIN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
