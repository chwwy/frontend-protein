import React from 'react';
import DashboardSidebar from '../layouts/DashboardSidebar';
import PeminjamanBarang from '../components/PeminjamanBarang';

const PeminjamanBarangView = () => {
    return (
        <div className="flex">
            <DashboardSidebar />
            <PeminjamanBarang />
        </div>
    );
};

export default PeminjamanBarangView;