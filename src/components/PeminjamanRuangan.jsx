import React, { useState, useEffect } from 'react';
import { PeminjamanRuanganService } from '../services/PeminjamanRuanganService';
import { RuanganService } from '../services/RuanganService';

const FormPeminjamanRuangan = () => {
   const [showModal, setShowModal] = useState(false);
   const [ruanganList, setRuanganList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [formData, setFormData] = useState({
       name: '',
       email: '',
       nomorTelepon: '',
       tanggalPeminjaman: '',
       WaktuPeminjaman: '',
       durasi: '',
       ruanganId: '',
       keperluan: ''
   });

   useEffect(() => {
       const fetchRuangan = async () => {
           try {
               const response = await RuanganService.getAllRuangan();
               if (response.success) {
                   const availableRooms = response.data.filter(room => room.status === 'Tersedia');
                   setRuanganList(availableRooms);
               }
           } catch (err) {
               console.error('Error fetching rooms:', err);
               setError('Gagal mengambil data ruangan');
           }
       };

       fetchRuangan();
   }, []);

   const handleInputChange = (e) => {
       const { name, value } = e.target;
       setFormData(prev => ({
           ...prev,
           [name]: value
       }));
   };

   const validateForm = () => {
       if (!formData.name || !formData.email || !formData.nomorTelepon || 
           !formData.tanggalPeminjaman || !formData.WaktuPeminjaman || 
           !formData.durasi || !formData.ruanganId || !formData.keperluan) {
           setError('Semua field harus diisi');
           return false;
       }
       
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(formData.email)) {
           setError('Format email tidak valid');
           return false;
       }

       const phoneRegex = /^[0-9\-+]{10,15}$/;
       if (!phoneRegex.test(formData.nomorTelepon)) {
           setError('Nomor telepon tidak valid');
           return false;
       }

       if (parseInt(formData.durasi) <= 0) {
           setError('Durasi harus lebih dari 0 jam');
           return false;
       }

       return true;
   };

   const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const availabilityCheck = await PeminjamanRuanganService.checkRuanganAvailable(formData.ruanganId); 
            if (!availabilityCheck.isAvailable) {
                setError('Ruangan ini sudah tidak tersedia');
                return;
            }
            setShowModal(true);
        } catch (err) {
            console.error('Error checking availability:', err);
            setError('Gagal memeriksa ketersediaan ruangan');
        }
    };

   const handleConfirmSubmit = async () => {
       try {
           setLoading(true);
           setError(null);

           const response = await PeminjamanRuanganService.createPeminjaman(formData);

           if (response.success) {
               alert('Peminjaman berhasil dibuat!');
               setShowModal(false);
               handleReset();
           }
       } catch (err) {
           console.error('Error submitting form:', err);
           setError(err.message || 'Terjadi kesalahan saat membuat peminjaman');
           setShowModal(false);
       } finally {
           setLoading(false);
       }
   };

   const handleReset = () => {
       setFormData({
           name: '',
           email: '',
           nomorTelepon: '',
           tanggalPeminjaman: '',
           WaktuPeminjaman: '',
           durasi: '',
           ruanganId: '',
           keperluan: ''
       });
       setError(null);
   };

   return (
       <main className="flex-1 lg:ml-[300px] p-4 transition-all duration-500 bg-gray-100">
           <div className="flex flex-col items-start p-4 md:p-8 min-h-screen">
               <h2 className="text-2xl font-semibold mb-6 md:mb-10 text-gray-800">Form Peminjaman Ruangan</h2>

               {error && (
                   <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                       <span className="block sm:inline">{error}</span>
                   </div>
               )}

               <form onSubmit={handleSubmit} className="w-full space-y-6 md:space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                       <div>
                           <label className="block text-gray-700 text-sm font-bold mb-4">Nama Peminjam</label>
                           <input 
                               type="text"
                               name="name"
                               value={formData.name}
                               onChange={handleInputChange}
                               placeholder="Nama Peminjam"
                               className="appearance-none border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                       </div>
                       <div>
                           <label className="block text-gray-700 text-sm font-bold mb-4">Alamat Email</label>
                           <input 
                               type="email"
                               name="email"
                               value={formData.email}
                               onChange={handleInputChange}
                               placeholder="Alamat Email"
                               className="appearance-none border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                       </div>
                       <div>
                           <label className="block text-gray-700 text-sm font-bold mb-4">Nomor Telepon</label>
                           <input 
                               type="text"
                               name="nomorTelepon"
                               value={formData.nomorTelepon}
                               onChange={handleInputChange}
                               placeholder="Nomor Telepon"
                               className="appearance-none border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                       </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                       <div>
                           <label className="block text-gray-700 text-sm font-bold mb-4">Tanggal Peminjaman</label>
                           <input 
                               type="date"
                               name="tanggalPeminjaman"
                               value={formData.tanggalPeminjaman}
                               onChange={handleInputChange}
                               className="border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                       </div>
                       <div>
                           <label className="block text-gray-700 text-sm font-bold mb-4">Waktu Peminjaman</label>
                           <input 
                               type="time"
                               name="WaktuPeminjaman"
                               value={formData.WaktuPeminjaman}
                               onChange={handleInputChange}
                               className="border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                       </div>
                       <div>
                           <label className="block text-gray-700 text-sm font-bold mb-4">Durasi Peminjaman (jam)</label>
                           <input 
                               type="number"
                               name="durasi"
                               value={formData.durasi}
                               onChange={handleInputChange}
                               min="1"
                               className="border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                       </div>
                       <div>
                           <label className="block text-gray-700 text-sm font-bold mb-4">Ruangan</label>
                           <select 
                               name="ruanganId"
                               value={formData.ruanganId}
                               onChange={handleInputChange}
                               className="border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                           >
                               <option value="">Pilih Ruangan</option>
                               {ruanganList.map((ruangan) => (
                                   <option key={ruangan._id} value={ruangan._id}>
                                       {ruangan.unit} - {ruangan.ruanganId}
                                   </option>
                               ))}
                           </select>
                       </div>
                   </div>

                   <div>
                       <label className="block text-gray-700 text-sm font-bold mb-4">Keperluan Peminjaman</label>
                       <textarea 
                           name="keperluan"
                           value={formData.keperluan}
                           onChange={handleInputChange}
                           rows="6"
                           placeholder="Tuliskan keterangan peminjaman"
                           className="appearance-none border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4">
                       <button 
                           type="submit"
                           disabled={loading}
                           className="bg-[#1ABCCB] hover:bg-[#438288] transition-colors text-white font-bold py-3 px-8 rounded-lg w-full sm:w-[136px] disabled:opacity-50"
                       >
                           {loading ? 'Loading...' : 'Done'}
                       </button>
                       <button 
                           type="button"
                           onClick={handleReset}
                           className="bg-[#E85858] hover:bg-[#a33a3a] transition-colors text-white font-bold py-3 px-8 rounded-lg w-full sm:w-[136px]"
                       >
                           Reset
                       </button>
                   </div>
               </form>

               {showModal && (
                   <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                       <div className="bg-white p-8 rounded-lg text-center">
                           <div className="mb-4">
                               <i className="bi bi-bell-fill text-4xl text-gray-800"></i>
                           </div>
                           <h3 className="text-xl font-semibold mb-4">Konfirmasi Peminjaman?</h3>
                           <div className="flex justify-center space-x-4">
                               <button 
                                   onClick={() => setShowModal(false)}
                                   disabled={loading}
                                   className="bg-[#1ABCCB40] text-[#1ABCCB] py-2 px-6 rounded-lg disabled:opacity-50"
                               >
                                   Batal
                               </button>
                               <button 
                                   onClick={handleConfirmSubmit}
                                   disabled={loading}
                                   className="bg-[#1ABCCB] text-white py-2 px-6 rounded-lg disabled:opacity-50"
                               >
                                   {loading ? 'Loading...' : 'Konfirmasi'}
                               </button>
                           </div>
                       </div>
                   </div>
               )}
           </div>
       </main>
   );
};

export default FormPeminjamanRuangan;