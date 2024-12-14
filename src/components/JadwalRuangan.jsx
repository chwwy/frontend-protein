import React, { useState, useEffect, useMemo } from 'react';
import { ApproveService } from '../services/ApproveService';

const JadwalRuangan = () => {
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 15;

  
  useEffect(() => {
    const fetchApprovedBookings = async () => {
      try {
        setLoading(true);
        const response = await ApproveService.getAllApprovedBookings();
        console.log('Response data:', response); // Add this debug log
        
        if (response.success) {
          const now = new Date();
          console.log('Current time:', now); // Add this debug log
          
          const activeBookings = response.data.filter(booking => {
            const endTime = new Date(booking.endTime);
            console.log('Booking end time:', endTime); // Add this debug log
            console.log('Booking status:', booking.bookingStatus); // Add this debug log
            
            return new Date(booking.endTime) >= now && booking.bookingStatus === 'Active';
          });
          
          console.log('Filtered bookings:', activeBookings); // Add this debug log
          setPeminjamanData(activeBookings);
        }
      } catch (err) {
        console.error('Error details:', err); // Enhanced error logging
        setError('Gagal memuat data jadwal ruangan');
      } finally {
        setLoading(false);
      }
    };
  
    fetchApprovedBookings();
  }, [page]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return peminjamanData;

    return peminjamanData.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const getStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    start.setHours(start.getHours());
    end.setHours(end.getHours());
  
    if (now >= start && now <= end) {
      return "Dipakai";      
    } else {
      return "Akan Datang";  
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
          <td className="py-2 px-4">
          <div className="col-span-2">
            <span className="text-gray-500 text-sm">Status:</span>
            <span className={`inline-block px-2 py-1 rounded-full text-sm ${
              getStatus(item.startTime, item.endTime) === 'Dipakai'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {getStatus(item.startTime, item.endTime)}
            </span>
          </div>
          </td>
        </div>
      </div>
    );

    return (
      <main className="flex-1 lg:ml-[300px] p-4 md:p-8 transition-all duration-500 bg-gray-100 min-h-screen">
        <div className="bg-white shadow-sm rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            Jadwal Booking Ruangan
          </h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari berdasarkan nama, ruangan, keperluan..."
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
              {searchQuery ? 'Tidak ada hasil yang ditemukan' : 'Tidak ada jadwal booking ruangan'}
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2 px-4 text-gray-600">Ruangan</th>
                      <th className="py-2 px-4 text-gray-600">Status</th>
                      <th className="py-2 px-4 text-gray-600">Peminjam</th>
                      <th className="py-2 px-4 text-gray-600">Waktu Mulai</th>
                      <th className="py-2 px-4 text-gray-600">Waktu Selesai</th>
                      <th className="py-2 px-4 text-gray-600">Keperluan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item._id} className="border-t border-gray-100">
                        <td className="py-2 px-4 text-gray-600">
                          {item.ruanganId?.unit || 'N/A'} ({item.ruanganId?.ruanganId || 'N/A'})
                        </td>
                        <td className="py-2 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                            getStatus(item.startTime, item.endTime) === 'Dipakai'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {getStatus(item.startTime, item.endTime)}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-gray-600">{item.name || 'N/A'}</td>
                        <td className="py-2 px-4 text-gray-600">{formatDate(item.startTime)}</td>
                        <td className="py-2 px-4 text-gray-600">{formatDate(item.endTime)}</td>
                        <td className="py-2 px-4 text-gray-600">{item.keperluan || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

  export default JadwalRuangan;