import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { BarangService } from '../services/BarangService';

const ManageBarang = () => {
  const [showModal, setShowModal] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [scanActive, setScanActive] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    codeBarang: "",
    name: ""
  });

  const handleScan = (err, result) => {
    if (result) {
      setScannedData(result.text);
      setScanActive(false);
      setFormData(prev => ({
        ...prev,
        codeBarang: result.text
      }));
    } else if (err) {
      console.error("Scan Error:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleConfirm = async () => {
    try {
      await BarangService.createBarang(formData);
      
      setFormData({
        codeBarang: "",
        name: ""
      });
      setScannedData(null);
      setShowModal(false);
      showNotification("Barang berhasil ditambahkan!", "success");
    } catch (error) {
      setShowModal(false);
      if (error.status === 400) {
        showNotification("Barang sudah ada.", "error");
      } else {
        showNotification("Terjadi kesalahan.", "error");
      }
    }
  };

  return (
    <main className="flex-1 lg:ml-[300px] p-4 transition-all duration-500 bg-gray-100">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg py-3 px-6 text-white ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-md mb-8">
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
              <p className="font-medium">Scanned Barcode:</p>
              <p className="text-gray-600">{scannedData}</p>
            </div>
          )}
        </div>

        <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-8 text-gray-800">
            Form Tambah Barang
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Kode Barang
                </label>
                <input
                  type="text"
                  name="codeBarang"
                  value={formData.codeBarang}
                  onChange={handleInputChange}
                  placeholder="Scan barcode..."
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Nama Barang
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nama barang..."
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="reset"
                onClick={() => {
                  setFormData({
                    codeBarang: "",
                    name: ""
                  });
                  setScannedData(null);
                }}
                className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB] text-white"
                disabled={!formData.codeBarang}
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
                Konfirmasi Tambah Barang?
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]"
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirm}
                  className="px-6 py-2 rounded-md font-medium bg-[#1ABCCB] text-white"
                >
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

export default ManageBarang;