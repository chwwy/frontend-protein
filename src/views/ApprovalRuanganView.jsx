import React from 'react';
import DashboardSidebarAdmin from '../layouts/DashboardSidebarAdmin';
import ApprovalRuangan from '../components/ApprovalRuangan';

const ApprovalRuanganView = () => {
    return (
        <div className="flex">
            <DashboardSidebarAdmin />
            <ApprovalRuangan />
        </div>
    );
};

export default ApprovalRuanganView;