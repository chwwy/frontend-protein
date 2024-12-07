import React from 'react';
import DashboardSidebarAdmin from '../layouts/DashboardSidebarAdmin';
import LogBarang from '../components/LogBarang';

const LogBarangView = () => {
    return (
        <div className="flex">
            <DashboardSidebarAdmin />
            <LogBarang />
        </div>
    );
};

export default LogBarangView;