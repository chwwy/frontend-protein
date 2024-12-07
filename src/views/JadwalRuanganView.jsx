import React from 'react';
import DashboardSidebar from '../layouts/DashboardSidebar';
import JadwalRuangan from '../components/JadwalRuangan';

const JadwalRuanganView = () => {
    return (
        <div className="flex">
            <DashboardSidebar />
            <JadwalRuangan />
        </div>
    );
};

export default JadwalRuanganView;