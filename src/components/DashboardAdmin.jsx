import React, { useState, useEffect, useMemo } from "react";
import { BsHouseDoor, BsBox2, BsArrowReturnLeft } from "react-icons/bs";
import TitlePage from "../partials/TitlePage.jsx";
import { RuanganService } from "../services/RuanganService";
import { BarangService } from "../services/BarangService";
import { PeminjamanBarangService } from "../services/PeminjamanBarangService";
import { LoadingState, ErrorState } from '../components/LoadingErrorStates';
import { PeminjamanRuanganService } from "../services/PeminjamanRuanganService";

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState("room");
  const [stats, setStats] = useState({
    ruanganTersedia: 0,
    barangTersedia: 0,
    barangDipinjam: 0
  });
  const [ruanganData, setRuanganData] = useState([]);
  const [barangData, setBarangData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [peminjamanRuanganData, setPeminjamanRuanganData] = useState([]);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ message: '', type: '' });

  const handleDeleteClick = async (item, type) => {
    const confirmMessage = type === 'room' 
      ? `Apakah Anda yakin ingin menghapus ruangan ${item.ruanganId}?`
      : `Apakah Anda yakin ingin menghapus barang ${item.name}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setDeleteStatus({ message: '', type: '' });

      if (type === 'room') {
        const response = await RuanganService.deleteRuangan(item._id);
        if (response.success) {
          setRuanganData(prev => prev.filter(room => room._id !== item._id));
          setDeleteStatus({
            message: `Ruangan ${item.ruanganId} berhasil dihapus`,
            type: 'success'
          });
        }
      } else {
        const response = await BarangService.deleteBarang(item._id);
        if (response.success) {
          setBarangData(prev => prev.filter(barang => barang._id !== item._id));
          setDeleteStatus({
            message: `Barang ${item.name} berhasil dihapus`,
            type: 'success'
          });
        }
      }

      if (type === 'room') {
        setStats(prev => ({
          ...prev,
          ruanganTersedia: prev.ruanganTersedia - 1
        }));
      } else {
        setStats(prev => ({
          ...prev,
          barangTersedia: item.status === 'Tersedia' ? prev.barangTersedia - 1 : prev.barangTersedia,
          barangDipinjam: item.status === 'Dipinjam' ? prev.barangDipinjam - 1 : prev.barangDipinjam
        }));
      }

    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.message || 'Terjadi kesalahan saat menghapus data');
      setDeleteStatus({
        message: err.message || 'Terjadi kesalahan saat menghapus data',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setDeleteStatus({ message: '', type: '' });
      }, 3000);
    }
  };

  const filteredRuanganData = useMemo(() => {
    if (!searchQuery) return ruanganData;

    return ruanganData.filter(room => 
      room.ruanganId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.unit?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ruanganData, searchQuery]);

  const filteredBarangData = useMemo(() => {
    if (!searchQuery) return barangData;

    return barangData.filter(item => 
      item.codeBarang?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [barangData, searchQuery]);

  const getPeminjamanData = async (codeBarang) => {
    try {
      const response = await PeminjamanBarangService.getPeminjamanByCode(codeBarang);
      if (response.success && response.data) {
        return response.data.name;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching peminjaman for ${codeBarang}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          const ruanganResponse = await RuanganService.getAllRuangan();
          if (ruanganResponse.success) {
            const ruanganList = ruanganResponse.data;
            
            const peminjamanPromises = ruanganList.map(async (room) => {
              try {
                const peminjamanResponse = await PeminjamanRuanganService.getPeminjamanByRuanganId(room._id);
                if (peminjamanResponse.success && peminjamanResponse.data.length > 0) {
                  const latestBooking = peminjamanResponse.data.reduce((latest, current) => {
                    return new Date(current.startTime) > new Date(latest.startTime) ? current : latest;
                  });
                  return {
                    ruanganId: room._id,
                    booking: latestBooking
                  };
                }
                return {
                  ruanganId: room._id,
                  booking: null
                };
              } catch (error) {
                console.error(`Error fetching peminjaman for room ${room._id}:`, error);
                return {
                  ruanganId: room._id,
                  booking: null
                };
              }
            });

            const peminjamanResults = await Promise.all(peminjamanPromises);
            const peminjamanMap = peminjamanResults.reduce((acc, curr) => {
              acc[curr.ruanganId] = curr.booking;
              return acc;
            }, {});

            setPeminjamanRuanganData(peminjamanMap);
            setRuanganData(ruanganList);
            const availableRooms = ruanganList.filter(room => room.status === "Tersedia").length;
            setStats(prev => ({
              ...prev,
              ruanganTersedia: availableRooms
            }));
          }
        } catch (ruanganError) {
          console.error("Error fetching ruangan data:", ruanganError);
          setError("Terjadi kesalahan saat mengambil data ruangan");
        }

        try {
          const barangResponse = await BarangService.getAllBarang(1, 100);
          if (barangResponse.success) {
            const barangWithPIC = await Promise.all(
              barangResponse.data.map(async (item) => {
                const pic = await getPeminjamanData(item.codeBarang);
                return {
                  ...item,
                  pic: pic || '-'
                };
              })
            );

            setBarangData(barangWithPIC);
            const availableItems = barangWithPIC.filter(item => item.status === "Tersedia").length;
            const returnedItems = barangWithPIC.filter(item => item.status === "Dipinjam").length;
            
            setStats(prev => ({
              ...prev,
              barangTersedia: availableItems,
              barangDipinjam: returnedItems
            }));
          }
        } catch (barangError) {
          console.error("Error fetching barang data:", barangError);
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    { title: "Barang Tersedia", value: stats.barangTersedia, icon: <BsBox2 /> },
    { title: "Barang yang Dipinjam", value: stats.barangDipinjam, icon: <BsArrowReturnLeft /> },
  ];

  const tableHeaders = {
    room: ["Room ID", "Unit", "Status Terakhir", "Tanggal", "Action"],
    item: ["Item ID", "Item Name", "Status", "Peminjam Terakhir", "Tanggal", "Jam", "Action"],
  };

  const formatDateHour = (dateString) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch (e) {
        return '-';
    }
  };

  const formatDateDay = (dateString) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch (e) {
        return '-';
    }
  };

  if (loading) {
    return (
      <main className="flex-1 lg:ml-[300px] p-4 md:p-8 transition-all duration-500 bg-gray-100 min-h-screen">
        <TitlePage title="Dashboard" />
        <LoadingState />
      </main>
    );
  }

  return (
    <main className="flex-1 lg:ml-[300px] p-4 md:p-8 transition-all duration-500 bg-gray-100 min-h-screen">
      <TitlePage title="Dashboard" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {deleteStatus.message && (
        <div className={`${
          deleteStatus.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
        } px-4 py-3 rounded relative mb-4`}>
          <span className="block sm:inline">{deleteStatus.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {statsData.map((item, index) => (
          <div key={index} className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-gray-600 font-medium">{item.title}</h3>
            <h1 className="text-3xl font-bold my-2 flex items-center justify-between">
              <span>{item.value}</span>
              <span className="flex items-center">{item.icon}</span>
            </h1>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={() => {
            setActiveTab("room");
            setSearchQuery('');
          }}
          className={`px-6 py-2 rounded-md text-sm mr-2 ${
            activeTab === "room" ? "bg-white shadow-sm" : "bg-[#E6E5E7]"
          }`}
        >
          Ruangan
        </button>
        <button
          onClick={() => {
            setActiveTab("item");
            setSearchQuery('');
          }}
          className={`px-6 py-2 rounded-md text-sm ${
            activeTab === "item" ? "bg-white shadow-sm" : "bg-[#E6E5E7]"
          }`}
        >
          Barang
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          Status {activeTab === "room" ? "Ruangan" : "Barang"}
        </h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder={`Cari ${activeTab === "room" ? "ruangan" : "barang"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {tableHeaders[activeTab].map((header) => (
                  <th
                    key={header}
                    className="py-2 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-600 bg-gray-50"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeTab === "room" ? (
                filteredRuanganData.length > 0 ? (
                  filteredRuanganData.map((room) => {
                    const booking = peminjamanRuanganData[room._id];
                    return (
                      <tr key={room._id} className="border-t border-gray-100 text-center">
                        <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{room.ruanganId}</td>
                        <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{room.unit}</td>
                        <td className="py-2 px-3 md:px-4 text-xs md:text-sm">
                          {booking ? 
                            `${formatDateHour(booking.startTime)} - ${formatDateHour(booking.endTime)}` 
                            : '-'}
                        </td>
                        <td className="py-2 px-3 md:px-4 text-xs md:text-sm">
                          {booking ? 
                            `${formatDateDay(booking.startTime)}` 
                            : '-'}
                        </td>
                        <td className="py-2 px-3 md:px-4 text-xs md:text-sm flex justify-center">
                          <button className="bg-red-500 text-white rounded p-1" onClick={() => handleDeleteClick(room, 'room')}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      {searchQuery ? 'Tidak ada ruangan yang ditemukan' : 'Tidak ada data ruangan tersedia'}
                    </td>
                  </tr>
                )
              ) : filteredBarangData.length > 0 ? (
                filteredBarangData.map((item) => {
                  return (
                    <tr key={item.id} className="border-t border-gray-100 text-center">
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{item.codeBarang}</td>
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{item.name}</td>
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{item.status}</td>
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{item.pic || '-'}</td>
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{formatDateDay(item.updatedAt)}</td>
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{formatDateHour(item.updatedAt)}</td>
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm flex justify-center">
                        <button className="bg-red-500 text-white rounded p-1 " onClick={() => handleDeleteClick(item, 'item')}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                  {searchQuery ? 'Tidak ada barang yang ditemukan' : 'Tidak ada data barang tersedia'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;