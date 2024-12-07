import React from 'react';
import DashboardSidebarAdmin from '../layouts/DashboardSidebarAdmin';
import DashboardAdmin from '../components/DashboardAdmin';

const ManageAdminView = () => {
    return (
        <div className="flex">
            <DashboardSidebarAdmin />
            <DashboardAdmin />
        </div>
    );
};

export default ManageAdminView;