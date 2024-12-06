import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeLogo from '../assets/Logo Kemenkes.png';
import { MdOutlineSpaceDashboard, MdOutlineLogin, MdOutlineAdminPanelSettings } from "react-icons/md";

const DashboardSidebar = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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


                    <div className="flex items-center p-2 cursor-pointer justify-between">
                            <div className="flex items-center">
                                <MdOutlineAdminPanelSettings size={24} className="text-gray-600" />
                                <span className="ml-4 text-gray-700">
                                    <Link to="/dashboard/manage-admin">Manage Admin</Link>
                                </span>
                            </div>
                    </div>

                    <div className="flex items-center p-2 cursor-pointer justify-between">
                            <div className="flex items-center">
                                <MdOutlineLogin size={24} className="text-gray-600" />
                                <span className="ml-4 text-gray-700">
                                    <Link to="/">Login</Link>
                                </span>
                            </div>
                    </div>
               </nav>
           </aside>
       </>
   );
};

export default DashboardSidebar;