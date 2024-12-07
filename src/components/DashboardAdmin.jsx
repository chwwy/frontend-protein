import React, { useState, useEffect } from "react";
import { BsHouseDoor, BsBox2, BsArrowReturnLeft } from "react-icons/bs";
import TitlePage from "../partials/TitlePage.jsx";
import { RuanganService } from "../services/RuanganService";
import { BarangService } from "../services/BarangService";
import { PeminjamanBarangService } from "../services/PeminjamanBarangService";

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState("room");
  const [stats, setStats] = useState({
    ruanganTersedia: 0,
    barangTersedia: 0,
    barangDikembalikan: 0
  });
  const [ruanganData, setRuanganData] = useState([]);
  const [barangData, setBarangData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPeminjamanData = async (codeBarang) => {
    try {
      const response = await PeminjamanBarangService.getPeminjamanByCode(codeBarang);
      if (response.success && response.data) {
        return response.data.name; // Return the PIC name
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
            setRuanganData(ruanganResponse.data);
            const availableRooms = ruanganResponse.data.filter(room => room.status === "Tersedia").length;
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
            const returnedItems = barangWithPIC.filter(item => item.status === "Dikembalikan").length;
            
            setStats(prev => ({
              ...prev,
              barangTersedia: availableItems,
              barangDikembalikan: returnedItems
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
    { title: "Ruangan Tersedia", value: stats.ruanganTersedia, icon: <BsHouseDoor /> },
    { title: "Barang Tersedia", value: stats.barangTersedia, icon: <BsBox2 /> },
    { title: "Barang yang Dikembalikan", value: stats.barangDikembalikan, icon: <BsArrowReturnLeft /> },
  ];

  const tableHeaders = {
    room: ["Room ID", "Unit", "Status", "Date", "Action"],
    item: ["Item ID", "Item Name", "Status", "Peminjam Terakhir", "Date", "Action"],
  };

  if (loading) {
    return (
      <main className="flex-1 lg:ml-[300px] p-4 md:p-8 transition-all duration-500 bg-gray-100 min-h-screen">
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return '-';
    }
  };

  return (
    <main className="flex-1 lg:ml-[300px] p-4 md:p-8 transition-all duration-500 bg-gray-100 min-h-screen">
      <TitlePage title="Dashboard" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
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
          onClick={() => setActiveTab("room")}
          className={`px-6 py-2 rounded-md text-sm mr-2 ${
            activeTab === "room" ? "bg-white shadow-sm" : "bg-[#E6E5E7]"
          }`}
        >
          Ruangan
        </button>
        <button
          onClick={() => setActiveTab("item")}
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
                ruanganData.length > 0 ? (
                  ruanganData.map((room) => (
                    <tr key={room._id} className="border-t border-gray-100 text-center">
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{room.ruanganId}</td>
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{room.unit}</td>
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{room.status}</td>
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{formatDate(room.updatedAt)}</td>
                      <td className="py-2 px-3 md:px-4 text-xs md:text-sm flex justify-center">
                        <button className="bg-blue-500 text-white rounded p-1 mr-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button className="bg-red-500 text-white rounded p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      Tidak ada data ruangan tersedia
                    </td>
                  </tr>
                )
              ) : barangData.length > 0 ? (
                barangData.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 text-center">
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{item.codeBarang}</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{item.name}</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{item.status}</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{item.pic || '-'}</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">{formatDate(item.updatedAt)}</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm flex justify-center">
                      <button className="bg-blue-500 text-white rounded p-1 mr-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button className="bg-red-500 text-white rounded p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    Tidak ada data barang tersedia
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