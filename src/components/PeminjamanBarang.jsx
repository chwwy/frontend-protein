import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const PeminjamanBarang = () => {
  const [showModal, setShowModal] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [scanActive, setScanActive] = useState(false);

  const handleScan = (err, result) => {
    if (result) {
      setScannedData(result.text); 
      setScanActive(false);
    } else if (err) {
      console.error("Scan Error:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <main className="flex-1 lg:ml-[300px] p-4 transition-all duration-500 bg-gray-100">
      <div className="flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-md mb-8 ">
          {!scanActive ? (
            <button
              onClick={() => setScanActive(true)}
              className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB] text-white"
            >
              Start Scan
            </button>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <BarcodeScannerComponent
                width={300}
                height={300}
                onUpdate={handleScan}
              />
            </div>
          )}

          {scannedData && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="font-medium">Scanned Result:</p>
              <p className="text-gray-600">{scannedData}</p>
            </div>
          )}
        </div>

        <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-8 text-gray-800">
            Form Peminjaman Barang
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Nama Peminjam
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  NIP / NIM
                </label>
                <input
                  type="text"
                  placeholder="..."
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Divisi / Jurusan
                </label>
                <input
                  type="text"
                  placeholder="..."
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Durasi (jam)
                </label>
                <input
                  type="number"
                  placeholder="..."
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3">
                Keperluan Peminjaman
              </label>
              <textarea
                rows="6"
                placeholder="Tuliskan keterangan peminjaman"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="reset"
                className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]"
              >
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
              <h3 className="text-xl font-semibold mb-6">
                Konfirmasi Peminjaman?
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]"
                >
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
