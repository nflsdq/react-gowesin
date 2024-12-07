import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    email: "",
    no_telp: "",
    password: "",
    confirm_password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/register/", formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <section className='bg-gray-50 py-40'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <a
          href='/'
          className='flex items-center mb-6 text-2xl font-semibold text-gray-900'
        >
          <img className='w-8 h-8 mr-2' src='' alt='logo' />
          Gowesin
        </a>
        <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
              Register an Account
            </h1>
            <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor='username'
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Username
                </label>
                <input
                  type='text'
                  id='username'
                  name='username'
                  placeholder='Enter your username'
                  value={formData.username}
                  onChange={handleChange}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='nama'
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Name
                </label>
                <input
                  type='text'
                  id='nama'
                  name='nama'
                  placeholder='Enter your name'
                  value={formData.nama}
                  onChange={handleChange}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={handleChange}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='no_telp'
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Phone Number
                </label>
                <input
                  type='tel'
                  id='no_telp'
                  name='no_telp'
                  placeholder='Enter your phone number'
                  value={formData.no_telp}
                  onChange={handleChange}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Password
                </label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Enter your password'
                  value={formData.password}
                  onChange={handleChange}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='confirm_password'
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Confirm Password
                </label>
                <input
                  type='password'
                  id='confirm_password'
                  name='confirm_password'
                  placeholder='Confirm your password'
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  required
                />
              </div>
              <p className='text-sm font-medium text-gray-900'>
                Already have an account?{" "}
                <a href='/login' className='text-blue-600 hover:underline'>
                  Login here
                </a>
              </p>
              <button
                type='submit'
                className='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
