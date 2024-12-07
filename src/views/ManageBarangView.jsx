import React from 'react';
import DashboardSidebarAdmin from '../layouts/DashboardSidebarAdmin';
import ManageBarang from '../components/ManageBarang';

const ManageBarangView = () => {
    return (
        <div className="flex">
            <DashboardSidebarAdmin />
            <ManageBarang />
        </div>
    );
};

export default ManageBarangView;