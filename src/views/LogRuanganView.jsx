import React from 'react';
import DashboardSidebarAdmin from '../layouts/DashboardSidebarAdmin';
import LogRuangan from '../components/LogRuangan';

const AdminView = () => {
    return (
        <div className="flex">
            <DashboardSidebarAdmin />
            <LogRuangan />
        </div>
    );
};

export default AdminView;