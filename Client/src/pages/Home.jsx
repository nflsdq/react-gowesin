import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import sepedaGunung from "../assets/sepeda/sepeda_gunung.webp";

function Home() {
  const [sepeda, setSepeda] = useState([]);
  const [stasiun, setStasiun] = useState([]);
  const [jenisSepedaOptions, setJenisSepedaOptions] = useState([]);

  const [selectedJenisSepeda, setSelectedJenisSepeda] = useState("");
  const [selectedStasiun, setSelectedStasiun] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/sepeda/")
      .then((response) => {
        setSepeda(response.data);
        const uniqueJenisSepeda = [
          ...new Set(
            response.data.map((sepeda) => sepeda.jenis_sepeda_display)
          ),
        ];
        setJenisSepedaOptions(uniqueJenisSepeda);
      })
      .catch((error) => {
        console.error("There was an error fetching the bikes!", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/stasiun/")
      .then((response) => {
        setStasiun(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the station!", error);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      jenis_sepeda: selectedJenisSepeda,
      stasiun: selectedStasiun,
    });
    navigate(`/bikes?${params.toString()}`);
  };

  return (
    <div className='pt-16 px-24 overflow-hidden'>
      <section className='py-16 relative'>
        <div className='container mx-auto px-4 lg:flex lg:items-center'>
          <div className='lg:w-1/2'>
            <h1 className='text-4xl font-bold mb-6'>
              Jelajahi Kampusmu dengan{" "}
              <Link to='/' className='text-black font-bold'>
                Gowes<span className='text-blue-500'>IN</span>
              </Link>
            </h1>
            <p className='text-lg mb-6'>
              Penyewaan sepeda per jam yang terjangkau dan ramah lingkungan.
              Nikmati kebebasan bersepeda tanpa beban kepemilikan.
            </p>
            <Link
              to='/bikes'
              className='px-6 py-3 text-sm font-medium bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 hover:text-white transition'
            >
              Mulai Bersepeda
            </Link>
          </div>
          <div className='lg:w-1/2 mt-8 lg:mt-0 relative'>
            <img
              src={sepedaGunung}
              alt='Ilustrasi Sepeda'
              className='transform scale-x-[-1] w-[100%] h-auto max-w-none max-h-full object-contain'
            />
          </div>
        </div>
      </section>

      <section className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg'>
          <h2 className='text-2xl font-bold text-center mb-6'>
            Temukan Sepeda Sempurna Anda
          </h2>
          <form className='grid gap-4 md:grid-cols-3' onSubmit={handleSearch}>
            <select
              className='form-select block w-full px-3 py-2 border rounded-lg'
              aria-label='Pilih jenis sepeda'
              value={selectedJenisSepeda}
              onChange={(e) => setSelectedJenisSepeda(e.target.value)}
            >
              <option value=''>Jenis Sepeda</option>
              {jenisSepedaOptions.map((jenis, index) => (
                <option key={index} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
            <select
              className='form-select block w-full px-3 py-2 border rounded-lg'
              aria-label='Pilih stasiun'
              value={selectedStasiun}
              onChange={(e) => setSelectedStasiun(e.target.value)}
            >
              <option value=''>Stasiun</option>
              {stasiun.map((station) => (
                <option key={station.id_stasiun} value={station.nama_stasiun}>
                  {station.nama_stasiun}
                </option>
              ))}
            </select>
            <button
              type='submit'
              className='px-6 py-3 text-sm font-medium bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 hover:text-white transition'
            >
              Cari
            </button>
          </form>
        </div>
      </section>

      <section className='container mx-auto px-4 pt-16'>
        <h1 className='text-2xl font-semibold my-4 text-center'>
          Daftar Sepeda
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12'>
          {sepeda
            .filter((sepeda) => sepeda.status_sepeda === "T")
            .slice(0, 4)
            .map((sepeda) => (
              <div
                key={sepeda.id_sepeda}
                className='card bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300'
              >
                <div className='absolute top-3 right-3 bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full'>
                  {sepeda.jenis_sepeda_display}
                </div>

                <div className='flex justify-center mt-4'>
                  <img
                    src={sepeda.image_url || "https://via.placeholder.com/150"}
                    alt={sepeda.jenis_sepeda}
                    className='object-contain h-40'
                  />
                </div>

                <div className='p-4'>
                  <h3 className='text-lg font-bold text-gray-900'>
                    {sepeda.jenis_sepeda_display}
                  </h3>
                  <p className='text-gray-700'>
                    Kondisi: {sepeda.kondisi_sepeda_display}
                  </p>
                  <p className='text-gray-700 font-semibold'>
                    Biaya: {sepeda.biaya_sepeda}
                  </p>
                  <div className='flex items-center text-gray-700 mt-2'>
                    <i className='fas fa-map-marker-alt me-2'></i>
                    <span>
                      {sepeda.stasiun_detail?.nama_stasiun ||
                        "Tidak ada data stasiun"}
                    </span>
                  </div>
                </div>

                <div className='border-t p-4 flex justify-between items-center'>
                  <span className='font-semibold text-gray-900'>
                    Status: {sepeda.status_sepeda_display}
                  </span>
                  <Link
                    to={`/bikes/${sepeda.id_sepeda}`}
                    className='px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition'
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))}
        </div>

        <div className='mt-8 text-center'>
          <Link
            to='/bikes'
            className='px-10 py-4 text-sm font-medium bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 hover:text-white transition'
          >
            Lihat Semua Sepeda
          </Link>
        </div>
      </section>

      <section className='container mx-auto px-4 pt-16'>
        <h1 className='text-2xl font-semibold my-4 text-center'>
          Daftar Stasiun
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12'>
          {stasiun.slice(0, 2).map((stasiun) => (
            <div
              key={stasiun.id_stasiun}
              className='card bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300'
            >
              <img
                src={`https://source.unsplash.com/400x250/?train_station,${stasiun.nama_stasiun}`}
                alt={stasiun.nama_stasiun}
                className='w-full h-32 object-cover'
              />
              <div className='p-4 space-y-3'>
                <h3 className='text-xl font-bold text-gray-900'>
                  {stasiun.nama_stasiun}
                </h3>
                <p className='text-sm text-gray-700'>
                  Lokasi: {stasiun.lokasi}
                </p>
                <p className='text-sm text-gray-700'>
                  Kapasitas: {stasiun.jumlah_sepeda} / {stasiun.kapasitas}
                </p>
              </div>
              <div className='p-6 pt-0'>
                <a
                  href='https://maps.app.goo.gl/3NZg2N9JRYfMWrEK9'
                  className='w-full block text-center py-2 px-4 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition'
                >
                  Lihat di Peta
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8 text-center'>
          <Link
            to='/stations'
            className='px-10 py-4 text-sm font-medium bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 hover:text-white transition'
          >
            Lihat Semua Stasiun
          </Link>
        </div>

        <div className='pt-10'>
          <button className='w-full bg-blue-200 border-2 border-black py-2 font-bold hover:bg-blue-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'>
            RENT NOW
          </button>
        </div>
      </section>

      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl font-bold text-center mb-8'>
            Cara Kerja GowesIN
          </h2>
          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                icon: "fas fa-search",
                title: "1. Cari Sepeda",
                description:
                  "Pilih jenis sepeda dan lokasi stasiun yang Anda inginkan.",
              },
              {
                icon: "fas fa-bicycle",
                title: "2. Sewa Sepeda",
                description:
                  "Ambil sepeda dari stasiun dan mulai perjalanan Anda.",
              },
              {
                icon: "fas fa-undo",
                title: "3. Kembalikan Sepeda",
                description:
                  "Kembalikan sepeda ke stasiun mana pun saat selesai.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className='bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition'
              >
                <i className={`${step.icon} text-blue-600 text-4xl mb-4`}></i>
                <h3 className='text-lg font-bold mb-2'>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
