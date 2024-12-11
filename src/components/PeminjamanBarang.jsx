import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { BarangService } from "../services/BarangService";
import { PeminjamanBarangService } from "../services/PeminjamanBarangService";
import SuccessModal from "../components/SuccessModal";

const PeminjamanBarang = () => {
  const [showModal, setShowModal] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [scanActive, setScanActive] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const [barangData, setBarangData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    division: "",
    durasi: "",
    keterangan: "",
  });

  const checkBarangExists = async (codeBarang) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await BarangService.getBarangByCode(codeBarang);

      if (response.success && response.barang) {
        setBarangData(response.barang);
        setScannedData(codeBarang);
      } else {
        throw new Error("Barang tidak ditemukan");
      }
    } catch (error) {
      setError(error.message || "Barang tidak terdaftar dalam database");
      setScannedData(null);
      setBarangData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async (err, result) => {
    if (result) {
      setScanActive(false);
      await checkBarangExists(result.text);
    } else if (err) {
      console.error("Scan Error:", err);
      setError("Error scanning barcode");
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) {
      setError("Please enter a barcode");
      return;
    }
    await checkBarangExists(barcodeInput);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      nip: "",
      division: "",
      durasi: "",
      keterangan: "",
    });
    setScannedData(null);
    setBarangData(null);
    setError("");
    setBarcodeInput("");
    setManualInput(false);
    setScanActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!barangData) {
      setError("Silakan scan atau input barcode terlebih dahulu");
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await PeminjamanBarangService.createPeminjaman(barangData._id, formData);

      if (result.success) {
        setShowModal(false);
        setShowSuccessModal(true);
        handleReset();
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat membuat peminjaman");
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBarcodeInput = () => {
    if (!scanActive && !manualInput) {
      return (
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => setScanActive(true)}
            disabled={isLoading}
            className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB] text-white disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Start Scan"}
          </button>
          <button
            onClick={() => setManualInput(true)}
            disabled={isLoading}
            className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]"
          >
            Input Manual
          </button>
        </div>
      );
    }

    if (scanActive) {
      return (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <BarcodeScannerComponent
              width={300}
              height={300}
              onUpdate={handleScan}
            />
          </div>
          <button
            onClick={() => {
              setScanActive(false);
              setManualInput(true);
            }}
            className="w-full px-8 py-3 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]"
          >
            Switch to Manual Input
          </button>
        </div>
      );
    }

    if (manualInput) {
      return (
        <div className="space-y-4">
          <form onSubmit={handleManualSubmit} className="flex space-x-2">
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Enter barcode..."
              className="flex-1 p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB] text-white disabled:opacity-50"
            >
              Check
            </button>
          </form>
          <button
            onClick={() => {
              setManualInput(false);
              setScanActive(true);
            }}
            className="w-full px-8 py-3 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]"
          >
            Switch to Scanner
          </button>
        </div>
      );
    }
  };

  return (
    <main className="flex-1 lg:ml-[300px] p-4 transition-all duration-500 bg-gray-100">
      <div className="flex flex-col items-center p-4 md:p-8">
        {error && (
          <div className="w-full max-w-md mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="w-full max-w-md mb-8">
          {renderBarcodeInput()}

          {barangData && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="font-medium">Scanned Barang:</p>
              <p className="text-gray-600">Code: {barangData.codeBarang}</p>
              <p className="text-gray-600">Name: {barangData.name}</p>
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
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap"
                  required
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  NIP / NIM
                </label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleInputChange}
                  placeholder="..."
                  required
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Divisi / Jurusan
                </label>
                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  placeholder="..."
                  required
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
                  name="durasi"
                  value={formData.durasi}
                  onChange={handleInputChange}
                  placeholder="..."
                  required
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3">
                Keperluan Peminjaman
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleInputChange}
                rows="6"
                placeholder="Tuliskan keterangan peminjaman"
                required
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!barangData || isLoading}
                className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB] text-white disabled:opacity-50"
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
                  disabled={isLoading}
                  className="px-6 py-2 rounded-md font-medium bg-[#1ABCCB40] text-[#1ABCCB]"
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="px-6 py-2 rounded-md font-medium bg-[#1ABCCB] text-white"
                >
                  {isLoading ? 'Processing...' : 'Konfirmasi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    <SuccessModal 
      isOpen={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      message="Peminjaman berhasil dibuat"
    />
    </main>
  );
};

export default PeminjamanBarang;