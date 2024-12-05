import React from 'react';
import DashboardSidebar from '../layouts/DashboardSidebar';
import DashboardContent from '../components/DashboardContent';

const DashboardView = () => {
    return (
        <div className="flex">
            <DashboardSidebar />
            <DashboardContent />
        </div>
    );
};

export default DashboardView;