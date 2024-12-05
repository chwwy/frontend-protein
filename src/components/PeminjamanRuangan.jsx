import React, { useState } from 'react';

const FormPeminjamanRuangan = () => {
   const [showModal, setShowModal] = useState(false);

   const handleSubmit = (e) => {
       e.preventDefault();
       setShowModal(true);
   };

   return (
       <main className="flex-1 lg:ml-[300px] p-4 transition-all duration-500 bg-gray-100">
           <div className="flex flex-col items-start p-4 md:p-8 min-h-screen">
               <h2 className="text-2xl font-semibold mb-6 md:mb-10 text-gray-800">Form Peminjaman Ruangan</h2>

               <form onSubmit={handleSubmit} className="w-full space-y-6 md:space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                       {['Nama Peminjam', 'Alamat Email', 'Nomor Telepon'].map((label, i) => (
                           <div key={i}>
                               <label className="block text-gray-700 text-sm font-bold mb-4">{label}</label>
                               <input 
                                   type={i === 1 ? 'email' : i === 2 ? 'number' : 'text'}
                                   placeholder={label}
                                   className="appearance-none border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                               />
                           </div>
                       ))}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                       {[
                           {label: 'Tanggal Peminjaman', type: 'date'},
                           {label: 'Waktu Peminjaman', type: 'time'},
                           {
                               label: 'Durasi Peminjaman (jam)',
                               type: 'number',
                           },
                           {
                               label: 'Ruangan',
                               type: 'select',
                               options: [
                                   {value: '', label: 'Pilih Ruangan'},
                                   {value: '1', label: 'Ruangan A'},
                                   {value: '2', label: 'Ruangan B'},
                                   {value: '3', label: 'Ruangan C'}
                               ]
                           }
                       ].map((field, i) => (
                           <div key={i}>
                               <label className="block text-gray-700 text-sm font-bold mb-4">{field.label}</label>
                               {field.type === 'select' ? (
                                   <select className="border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
                                       {field.options.map((opt, j) => (
                                           <option key={j} value={opt.value}>{opt.label}</option>
                                       ))}
                                   </select>
                               ) : (
                                   <input 
                                       type={field.type}
                                       className="border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   />
                               )}
                           </div>
                       ))}
                   </div>

                   <div>
                       <label className="block text-gray-700 text-sm font-bold mb-4">Keperluan Peminjaman</label>
                       <textarea 
                           rows="6"
                           placeholder="Tuliskan keterangan peminjaman"
                           className="appearance-none border rounded w-full py-3 md:py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4">
                       <button 
                           type="submit"
                           className="bg-[#1ABCCB] hover:bg-[#438288] transition-colors text-white font-bold py-3 px-8 rounded-lg w-full sm:w-[136px]"
                       >
                           Done
                       </button>
                       <button 
                           type="reset"
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
                                   className="bg-[#1ABCCB40] text-[#1ABCCB] py-2 px-6 rounded-lg"
                               >
                                   Batal
                               </button>
                               <button 
                                   className="bg-[#1ABCCB] text-white py-2 px-6 rounded-lg"
                               >
                                   Konfirmasi
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