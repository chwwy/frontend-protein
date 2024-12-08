import React, { useState, useEffect } from 'react';
import { PeminjamanBarangService } from '../services/PeminjamanBarangService';

const PeminjamanList = () => {
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await PeminjamanBarangService.getAllPeminjaman(page, limit);
        setPeminjamanData(response.data.peminjaman || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      date.setHours(date.getHours() - 7);
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateHour = (dateString) => {
    try {
      const date = new Date(dateString);
      date.setHours(date.getHours() - 7);
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Mobile card component
  const PeminjamanCard = ({ item }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Kode Barang:</span>
          <p className="font-medium">{item.codeBarang || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Nama Barang:</span>
          <p className="font-medium">{item.barangId?.name || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Nama Peminjam:</span>
          <p className="font-medium">{item.name || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">NIP:</span>
          <p className="font-medium">{item.nip || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Divisi:</span>
          <p className="font-medium">{item.division || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Durasi:</span>
          <p className="font-medium">{item.durasi || 0} hari</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Keterangan:</span>
          <p className="font-medium">{item.keterangan || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Tanggal Pinjam:</span>
          <p className="font-medium">{formatDate(item.createdAt)}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Status:</span>
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
            item.status === 'Selesai' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {item.status}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex-1 lg:ml-[300px] p-4 md:p-8 transition-all duration-500 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-sm rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-center mb-6">
          Daftar Peminjaman Barang
        </h2>

        {/* Search input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari berdasarkan nama peminjam, barang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-4">Memuat data...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : peminjamanData.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Tidak ada data peminjaman
          </div>
        ) : (
          <>
            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-4 text-gray-600">Kode Barang</th>
                    <th className="py-2 px-4 text-gray-600">Nama Barang</th>
                    <th className="py-2 px-4 text-gray-600">Peminjam</th>
                    <th className="py-2 px-4 text-gray-600">NIP</th>
                    <th className="py-2 px-4 text-gray-600">Divisi</th>
                    <th className="py-2 px-4 text-gray-600">Durasi</th>
                    <th className="py-2 px-4 text-gray-600">Keterangan</th>
                    <th className="py-2 px-4 text-gray-600">Tanggal Pinjam</th>
                    <th className="py-2 px-4 text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {peminjamanData.map((item) => (
                    <tr key={item._id} className="border-t border-gray-100">
                      <td className="py-2 px-4 text-gray-600">{item.codeBarang}</td>
                      <td className="py-2 px-4 text-gray-600">{item.barangId?.name}</td>
                      <td className="py-2 px-4 text-gray-600">{item.name}</td>
                      <td className="py-2 px-4 text-gray-600">{item.nip}</td>
                      <td className="py-2 px-4 text-gray-600">{item.division}</td>
                      <td className="py-2 px-4 text-gray-600">{item.durasi} jam</td>
                      <td className="py-2 px-4 text-gray-600">{item.keterangan}</td>
                      <td className="py-2 px-4 text-gray-600">{formatDate(item.createdAt)} pukul {formatDateHour(item.createdAt)}</td>
                      <td className="py-2 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          item.status === 'Selesai'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="md:hidden">
              {peminjamanData.map((item) => (
                <PeminjamanCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Previous
          </button>
          <span className="text-gray-600">Page {page}</span>
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={peminjamanData.length < limit}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
};

export default PeminjamanList;