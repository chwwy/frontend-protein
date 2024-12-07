import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { PeminjamanBarangService } from "../services/PeminjamanBarangService";
import SuccessModal from "../components/SuccessModal";

const PengembalianBarang = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [scanActive, setScanActive] = useState(false);
  const [peminjamanData, setPeminjamanData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkPeminjamanExists = async (codeBarang) => {
    try {
      setIsLoading(true);
      setError("");
      const result = await PeminjamanBarangService.getPeminjamanByCode(codeBarang);
      if (result.success && result.data) {
        setPeminjamanData(result.data);
      } else {
        throw new Error("Barang tidak dalam status peminjaman");
      }
    } catch (error) {
      setError(error.message || "Barang tidak ditemukan dalam daftar peminjaman");
      setScannedData(null);
      setPeminjamanData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async (err, result) => {
    if (result) {
      setScanActive(false);
      setScannedData(result.text);
      await checkPeminjamanExists(result.text);
    } else if (err) {
      console.error("Scan Error:", err);
      setError("Error scanning barcode");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!peminjamanData) {
      setError("Silakan scan barang terlebih dahulu");
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await PeminjamanBarangService.pengembalianBarang(peminjamanData._id);

      if (result.success) {
        setShowModal(false);
        setShowSuccessModal(true);
        // Reset form
        setScannedData(null);
        setPeminjamanData(null);
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengembalikan barang");
    } finally {
      setIsLoading(false);
      setShowModal(false);
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
          {!scanActive ? (
            <button
              onClick={() => setScanActive(true)}
              disabled={isLoading}
              className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB] text-white disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Start Scan"}
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

          {peminjamanData && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="font-medium">Detail Peminjaman:</p>
              <p className="text-gray-600">Code: {peminjamanData.codeBarang}</p>
              <p className="text-gray-600">Peminjam: {peminjamanData.name}</p>
              <p className="text-gray-600">NIP/NIM: {peminjamanData.nip}</p>
              <p className="text-gray-600">Divisi: {peminjamanData.division}</p>
            </div>
          )}
        </div>

        <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Pengembalian Barang
          </h2>
          <h3 className="text-md mb-4">
            Pastikan barang dalam kondisi yang baik sebelum dikembalikan.
          </h3>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={!peminjamanData || isLoading}
                className="px-8 py-3 rounded-md font-medium bg-[#1ABCCB] text-white disabled:opacity-50"
              >
                Kembalikan
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
                Konfirmasi Pengembalian?
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
                  {isLoading ? "Processing..." : "Konfirmasi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Barang berhasil dikembalikan"
      />
    </main>
  );
};

export default PengembalianBarang;