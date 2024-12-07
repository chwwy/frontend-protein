import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeLogo from '../assets/Logo Kemenkes.png';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdOutlineSpaceDashboard, MdOutlineLogin, MdOutlineInbox, MdInfoOutline } from "react-icons/md";

const DashboardSidebar = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [openMenu, setOpenMenu] = useState(null);
   const { logout } = useAuth();
   const navigate = useNavigate();

   const handleLogout = () => {
    logout();
    navigate('/');
    };

   return (
       <>
           <button className="lg:hidden absolute top-5 right-4 text-4xl bg-white shadow-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
               <i className="bi bi-list" />
           </button>

           <aside className={`fixed top-0 w-[300px] h-full bg-white shadow-xl lg:left-0 transition-all 
               ${isSidebarOpen ? 'left-0' : '-left-[300px]'}`}>
               
               <div className="flex items-center justify-between p-4 mr-8 font-semibold">
                   <img src={HomeLogo} alt="Logo" className="h-14 pl-3" />
                   <h1 className="text-2xl text-[#0CB9AC]">RoomCare</h1>
               </div>

               <nav className="mt-16 ml-12 space-y-4 mr-5">
                   {/* Dashboard */}
                   <div>
                        <div className="flex items-center p-2 cursor-pointer justify-between">
                            <div className="flex items-center">
                                <MdOutlineSpaceDashboard size={24} className="text-gray-600" />
                                <span className="ml-4 text-gray-700">
                                    <Link to="/dashboard-admin">Dashboard</Link>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center p-2 cursor-pointer justify-between" 
                            onClick={() => setOpenMenu(openMenu === 1 ? null : 1)}>
                            <div className="flex items-center">
                                <MdOutlineInbox size={24} className="text-gray-600" />
                                <span className="ml-4 text-gray-700">Manage</span>
                            </div>
                            <i className={`bi bi-caret-right-fill text-gray-600 transition-transform ${openMenu === 1 ? 'rotate-90' : ''}`} />
                        </div>
                        <div className={`ml-8 mt-2 space-y-2 ${openMenu === 1 ? 'block' : 'hidden'}`}>
                            <p className="p-2 cursor-pointer text-gray-600 text-sm">
                                <Link to="/dashboard/manage-barang">Barang</Link>
                            </p>
                            <p className="p-2 cursor-pointer text-gray-600 text-sm">
                                <Link to="/dashboard/manage-ruangan">Ruangan</Link>
                            </p>
                            <p className="p-2 cursor-pointer text-gray-600 text-sm">
                                <Link to="/dashboard/manage-admin">Admin</Link>
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center p-2 cursor-pointer justify-between" 
                            onClick={() => setOpenMenu(openMenu === 2 ? null : 2)}>
                            <div className="flex items-center">
                                <MdInfoOutline size={24} className="text-gray-600" />
                                <span className="ml-4 text-gray-700">Log Peminjaman</span>
                            </div>
                            <i className={`bi bi-caret-right-fill text-gray-600 transition-transform ${openMenu === 2 ? 'rotate-90' : ''}`} />
                        </div>
                        <div className={`ml-8 mt-2 space-y-2 ${openMenu === 2 ? 'block' : 'hidden'}`}>

                            <p className="p-2 cursor-pointer text-gray-600 text-sm">
                                <Link to="/dashboard/log-barang">Barang</Link>
                            </p>
                            <p className="p-2 cursor-pointer text-gray-600 text-sm">
                                <Link to="/dashboard/log-ruangan">Ruangan</Link>
                            </p>
                        </div>
                    </div>


                    <div 
                        className="flex items-center p-2 cursor-pointer justify-between"
                        onClick={handleLogout}
                    >
                        <div className="flex items-center">
                            <MdOutlineLogin size={24} className="text-gray-600" />
                            <span className="ml-4 text-gray-700">
                                Logout
                            </span>
                        </div>
                    </div>
               </nav>
           </aside>
       </>
   );
};

export default DashboardSidebar;