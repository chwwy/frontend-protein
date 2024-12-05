import React, { useState, useEffect } from 'react';

const PeminjamanBarang = () => {
   const [showModal, setShowModal] = useState(false);
   const [scannedResult, setScannedResult] = useState('');
   const [BarcodeScanner, setBarcodeScanner] = useState(null); 
   const [scanActive, setScanActive] = useState(false);

   useEffect(() => {
       import('react-barcode-scanner').then((module) => {
           setBarcodeScanner(() => module.BarcodeScanner);
       }).catch((err) => {
           console.error("Failed to load BarcodeScanner", err);
       });
   }, []);

   const handleScan = (result) => {
       if (result) {
           setScannedResult(result);
       }
   };

   const handleSubmit = (e) => {
       e.preventDefault();
       setShowModal(true);
   };

   const handleStartScan = () => {
       setScanActive(true); 
   };

   if (!BarcodeScanner) {
       return <p>Loading Barcode Scanner...</p>;
   }

   return (
       <main className="flex-1 lg:ml-[300px] p-4 transition-all duration-500 bg-gray-100">
           <nav className="fixed top-0 right-0 w-full lg:w-[calc(100%-300px)] bg-white shadow-md z-20">
               <div className="p-4 sm:p-6 border-b border-gray-200">
                   <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Scan Barcode</h1>
               </div>
           </nav>

           <div className="flex flex-col items-center mt-[72px] p-4 md:p-8">
               <div className="w-full max-w-md mb-8">
                   {!scanActive ? (
                       <button 
                           onClick={handleStartScan}
                           className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB] text-white"
                       >
                           Start Scan
                       </button>
                   ) : (
                       <BarcodeScanner onScan={handleScan} />
                   )}

                   {scannedResult && (
                       <div className="mt-4 p-4 bg-white rounded-lg">
                           <p className="font-medium">Scanned Result:</p>
                           <p className="text-gray-600">{scannedResult}</p>
                       </div>
                   )}
               </div>

               <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 md:p-8">
                   <h2 className="text-xl font-semibold mb-8 text-gray-800">Form Peminjaman Barang</h2>

                   <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-3">Penanggung Jawab</label>
                               <input 
                                   type="text"
                                   placeholder="Input penanggung jawab"
                                   className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                               />
                           </div>
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-3">NIP / NIM</label>
                               <input 
                                   type="number"
                                   placeholder="Input nip/nim"
                                   className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                               />
                           </div>
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-3">Divisi/Jurusan</label>
                               <select className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
                                   <option value="">Pilih Divisi</option>
                                   <option value="informatika">Informatika</option>
                                   <option value="biologi">Biologi</option>
                                   <option value="fisika">Fisika</option>
                               </select>
                           </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-3">Tanggal Peminjaman</label>
                               <input 
                                   type="date"
                                   className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                               />
                           </div>
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-3">Waktu Peminjaman</label>
                               <input 
                                   type="time"
                                   className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                               />
                           </div>
                           <div>
                               <label className="block text-gray-700 text-sm font-bold mb-3">Durasi Peminjaman</label>
                               <select className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
                                   <option value="1">1 jam</option>
                                   <option value="2">2 jam</option>
                                   <option value="3">3 jam</option>
                               </select>
                           </div>
                       </div>

                       <div>
                           <label className="block text-gray-700 text-sm font-bold mb-3">Keperluan Peminjaman</label>
                           <textarea 
                               rows="6"
                               placeholder="Tuliskan keterangan peminjaman"
                               className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                           />
                       </div>

                       <div className="flex justify-end space-x-4">
                           <button 
                               type="reset"
                               className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]">
                               Reset
                           </button>
                           <button 
                               type="submit"
                               className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB] text-white"
                           >
                               Submit
                           </button>
                       </div>
                   </form>
               </div>
           </div>

           {showModal && (
               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                   <div className="bg-white p-8 rounded-lg max-w-sm w-full m-4">
                       <div className="text-center">
                           <i className="bi bi-bell-fill text-4xl text-gray-800 mb-4"></i>
                           <h3 className="text-xl font-semibold mb-6">Konfirmasi Peminjaman?</h3>
                           <div className="flex justify-center space-x-4">
                               <button 
                                   onClick={() => setShowModal(false)}
                                   className="px-6 py-2 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]">
                                   Batal
                               </button>
                               <button className="px-6 py-2 rounded-md font-medium bg-[#1ABCCB] text-white">
                                   Konfirmasi
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           )}
       </main>
   );
};

export default PeminjamanBarang;
