import React from 'react';
import DashboardSidebar from '../layouts/DashboardSidebar';
import PeminjamanRuangan from '../components/PeminjamanRuangan';

const PeminjamanRuanganView = () => {
    return (
        <div className="flex">
            <DashboardSidebar />
            <PeminjamanRuangan />
        </div>
    );
};

export default PeminjamanRuanganView;