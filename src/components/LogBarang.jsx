import React, { useState, useEffect } from 'react';
import TitlePage from '../partials/TitlePage.jsx';

const PeminjamanList = () => {
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeminjaman = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3987/peminjaman?page=${page}`);
        const data = await response.json();
        
        if (data.peminjaman) {
          setPeminjamanData(data.peminjaman);
        }
      } catch (err) {
        setError('Gagal memuat data peminjaman');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeminjaman();
  }, [page]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      date.setHours(date.getHours());
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <main className="flex-1 lg:ml-[300px] p-4 md:p-8 transition-all duration-500 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-6">
          Daftar Peminjaman Barang
        </h2>
        
        {loading ? (
          <div className="text-center py-4">Memuat data...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-2 px-4 text-gray-600">ID Peminjaman</th>
                  <th className="py-2 px-4 text-gray-600">Nama Barang</th>
                  <th className="py-2 px-4 text-gray-600">Peminjam</th>
                  <th className="py-2 px-4 text-gray-600">Tanggal Pinjam</th>
                  <th className="py-2 px-4 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {peminjamanData.map((item) => (
                  <tr key={item._id} className="border-t border-gray-100">
                    <td className="py-2 px-4 text-gray-600">{item._id}</td>
                    <td className="py-2 px-4 text-gray-600">{item.barangId?.name || 'N/A'}</td>
                    <td className="py-2 px-4 text-gray-600">{item.name || 'N/A'}</td>
                    <td className="py-2 px-4 text-gray-600">
                      {formatDate(item.createdAt)}
                    </td>
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
        )}
        
        <div className="mt-6 flex justify-between items-center">
          <button 
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">Page {page}</span>
          <button 
            onClick={() => setPage(prev => prev + 1)}
            disabled={peminjamanData.length === 0}
            className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
};

export default PeminjamanList;