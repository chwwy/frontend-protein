import React from 'react';
import DashboardSidebarAdmin from '../layouts/DashboardSidebarAdmin';
import ManageAdmin from '../components/ManageAdmin';

const ManageAdminView = () => {
    return (
        <div className="flex">
            <DashboardSidebarAdmin />
            <ManageAdmin />
        </div>
    );
};

export default ManageAdminView;