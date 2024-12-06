import React, { useState } from "react";
import { BsHouseDoor, BsBox2, BsArrowReturnLeft } from "react-icons/bs";
import TitlePage from "../partials/TitlePage.jsx";

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState("room");

  const statsData = [
    { title: "Ruangan Tersedia", value: "40", icon: <BsHouseDoor /> },
    { title: "Barang Tersedia", value: "211", icon: <BsBox2 /> },
    { title: "Barang yang Dikembalikan", value: "25", icon: <BsArrowReturnLeft /> },
  ];

  const tableHeaders = {
    room: ["Room ID", "Unit", "Status", "PIC", "Date", "Action"],
    item: ["Item ID", "Item Name", "Status", "PIC", "Date", "Action"],
  };

  return (
    <main className="flex-1 lg:ml-[300px] p-4 md:p-8 transition-all duration-500 bg-gray-100 min-h-screen">
      <TitlePage title="Dashboard" />

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

      {/* Table Section */}
      <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          {activeTab === "room" ? "Room" : "Item"} Status
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
              <tr className="border-t border-gray-100 text-center">
                {activeTab === "room" ? (
                  <>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">A001</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">Meeting Room</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">Dipakai</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">Dr. Agung, M.D.</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">3 Nov 2024</td>
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
                  </>
                ) : (
                  <>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">91011</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">Chair</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">Dipakai</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">Dr. Agung, M.D.</td>
                    <td className="py-2 px-3 md:px-4 text-xs md:text-sm">3 Nov 2024</td>
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
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
