import React from 'react';
import DashboardSidebarAdmin from '../layouts/DashboardSidebarAdmin';
import ManageRuangan from '../components/ManageRuangan';

const ManageRuanganView = () => {
    return (
        <div className="flex">
            <DashboardSidebarAdmin />
            <ManageRuangan />
        </div>
    );
};

export default ManageRuanganView;