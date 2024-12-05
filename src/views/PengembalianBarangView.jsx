import React from 'react';
import DashboardSidebar from '../layouts/DashboardSidebar';
import PengembalianBarang from '../components/PengembalianBarang';

const PengembalianBarangView = () => {
    return (
        <div className="flex">
            <DashboardSidebar />
            <PengembalianBarang />
        </div>
    );
};

export default PengembalianBarangView;