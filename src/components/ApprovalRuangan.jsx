import React, { useState, useEffect, useMemo } from 'react';
import { PeminjamanRuanganService } from '../services/PeminjamanRuanganService';
import { ApproveService } from '../services/ApproveService';
import { Check, X } from 'lucide-react';

const ApprovalPeminjamanRuangan = () => {
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const limit = 15;

  const fetchPeminjamanRuangan = async () => {
    try {
      setLoading(true);
      const response = await PeminjamanRuanganService.getAllPeminjaman(page, limit);
      if (response.success) {
        setPeminjamanData(response.data);
      }
    } catch (err) {
      setError('Gagal memuat data peminjaman ruangan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeminjamanRuangan();
  }, [page]);

  const handleApprove = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menyetujui peminjaman ini?')) {
      try {
        setIsProcessing(true);
        await ApproveService.approveBooking(id, {
          approvedBy: localStorage.getItem('username') || 'Admin',
          notes: 'Disetujui'
        });
        await fetchPeminjamanRuangan();
      } catch (err) {
        setError('Gagal menyetujui peminjaman');
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menolak peminjaman ini?')) {
      try {
        setIsProcessing(true);
        await PeminjamanRuanganService.selesaiPeminjaman(id);
        await fetchPeminjamanRuangan();
      } catch (err) {
        setError('Gagal menolak peminjaman');
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return peminjamanData;

    return peminjamanData.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorTelepon?.includes(searchQuery) ||
      item.keperluan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ruanganId?.unit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ruanganId?.ruanganId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [peminjamanData, searchQuery]);

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

  const BookingCard = ({ item }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Ruangan:</span>
          <p className="font-medium">{item.ruanganId?.unit || 'N/A'} ({item.ruanganId?.ruanganId || 'N/A'})</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Peminjam:</span>
          <p className="font-medium">{item.name || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Email:</span>
          <p className="font-medium">{item.email || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">No. Telepon:</span>
          <p className="font-medium">{item.nomorTelepon || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Waktu Mulai:</span>
          <p className="font-medium">{formatDate(item.startTime)}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Waktu Selesai:</span>
          <p className="font-medium">{formatDate(item.endTime)}</p>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500 text-sm">Keperluan:</span>
          <p className="font-medium">{item.keperluan || 'N/A'}</p>
        </div>
        <div className="col-span-2 text-xs text-gray-400">
          ID: {item._id}
        </div>
        <div className="col-span-2 mt-4 flex justify-end gap-2">
          <button
            onClick={() => handleReject(item._id)}
            disabled={isProcessing}
            className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center gap-2"
          >
            <X size={16} />
            {isProcessing ? 'Memproses...' : 'Tolak'}
          </button>
          <button
            onClick={() => handleApprove(item._id)}
            disabled={isProcessing}
            className="px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center gap-2"
          >
            <Check size={16} />
            {isProcessing ? 'Memproses...' : 'Setujui'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex-1 lg:ml-[300px] p-4 md:p-8 transition-all duration-500 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-sm rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-center mb-6">
          Approval Peminjaman Ruangan
        </h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, ruangan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {loading ? (
          <div className="text-center py-4">Memuat data...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {searchQuery ? 'Tidak ada hasil yang ditemukan' : 'Tidak ada permintaan peminjaman'}
          </div>
        ) : (
          <>
            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-4 text-gray-600">ID Peminjaman</th>
                    <th className="py-2 px-4 text-gray-600">Ruangan</th>
                    <th className="py-2 px-4 text-gray-600">Peminjam</th>
                    <th className="py-2 px-4 text-gray-600">Email</th>
                    <th className="py-2 px-4 text-gray-600">No. Telepon</th>
                    <th className="py-2 px-4 text-gray-600">Waktu Mulai</th>
                    <th className="py-2 px-4 text-gray-600">Waktu Selesai</th>
                    <th className="py-2 px-4 text-gray-600">Keperluan</th>
                    <th className="py-2 px-4 text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item._id} className="border-t border-gray-100">
                      <td className="py-2 px-4 text-gray-600">{item._id}</td>
                      <td className="py-2 px-4 text-gray-600">
                        {item.ruanganId?.unit || 'N/A'} ({item.ruanganId?.ruanganId || 'N/A'})
                      </td>
                      <td className="py-2 px-4 text-gray-600">{item.name || 'N/A'}</td>
                      <td className="py-2 px-4 text-gray-600">{item.email || 'N/A'}</td>
                      <td className="py-2 px-4 text-gray-600">{item.nomorTelepon || 'N/A'}</td>
                      <td className="py-2 px-4 text-gray-600">{formatDate(item.startTime)}</td>
                      <td className="py-2 px-4 text-gray-600">{formatDate(item.endTime)}</td>
                      <td className="py-2 px-4 text-gray-600">{item.keperluan || 'N/A'}</td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(item._id)}
                            disabled={isProcessing}
                            className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center gap-2"
                          >
                            <X size={16} />
                            {isProcessing ? 'Memproses...' : 'Tolak'}
                          </button>
                          <button
                            onClick={() => handleApprove(item._id)}
                            disabled={isProcessing}
                            className="px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center gap-2"
                          >
                            <Check size={16} />
                            {isProcessing ? 'Memproses...' : 'Setujui'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="md:hidden">
              {filteredData.map((item) => (
                <BookingCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
        
        <div className="mt-6 flex justify-between items-center px-2">
          <button 
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm bg-gray-100 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">Page {page}</span>
          <button 
            onClick={() => setPage(prev => prev + 1)}
            disabled={filteredData.length === 0}
            className="px-4 py-2 text-sm bg-gray-100 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
};

export default ApprovalPeminjamanRuangan;